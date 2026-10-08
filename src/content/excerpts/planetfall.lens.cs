    private async Task<string> ProcessActorsAndContextEndOfTurn(string? contextPrepend, string? turnResult,
        bool isFreeCommand = false)
    {
        // Check if player died during the turn (e.g., from location hazards, items, etc.)
        if (Context.PendingDeath is not null)
        {
            var deathResult = Context.PendingDeath;
            // Include any context and turn result before the death message (e.g., "The door opens.")
            // The death message is already in turnResult since it was returned from the interaction
            var preDeathOutput = FormatResult(contextPrepend, turnResult, null, null);
            RestartAfterDeath(deathResult.DeathCount);
            return PostProcessing(preDeathOutput + "\n" + Context.CurrentLocation.GetDescription(Context));
        }

        // Skip actor processing when disambiguation question is being asked
        // The player hasn't completed a real action yet - just asking for clarification
        // Note: When disambiguation is resolved (player answers), the clarified command IS a real action
        var actors = _processorInProgress is DisambiguationProcessor
            ? string.Empty
            : await ProcessActors();

        // Check if player died during actor processing (e.g., Bio Lock mutations)
        if (Context.PendingDeath is not null)
        {
            var deathResult = Context.PendingDeath;
            // The death message is already included in actors output (from BioLockStateMachineManager etc.)
            // We just need to format everything before death, restart, and append the new location
            var preDeathOutput = FormatResult(contextPrepend, turnResult, actors, null);
            RestartAfterDeath(deathResult.DeathCount);
            return PostProcessing(preDeathOutput + "\n" + Context.CurrentLocation.GetDescription(Context));
        }

        // Free commands (issue #354) skip end-of-turn survival-clock processing (e.g. Planetfall's
        // Chronometer tick) - actors above still ran, so the world keeps moving, but the player's own
        // status check doesn't itself consume survival-clock time.
        var contextAppend = isFreeCommand ? null : Context.ProcessEndOfTurn();
        return PostProcessing(FormatResult(contextPrepend, turnResult, actors, contextAppend));
    }

    private string PostProcessing(string finalResult)
    {
        _logger?.LogDebug($"Items in inventory: {Context.LogItems()}");
        _logger?.LogDebug($"Items in location: {Context.CurrentLocation.LogItems()}");
        _logger?.LogDebug($"Moves: {Context.Moves}");

        if (!string.IsNullOrEmpty(_currentInput))
            _turnLogger?.WriteLogEvents(new TurnLog
            {
                SessionId = _sessionId,
                Location = Context.CurrentLocation.Name,
                Score = Context.Score,
                Moves = Context.Moves,
                Input = _currentInput,
                Response = finalResult.Trim()
            });

        if (!string.IsNullOrEmpty(finalResult))
        {
            _inputOutputs.Push((_currentInput!, finalResult, _lastResponseWasGenerated));
            GenerationClient.LastFiveInputOutputs = _inputOutputs.GetAll();
        }

        _lastResponseWasGenerated = false;

        // Store response for pronoun resolution
        var trimmedResult = finalResult.TrimEnd();
        if (!string.IsNullOrWhiteSpace(trimmedResult))
            Context.LastResponse = trimmedResult;

        return trimmedResult + Environment.NewLine;
    }

    private async Task<string> ProcessGlobalCommandIntent(GlobalCommandIntent intent)
    {
        var intentResponse = await intent.Command.Process(
            _currentInput,
            Context,
            GenerationClient,
            Runtime
        );
        if (intent.Command is IStatefulProcessor { Completed: false } statefulProcessor)
            _processorInProgress = statefulProcessor;

        intentResponse += Environment.NewLine;
        return intentResponse;
    }

    private async Task<string> ProcessActors()
    {
        var actorResults = string.Empty;
        foreach (var actor in Context.Actors.ToList())
        {
            _logger?.LogDebug($"Processing actor: {actor.GetType()}");
            var task = await actor.Act(Context, GenerationClient);
            actorResults += $"{task} ";

            // Stop processing actors if death occurred - subsequent actors should not run
            if (Context.PendingDeath is not null)
            {
                _logger?.LogDebug("Death occurred during actor processing, stopping remaining actors");
                break;
            }
        }

        return actorResults.Trim();
    }

    private async Task<(bool, string?)> RunProcessorInProgress(string? playerInput)
    {
        string? processorInProgressOutput = null;
        var immediatelyReturn = false;

        // When this is not null, it means we have another processor in progress.
        // Defer all execution to that processor until it's complete.
        if (_processorInProgress == null)
            return (immediatelyReturn, processorInProgressOutput);

        processorInProgressOutput = await _processorInProgress.Process(
            playerInput,
            Context,
            GenerationClient,
            Runtime
        );

        // The processor is done. Clear it, and see what we want to do with the output.
        if (_processorInProgress.Completed)
        {
            var continueProcessingThisInput = _processorInProgress.ContinueProcessing;
            ClearProcessorInProgress();

            // Does the processor want us to return what it outputted?....
            if (!continueProcessingThisInput)
                immediatelyReturn = true;

            // ....or does it want to push that output through for further processing?
            _currentInput = processorInProgressOutput;
        }
        // Return the output and keep processing? Or are we done here yet.
        else
        {
            immediatelyReturn = true;
        }

        return (immediatelyReturn, processorInProgressOutput);
    }

    /// <summary>
    ///     Arms a pending "which one do you mean?" disambiguation and, crucially, mirrors the two fields
    ///     the answer needs into a serializable descriptor on the <see cref="Context" /> so the prompt
    ///     survives the stateless per-request save/restore boundary (issue #472). The live
    ///     <see cref="DisambiguationProcessor" /> is an in-memory field that is never serialized; the
    ///     descriptor is what actually round-trips and lets <see cref="RehydrateProcessorInProgress" />
    ///     rebuild the processor on the next request.
    /// </summary>
    private void ArmDisambiguation(DisambiguationInteractionResult disambiguation)
    {
        _processorInProgress = new DisambiguationProcessor(disambiguation);
        Context.PendingDisambiguation = new PendingDisambiguation
        {
            PossibleResponses = disambiguation.PossibleResponses,
            ReplacementString = disambiguation.ReplacementString
        };
    }

    /// <summary>
    ///     Clears the in-progress stateful processor together with the persisted descriptors that back the
    ///     two prompts which must survive the request boundary (issue #472). Called whenever a processor
    ///     finishes or is abandoned; clearing both descriptors unconditionally is safe because at most one
    ///     can be set at a time, and the save/quit/restore processors never set either.
    /// </summary>
    private void ClearProcessorInProgress()
    {
        _processorInProgress = null;
        Context.PendingDisambiguation = null;
        Context.PendingClarificationCommand = null;
    }

    /// <summary>
    ///     Reconstructs <see cref="_processorInProgress" /> from whichever pending-prompt descriptor
    ///     round-tripped on the restored <see cref="Context" /> (issue #472). The two descriptors are
    ///     mutually exclusive by construction — a turn arms exactly one prompt — so disambiguation is
    ///     simply checked first. Does nothing when no prompt was pending, leaving normal parsing in charge.
    /// </summary>
    private void RehydrateProcessorInProgress()
    {
        if (Context.PendingDisambiguation is { } pending)
        {
            // The stored prompt text is irrelevant when answering — only the response map and template
            // drive resolution — so rebuild the result with an empty message.
            _processorInProgress = new DisambiguationProcessor(
                new DisambiguationInteractionResult(
                    string.Empty, pending.PossibleResponses, pending.ReplacementString));
            return;
        }

        if (!string.IsNullOrEmpty(Context.PendingClarificationCommand))
            _processorInProgress = new ItProcessor(Context.PendingClarificationCommand);
    }

    private static async Task<string> GetGeneratedNoOpResponse(
        string input,
        IGenerationClient generationClient,
        IContext context
        )
    {
        var request = new CommandHasNoEffectOperationRequest(
            context.CurrentLocation.GetDescriptionForGeneration(context),
            input
        );
        var result = await generationClient.GenerateNarration(request, context.SystemPromptAddendum);
        return result + Environment.NewLine;
    }


    private static async Task<string> GetGeneratedMultipleCommandsResponse(
        string input,
        IGenerationClient generationClient,
        IContext context
        )
    {
        var request = new MultipleCommandsRequest(
            context.CurrentLocation.GetDescriptionForGeneration(context),
            input
        );
        var result = await generationClient.GenerateNarration(request, context.SystemPromptAddendum);
        return result + Environment.NewLine;
    }

    private async Task<string> GetGeneratedNoCommandResponse()
    {
        var request = new EmptyRequest();
        var result = await GenerationClient.GenerateNarration(request, String.Empty);
        return result;
    }

    private static JsonSerializerSettings JsonSettings()
    {
        return new JsonSerializerSettings
        {
            ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
            TypeNameHandling = TypeNameHandling.All,
            PreserveReferencesHandling = PreserveReferencesHandling.Objects,
            ContractResolver = new DoNotSerializeReadOnlyPropertiesResolver(),
            ConstructorHandling = ConstructorHandling.AllowNonPublicDefaultConstructor,
            // Replace collections during deserialization instead of adding to them.
            // This prevents items from accumulating in Items lists across session restores.
            ObjectCreationHandling = ObjectCreationHandling.Replace
        };
    }
}

/// <summary>
/// A custom resolver used to modify the serialization behavior of JSON objects
/// to exclude read-only properties. Extends <see cref="DefaultContractResolver" />
/// and provides a mechanism to exclude non-writable properties from being serialized.
/// </summary>
/// <remarks>
/// This class is useful for scenarios where serialization of read-only properties
/// is not desired, such as when saving the state of objects or generating JSON
/// responses to ensure only editable or writable properties are included.
/// This is achieved by overriding the <see cref="CreateProperty" /> method and adjusting
/// the serialization behavior based on property writability.
/// </remarks>
public class DoNotSerializeReadOnlyPropertiesResolver : DefaultContractResolver
{
    protected override JsonProperty CreateProperty(
        MemberInfo member,
        MemberSerialization memberSerialization
        )
    {
        var property = base.CreateProperty(member, memberSerialization);

        if (!property.Writable) property.ShouldSerialize = _ => false;

        return property;
    }

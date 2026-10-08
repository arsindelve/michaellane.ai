    private async Task<string?> ProcessSingleSentence(string? playerInput)
    {
        _currentInput = playerInput;

        // 1. ------- Processor in Progress -
        // See if we have something already running like a save, quit, etc.
        // and see if it has any output.  Does not count as a turn. No actor or turn processing.
        var (returnProcessorInProgressOutput, processorInProgressOutput) =
            await RunProcessorInProgress(playerInput);

        if (returnProcessorInProgressOutput)
            return PostProcessing(processorInProgressOutput!);

        // After disambiguation resolution, _currentInput may have been updated to the clarified command
        // Use it for all subsequent processing
        playerInput = _currentInput;

        // 2. -------  Empty command. Does not count as a turn. No actor or turn processing.
        if (string.IsNullOrEmpty(playerInput))
            return PostProcessing(await GetGeneratedNoCommandResponse());

        // 2b. ------- "look at <noun>" — and the "look in/inside <noun>" container-inspection phrasings
        // (issue #396) — are examine synonyms, not the bare-room LOOK command. The AI parser collapses
        // "look at X" to a noun-less look intent (issues #312 / #283) and mis-tags "look in X" as an "in"
        // movement ("You cannot go that way."). Rewrite them to the canonical "examine <noun>" here so
        // they route through the examine-with-noun path (which lists an open container's contents), while
        // leaving the bare forms ("look", "look around") and genuinely different prepositions ("look
        // under the rug", "look behind the painting") untouched. Note: because this runs before pronoun
        // resolution and the LastInput capture below, a subsequent "again"/"g" replays "look at X" as
        // "examine X" — harmless, since both produce the same examination output.
        playerInput = NormalizeLookAt(playerInput);
        _currentInput = playerInput;

        Context.PreviousLocationName = LocationName;

        // 3. ------- System, or "meta" commands - like save, restore, quit, verbose etc. Does not count as a turn. No actor or turn processing.
        var systemCommand = _parser.DetermineSystemIntentType(playerInput);
        if (systemCommand is GlobalCommandIntent global)
        {
            var globalResult = await ProcessGlobalCommandIntent(global);
            return PostProcessing(globalResult);
        }

        // 3b. ------- Context-level command override. Lets a game-specific context fully handle the
        // raw command before normal parsing — used by Zork's spirit/DEAD state, which overrides most
        // verbs with canned ghost responses while letting movement and resurrection fall through by
        // returning null (issue #17). Does not count as a turn; no actor or end-of-turn processing.
        var contextOverride = Context.InterceptPlayerCommand(playerInput);
        if (contextOverride is not null)
            return PostProcessing(contextOverride);

        // Determine up front whether this input resolves to a "free" global command - a
        // meta/informational verb (look, inventory, score, current time) that must never advance
        // Context.Moves or a time-based game's survival clock (issue #354). This has to be known
        // BEFORE Context.ProcessBeginningOfTurn() runs (which does exactly that), so it's computed
        // here rather than at its usual step-5 spot below - the result is reused there instead of
        // being recomputed. Actor processing (chase scenes, countdown timers, Floyd, ...) still runs
        // for free commands further down - the world keeps moving even while the player just glances
        // at their status; only the player's own turn/survival-clock bookkeeping is skipped.
        //
        // "again"/"g" replays the previous command - AgainProcessor.Process (below, at its usual
        // spot) resolves that later, but we need to know what it WILL resolve to now, so a replayed
        // free command (e.g. "look" then "g") classifies correctly too. Peeking is side-effect-free;
        // Process() still runs normally afterward for its real side effects.
        var replayTarget = _againProcessor.PeekReplayTarget(playerInput!, Context);
        var earlyGlobalIntent = _parser.DetermineGlobalIntentType(replayTarget ?? playerInput);
        var isFreeCommand = earlyGlobalIntent is GlobalCommandIntent { Command: IFreeGlobalCommand };

        // One-shot actor-suppression flags (e.g. Planetfall's FloydShouldNotActThisTurn) must reset
        // every turn regardless of isFreeCommand: actor processing below always runs, even for free
        // commands, so a flag it consumes must always get its one-shot reset too - otherwise it leaks
        // across consecutive free commands and suppresses an actor for longer than intended.
        Context.ResetPerTurnActorFlags();

        // Everything below here counts as a turn, unless it's a free command. Pre-process the turn.
        // See if the context needs to notify us of anything. Are we sleepy? Hungry?
        var contextPrepend = isFreeCommand ? null : Context.ProcessBeginningOfTurn();

        // Check if player died during beginning-of-turn processing (e.g., hunger death)
        if (Context.PendingDeath is not null)
        {
            var deathResult = Context.PendingDeath;
            var deathMessage = deathResult.InteractionMessage;
            RestartAfterDeath(deathResult.DeathCount);
            return PostProcessing(deathMessage + Context.CurrentLocation.GetDescription(Context));
        }

        // Issue #355: a scheduled event (e.g. Planetfall's forced sleep) consumed this turn during
        // ProcessBeginningOfTurn, mutating state (dropping carried items, changing location) against
        // wherever the player was BEFORE their own command ran. Executing that command now - most
        // dangerously a movement command - would change CurrentLocation again, leaving the narration
        // and any side effects of the event stranded against a location the response never mentions
        // again. Short-circuit here, mirroring the PendingDeath check above: report wherever the
        // player actually is instead of running their command, which is deferred to next turn. Still
        // routed through ProcessActorsAndContextEndOfTurn so the clock ticks and actors act, exactly
        // as they would for any other turn.
        if (Context.TurnConsumedByForcedEvent)
        {
            Context.TurnConsumedByForcedEvent = false;
            return await ProcessActorsAndContextEndOfTurn(
                contextPrepend, Context.CurrentLocation.GetDescription(Context));
        }

        // See if the user typed "again" or some variation.
        // if so, we'll replace the input with their previous input.
        (_currentInput, var returnResponseFromAgainProcessor) = _againProcessor.Process(
            _currentInput!,
            Context
        );
        if (returnResponseFromAgainProcessor)
            return PostProcessing(_currentInput);

        // Resolve pronouns from recent player input and game response (BEFORE ItProcessor), UNLESS a
        // just-completed move left the deterministic engine holding a still-carried antecedent for
        // this pronoun. After a move, LastInput is the movement command ("north") and LastResponse is
        // the destination room's description, so the AI resolver would re-bind "it"/"them" to a noun
        // in the NEW room and lose the carried-item antecedent that MoveEngine deliberately preserved
        // across the move (issues #248 / #275). In that case we defer to the deterministic ItProcessor
        // below, which resolves the pronoun from the preserved LastNoun/LastNouns.
        if (!MoveJustClobberedPronounContext(_currentInput!, Context)
            && (!string.IsNullOrEmpty(Context.LastInput) || !string.IsNullOrEmpty(Context.LastResponse)))
        {
            var resolved = await _parser.ResolvePronounsAsync(_currentInput!, Context.LastInput, Context.LastResponse);
            if (resolved != null && !resolved.Equals(_currentInput, StringComparison.OrdinalIgnoreCase)
                && !ResolverConflatedSingularItWithASet(_currentInput!, resolved))
            {
                _currentInput = resolved;
            }
        }

        // Track player input for pronoun resolution (AFTER resolution, so next command can use this as context)
        // Store the RESOLVED input so subsequent pronoun resolution has the actual noun, not the pronoun
        if (!string.IsNullOrWhiteSpace(_currentInput))
            Context.LastInput = _currentInput;

        // 4. ------- Location specific raw commands
        // Check if the location has an interaction with the raw, unparsed input.
        // Some locations have a special interaction to raw input that does not fit
        // the traditional sentence parsing. Sometimes that is a single verb with no
        // noun like "jump" or "pray" or "echo", or some other specific phrase
        // that does not lend itself well to parsing.
        var singleVerbResult = await Context.CurrentLocation.RespondToSpecificLocationInteraction(
            playerInput,
            Context,
            GenerationClient
        );
        // isFreeCommand was classified from raw input TEXT before we knew whether a location would
        // intercept it here - a location's raw interaction is never actually the free processor, so
        // an interaction that fires here is always a real turn, regardless of what the input text
        // happened to look like (e.g. LoudRoom's echo catch-all firing for the literal word "score").
        // If we skipped Context.ProcessBeginningOfTurn() based on that wrong early guess, run it now
        // - late beats never - before treating this as the real turn it actually is.
        //
        // Known ordering trade-off: RespondToSpecificLocationInteraction above has ALREADY run (and
        // any state it mutates has already happened) by the time this catches up, whereas on every
        // other path in this method ProcessBeginningOfTurn() runs first. In practice this is inert -
        // the only unconditional-catch-all locations today (LoudRoom, InsideTheBarrow,
        // CryoAnteroomLocation) have no stateful side effects beyond their message - but a future
        // catch-all location with one would apply it before this turn's hazard check instead of
        // after. The visible outcome, a death here, is still handled correctly either way (see
        // FreeMetaCommandTests.PendingDeath_FromLateBeginningOfTurn_StillOverridesACatchAllLocationInteraction) -
        // the interaction's TEXT is discarded in favor of the death message - only a stateful side
        // effect could land "early".
        if (singleVerbResult.InteractionHappened)
        {
            if (isFreeCommand)
            {
                contextPrepend = Context.ProcessBeginningOfTurn();

                if (Context.PendingDeath is not null)
                {
                    var deathResult = Context.PendingDeath;
                    var deathMessage = deathResult.InteractionMessage;
                    RestartAfterDeath(deathResult.DeathCount);
                    return PostProcessing(deathMessage + Context.CurrentLocation.GetDescription(Context));
                }
            }

            return await ProcessActorsAndContextEndOfTurn(contextPrepend, singleVerbResult.InteractionMessage);
        }

        // 5. ------- Global commands - these work always, everywhere: like look, inventory, wait and cardinal directions. These DO count as a turn
        // (except free commands - see isFreeCommand above). We must process actors afterwards regardless.
        var simpleIntent = earlyGlobalIntent;
        if (simpleIntent is not null)
        {
            var resultMessage = simpleIntent switch
            {
                GlobalCommandIntent intent => await ProcessGlobalCommandIntent(intent),
                MoveIntent moveInteraction => (await new MoveEngine().Process(moveInteraction, Context,
                    GenerationClient)).ResultMessage,
                _ => null
            };

            return await ProcessActorsAndContextEndOfTurn(contextPrepend, resultMessage, isFreeCommand);
        }

        // Is the player talking to someone?
        _logger?.LogDebug($"[GAME ENGINE DEBUG] About to check for conversation with input: '{_currentInput}'");
        var conversation = await _conversationHandler.CheckForConversation(_currentInput, Context);
        if (conversation is not null)
        {
            _logger?.LogDebug($"[GAME ENGINE DEBUG] Conversation detected, returning response: '{conversation}'");
            return await ProcessActorsAndContextEndOfTurn(contextPrepend, conversation);
        }
        _logger?.LogDebug("[GAME ENGINE DEBUG] No conversation detected, continuing with normal processing");

        // 6. ------- Complex parsed commands. These require a parser to break them down into their noun(s) and verb.

        // if the user referenced an object using "it", let's see if we can handle that.
        var (requiresClarification, replacedInput) = _itProcessor.Check(_currentInput, Context);
        if (requiresClarification)
        {
            _processorInProgress = _itProcessor;
            // Persist the command awaiting a noun so the "What item are you referring to?" clarification
            // survives the stateless save/restore boundary (issue #472). _currentInput is exactly what
            // ItProcessor.Check just stashed as the command to complete once the noun arrives.
            Context.PendingClarificationCommand = _currentInput;
            return PostProcessing(replacedInput);
        }

        // Replace the "it" with the correct noun, if applicable.
        _currentInput = replacedInput;

        var parsedResult = await _parser.DetermineComplexIntentType(
            _currentInput,
            Context.CurrentLocation.GetDescription(Context),
            _sessionId
        );

        var complexIntentResult = await ProcessComplexIntent(parsedResult);

        // A look/inventory phrasing the AI parser recognizes but GlobalCommandFactory's static list
        // doesn't (e.g. "what is this place?") reaches LookProcessor/InventoryProcessor here instead
        // of the fast static path above, so isFreeCommand was (necessarily) false when contextPrepend
        // was computed - Context.ProcessBeginningOfTurn() already ran as a real turn, and that can't
        // be undone without calling the AI parser before every turn, defeating the "cheap first, AI
        // fallback second" design this engine otherwise follows. What we CAN still do is skip the
        // end-of-turn survival-clock tick, which is what actually risks a hunger/sleep death from
        // checking your status - issue #354's core complaint - even though Context.Moves still
        // advances for this narrow AI-only-recognized case.
        var aiRecognizedFreeIntent = parsedResult is LookIntent or InventoryIntent;

        // Put it all together for return.
        return await ProcessActorsAndContextEndOfTurn(contextPrepend, complexIntentResult.ResultMessage,
            aiRecognizedFreeIntent);
    }

    /// <summary>
    ///     True when the immediately preceding command was a movement and the player's current command
    ///     uses "it"/"them" with a still-carried antecedent that <see cref="MoveEngine" /> preserved
    ///     across that move (issue #248). When this holds we must NOT run the AI pronoun resolver: right
    ///     after a move its only context is the movement command (LastInput) and the destination room's
    ///     description (LastResponse), so it re-binds the pronoun to a noun in the NEW room and the
    ///     carried-item antecedent is lost (issue #275 — "the invisible gangway"). The deterministic
    ///     <see cref="ItProcessor" /> downstream resolves the pronoun from LastNoun/LastNouns instead.
    ///
    ///     The check is deliberately scoped to the post-move case so the AI resolver keeps its value for
    ///     every other turn — semantic rewrites like "put it on" -> "wear X", resolving from response
    ///     narration, the other pronouns (him/her/that/...), and so on.
    /// </summary>
    private static bool MoveJustClobberedPronounContext(string input, IContext context)
    {
        // "the move is the trigger": only defer to the preserved antecedent when the previous command
        // (now sitting in LastInput) was itself a movement. Any non-move command refreshes LastInput
        // with a real noun phrase, which is exactly what the AI resolver needs to work correctly.
        if (!DirectionParser.IsDirection(context.LastInput, out _))
            return false;

        // Only "it"/"them" are resolved deterministically from LastNoun/LastNouns; for any other
        // pronoun (him, her, that, ...) the AI resolver is the only thing that can help, so let it run.
        if (Regex.IsMatch(input, @"\bit\b", RegexOptions.IgnoreCase))
            return !string.IsNullOrEmpty(context.LastNoun) &&
                   context.HasMatchingNoun(context.LastNoun).HasItem;

        if (Regex.IsMatch(input, @"\bthem\b", RegexOptions.IgnoreCase))
            return context.LastNouns.Any(noun => context.HasMatchingNoun(noun).HasItem);

        return false;
    }

def create_spawn_agents_node(
    memory_toolkit: MemoryToolkit,
    mapper_toolkit: MapperToolkit,
    inventory_toolkit,
    decision_llm,
    history_toolkit: HistoryToolkit,
):
    """
    Create the spawn agents node that creates IssueAgents and ExplorerAgent.

    Args:
        memory_toolkit: MemoryToolkit for accessing stored strategic issues
        mapper_toolkit: MapperToolkit for accessing map state
        inventory_toolkit: InventoryToolkit for accessing inventory
        decision_llm: LLM for generating proposals
        history_toolkit: HistoryToolkit for accessing tools

    Returns:
        Node function for the graph
    """
    # issue signature -> why it could not be acted on. Lives as long as the
    # graph, so a verdict persists across turns.
    blocked_issues: dict = {}

    async def spawn_agents_node(state: DecisionState) -> dict:
        """
        Spawn phase: Create one IssueAgent for each tracked strategic issue.
        Each agent performs its own research and generates a proposal IN PARALLEL.
        """
        import asyncio
        import logging
        logger = logging.getLogger(__name__)

        logger.info("\n" + "=" * 80)
        logger.info("SPAWN AGENTS - Creating specialized agents for this turn")
        logger.info("=" * 80)

        memories_sorted = state["memories"]

        context = state["turn_context"]

        # One IssueAgent per issue, but skip those already known to be
        # unactionable under this location + inventory. A skipped agent keeps
        # its recorded reason, so the HTML report still explains its silence.
        issue_agents = []
        skipped = 0
        for mem in memories_sorted:
            agent = IssueAgent(memory=mem)
            cached = blocked_issues.get(_blocked_signature(mem, context))
            if cached is not None:
                agent.proposed_action = None
                agent.confidence = None
                agent.reason = cached
                skipped += 1
                logger.info(f"SKIPPED IssueAgent ID:{mem.id} — still blocked: {cached[:70]}")
            issue_agents.append(agent)

        logger.info(f"SPAWNED {len(issue_agents) - skipped} IssueAgents "
                    f"({skipped} skipped as already blocked)")

        # Extract current game state
        game_response = state["game_response"]
        # "Unknown" is prose for the prompts only. Anything that indexes the
        # map, routes, or gets stored must go through is_known_location (#7).
        current_location = game_response.LocationName or UNKNOWN_LOCATION
        location_is_known = is_known_location(game_response.LocationName)
        current_game_text = game_response.Response
        current_score = game_response.Score
        current_moves = game_response.Moves

        # ========== NEW: Spawn ONE ExplorerAgent (if unexplored directions exist) ==========
        # Get known exits from current location. With no room name there is no
        # map node to explore *from*: querying exits for the fake room
        # "Unknown" returned nothing, so the explorer confidently reported all
        # ten directions unexplored and proposed a move it could not map (#7).
        known_exits = (
            mapper_toolkit.state.get_exits_from(current_location)
            if location_is_known
            else []
        )
        # Canonicalize so a passage recorded as "N" counts as NORTH (#9), and
        # split real passages (explored) from BLOCKED edges. A BLOCKED edge is
        # only PROVISIONALLY closed (#11/#31), so its direction comes back as a
        # low-priority retry rather than being treated as explored — otherwise
        # a wall that has since cleared never gets re-tried and the map can
        # only degrade. See explorer_direction_pools for the full rationale.
        unexplored_directions, retry_directions = explorer_direction_pools(known_exits)

        # Which unexplored directions does the room prose actually name?
        # Whole-word matching only: substring containment scored "NE" inside
        # CORNER and "SE" inside HOUSE, and a fabricated mention both outranks
        # every real exit and adds +20 confidence (#8). It also matched
        # "NORTH" inside "NORTHEAST", sending the agent north when the room
        # said northeast.
        mentioned_directions = find_mentioned_directions(
            current_game_text,
            unexplored_directions,
        )

        # Spawn ONE ExplorerAgent if anything is left to try here — real
        # frontier, or a previously-refused direction worth re-probing (#31).
        has_candidates = bool(unexplored_directions or retry_directions)
        explorer_agent = None
        if has_candidates and not location_is_known:
            logger.info(
                "NO ExplorerAgent spawned - current location is unknown, so there "
                "is no map node to explore from"
            )
        elif has_candidates:
            explorer_agent = ExplorerAgent(
                current_location=current_location,
                unexplored_directions=unexplored_directions,
                mentioned_directions=mentioned_directions,
                game_exits=context.game_exits,
                retry_directions=retry_directions,
                turn_number=0  # Will be set properly when turn_number added to state
            )
            logger.info(f"SPAWNED 1 ExplorerAgent - {len(unexplored_directions)} unexplored, "
                        f"{len(retry_directions)} retry: unexplored={unexplored_directions} retry={retry_directions}")
            logger.info(f"  Mentioned in description: {mentioned_directions if mentioned_directions else 'None'}")
            logger.info(f"  Best direction chosen: {explorer_agent.best_direction}"
                        f"{' (RETRY of a refused direction)' if explorer_agent.is_retry else ''}")
        else:
            logger.info("NO ExplorerAgent spawned - all directions explored from this location")

        # ========== DISABLED: LoopDetectionAgent ==========
        # loop_detection_agent = LoopDetectionAgent()
        # logger.info("SPAWNED 1 LoopDetectionAgent - monitors for stuck/oscillating patterns")
        loop_detection_agent = None  # DISABLED - not useful in practice
        logger.info("LoopDetectionAgent DISABLED")

        # ========== NEW: Spawn ONE InteractionAgent (ALWAYS) ==========
        interaction_agent = InteractionAgent()
        logger.info("SPAWNED 1 InteractionAgent - identifies local object interactions")

        # ========== PARALLEL RESEARCH: IssueAgents + ExplorerAgent + InteractionAgent ==========
        num_special_agents = (1 if explorer_agent else 0) + 1  # +1 for Interaction (Loop disabled)
        logger.info(f"Starting PARALLEL research for {len(issue_agents)} IssueAgents + {num_special_agents} special agents...")

        # Build a coroutine for each agent's research+propose pass. Agents are
        # async-native (chain.ainvoke), so no thread offload is needed.
        def agent_coroutine(agent):
            # One LLM call per agent now, not two.
            return agent.propose(decision_llm=decision_llm, context=context)

        # Filter out None agents (e.g., loop_detection_agent is disabled)
        runnable_issues = [a for a in issue_agents if a.reason is None]
        all_agents = [a for a in runnable_issues
                      + [explorer_agent, loop_detection_agent, interaction_agent]
                      if a is not None]

        # Run all agents in parallel — pure async, no threads.
        # return_exceptions=True isolates failures: one agent blowing up must
        # not cancel its siblings or end the turn (see #1). A failed agent is
        # neutralized so it cannot contribute a proposal, but is kept in state
        # so the HTML report still shows what it attempted and why it failed.
        failed_agents = 0
        if all_agents:
            results = await asyncio.gather(
                *(agent_coroutine(a) for a in all_agents),
                return_exceptions=True,
            )
            for agent, result in zip(all_agents, results):
                if not isinstance(result, BaseException):
                    continue
                if isinstance(result, asyncio.CancelledError):
                    # Turn budget expired / task cancelled — must propagate.
                    raise result
                failed_agents += 1
                agent_label = type(agent).__name__
                logger.error(
                    f"{agent_label} failed during research/proposal: {result}",
                    exc_info=result,
                )
                _neutralize_failed_agent(agent, result)

        # Remember a fresh "cannot act" verdict so the next turn does not pay
        # ~3000 tokens to hear it again.
        for agent, mem in zip(issue_agents, memories_sorted):
            action = (agent.proposed_action or "").strip().lower()
            if agent in all_agents and action in ("nothing", "none"):
                blocked_issues[_blocked_signature(mem, context)] = agent.reason or "no action available"

        logger.info(
            f"All {len(all_agents)} agents completed research in PARALLEL "
            f"({failed_agents} failed and were excluded from proposals)"
        )
        logger.info("=" * 80)
        logger.info("SPAWN AGENTS COMPLETE")
        logger.info("=" * 80)

        return {
            "issue_agents": issue_agents,
            "explorer_agent": explorer_agent,          # single agent, can be None
            "loop_detection_agent": loop_detection_agent,
            "interaction_agent": interaction_agent,
        }


    return spawn_agents_node


def create_decision_node(decision_chain: Runnable):
    """
    Create the decision node that generates structured output from agent
    proposals and previously gathered research context.

    Args:
        decision_chain: The LangChain decision chain with structured output

    Returns:
        Node function for the graph
    """
    async def decision_node(state: DecisionState) -> DecisionState:
        """
        Decision phase: Generate AdventurerResponse from agent proposals plus
        research_context already gathered by research_node and per-agent research.
        """
        import logging
        logger = logging.getLogger(__name__)

        zork_response = state["game_response"]
        # Assembled in code by the spawn node (#25); the research node that
        # used to produce this via an LLM round-trip is gone.
        turn_context = state.get("turn_context")
        research_context = (
            turn_context.research_context_for() if turn_context is not None
            else state.get("research_context", "")
        )
        issue_agents = state["issue_agents"]
        explorer_agent = state["explorer_agent"]
        loop_detection_agent = state["loop_detection_agent"]
        interaction_agent = state["interaction_agent"]

        logger.info("\n" + "=" * 80)
        logger.info("[DecisionAgent] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        logger.info("[DecisionAgent] AGENT: DecisionAgent")
        logger.info("[DecisionAgent] PURPOSE: Choose best action from all agent proposals")
        logger.info(f"[DecisionAgent] LOCATION: {zork_response.LocationName}")
        logger.info(f"[DecisionAgent] SCORE: {zork_response.Score}, MOVES: {zork_response.Moves}")
        logger.info("[DecisionAgent] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

        logger.info("=" * 80)
        logger.info("DECISION - Choosing best action from agent proposals")
        logger.info("=" * 80)
        logger.info(f"Location: {zork_response.LocationName}")
        logger.info(f"Score: {zork_response.Score}, Moves: {zork_response.Moves}")
        logger.info(f"Game Response (first 100): {zork_response.Response[:100]}...")

        # Format agent proposals for Decision Agent
        agent_proposals_text = _format_agent_proposals(
            issue_agents, explorer_agent, loop_detection_agent, interaction_agent,
            context=turn_context,
        )
        logger.info(f"Agent Proposals:\n{agent_proposals_text}")
        logger.info("=" * 80)

        # No additional tool-calling pass here: research_node + per-agent research
        # already gathered sufficient context. Keep tool_calls_history empty for the
        # report writer's compatibility.
        tool_calls_history: list = []
        full_research_context = research_context

        decision_input = {
            "score_trajectory": (turn_context.score_trajectory if turn_context
                                 else "unknown"),
            "frontier": (turn_context.frontier_summary if turn_context
                         else "unknown"),
            "score": zork_response.Score,
            "locationName": zork_response.LocationName,
            "moves": zork_response.Moves,
            "game_response": zork_response.Response,
            "research_context": full_research_context,
            "agent_proposals": agent_proposals_text
        }

        # Format the full prompt for reporting (from prompt_library.py)
        from adventurer.prompt_library import PromptLibrary
        system_prompt = PromptLibrary.get_decision_agent_evaluation_prompt()
        human_prompt = PromptLibrary.get_decision_agent_human_prompt()


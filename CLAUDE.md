## Project: Lotus Care website

Marketing/informational site for Lotus Care — a HIQA-registered disability care provider in Co. Offaly / the Midlands, Ireland ("Enhanced Living, Empowered Lives"). Stack: Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS 4 · TypeScript · Storybook.

### The build plan (spec of record)

- The full feature spec lives in **`docs/build-plan.md`** — task cards `F1–F4` (foundations) and `P / C / Q / N / L` (features). Each card carries a branch name, problem statement, scope, approach, and acceptance criteria.
- This spec says **WHAT** to build. It does **not** replace the two-phase workflow below — it **feeds** it. Each card is worked as its own **Planning → Pipeline** cycle.

### One card at a time

- Work **one card per cycle = one branch = one PR**. Branch names are given in each card.
- In Phase 1, reference the specific card (e.g. `@docs/build-plan.md` → card `F1`) and translate that card's acceptance criteria into `tasks/todo.md` checkable items. **Do not plan multiple cards in one cycle.**
- Trivial "adopt-only" cards (e.g. `C2` — apply the width system) can run as the orchestrator's **`fix`** pipeline variant rather than **`full`**.

### Sequencing (foundations first)

Before any feature card: **`F1`** (colour tokens) → then **`F2`** (width system), **`F3`** (lotus SVG), **`F4`** (blobs) → then **`C6`** (shared timeline component). These unblock the rest. **`L1`** (localisation sweep — remove leftover Australian/NDIS content) is high-priority and can run anytime.

### Standing rules (apply to every card, both phases)

- **Colours:** read the **real** brand tokens from the repo (the Tailwind 4 `@theme` block / `globals.css` / logo SVG). Any hex printed in `docs/build-plan.md` are **placeholders — do not use them.**
- **Motion:** every animation gated behind `prefers-reduced-motion`.
- **Contrast:** must pass WCAG AA, including text over decorative blobs and imagery.
- **Media:** alt text, captions, and poster frames; no layout shift (CLS).
- **Client-pending content:** values (`B1`) and stats (`B2`) are not final — build them **swap-ready from a single config**, never hardcoded across components.
- **Safeguarding:** the "Have Your Say" feature (`N1`) must keep its safeguarding signpost and required-vs-optional-email behaviour; do not ship it without the signpost.
- **Don't rebuild what exists:** e.g. `P3` reuses the existing houses carousel as-is — resize, don't rewrite.

---

## Two Phases: Planning → Pipeline

This project uses two distinct phases. Never mix them.

### Phase 1: Planning (User + Claude)

Collaborative discussion — no agents, no pipeline. This is where we:
- Discuss features, priorities, and scope
- Enter plan mode for non-trivial tasks (3+ steps or architectural decisions)
- Write detailed specs upfront to reduce ambiguity
- **When working a build-plan card, source its spec from `docs/build-plan.md` (one card per cycle) and translate its acceptance criteria into `tasks/todo.md`**
- Write plan to `tasks/todo.md` with checkable items
- If something goes sideways, STOP and re-plan — don't keep pushing

**When the plan is complete**, always ask the user explicitly:
> "Plan is ready. Start the pipeline? (PM → full agent pipeline)"

Do NOT start the pipeline without explicit user confirmation ("yes", "go", "build it").

### Phase 2: Pipeline Execution

Once the user confirms, run the orchestrator loop:

**Step 1 — Start the orchestrator:**
```
Agent tool:
  subagent_type: "orchestrator"
  prompt: "New pipeline. Feature: <description from planning>. Plan reference: tasks/todo.md. Determine pipeline variant (full or fix) and return first spawn instruction."
```
Save the returned `agent_id` — you will resume this same agent for the entire pipeline.

**Step 2 — Spawn the agent the orchestrator requested:**
Read the orchestrator's JSON response. It contains `next_agent` and `task_assignment`. Spawn that agent:
```
Agent tool:
  subagent_type: <next_agent from orchestrator response>
  prompt: <task_assignment from orchestrator response>
```

**Step 3 — Resume the orchestrator with the result:**
```
Agent tool:
  resume: <orchestrator agent_id from Step 1>
  prompt: "<agent> completed. Result at results/<result_file>.json"
```

**Step 4 — Repeat Steps 2-3** until the orchestrator returns `"next_action": "pipeline_complete"`.

**If orchestrator returns `"next_action": "pipeline_pause"`**: Stop and show the user the `reason` and `resume_instructions`. Wait for user input before resuming.

Never do routing yourself. Never read result `status` fields to decide next steps. Always ask the orchestrator.

---

## Workflow Standards

### Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- One task per subagent for focused execution

### Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Review lessons at session start for relevant project

### Verification Before Done
- Never mark a task complete without proving it works
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- Skip this for simple, obvious fixes — don't over-engineer

### Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user

---

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

---

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

---
date: 2026-03-21
topic: scoreboard
type: design
phase: brainstorm
council: src-feature
---

# Scoreboard Row

## What We're Building

Add a scoreboard row to the bottom of the grid showing real-time team scores. The row contains two cells:

- **Left cell (Skyhawks):** Team logo, name, and score in white text
- **Right cell (Psiclones):** Team logo, name, and score in black text

Both cells have a blue-grey background. Score is the count of slots with the team's background color (white slots for Skyhawks, black slots for Psiclones). Updates in real-time as slots change.

Additionally, update the header (phase/round display) to use the same blue-grey background color for visual consistency.

## Why This Approach

**Considered:**

1. **Scoreboard as 5th grid row** — maintains visual consistency, responsive behavior, same CSS patterns
2. **Scoreboard as separate element below grid** — more flexibility but breaks grid layout

Chose option 1. The grid already handles responsive layout; adding a row is simpler than managing a separate element.

## Key Decisions

- **Grid row 5**: Scoreboard is part of the grid, not a separate element
- **Score calculation**: Pure function `calculateScores()` counts slots by background class (`slot-white`, `slot-black`)
- **Real-time updates**: Score recalculated in `render()`, updates immediately on any slot change
- **Text colors**: White text for Skyhawks, black text for Psiclones (matches team identity)
- **Background**: Blue-grey (`#5a6a7a` or similar) — distinct from neutral grey slots
- **Header background**: Same blue-grey as scoreboard for visual consistency
- **Layout**: Logo left, name center, score right (or logo + name left, score right)

## Council Perspectives

### Architect
- Score calculation should be a pure function, not embedded in render logic
- New row should follow existing grid/slot CSS patterns

### UX Reviewer
- Scores should be prominent but not compete with main grid
- Ensure sufficient contrast for text on blue-grey background

## Open Questions

None.

## Next Steps

> Run `/cp.plan` to create an implementation plan from this design.

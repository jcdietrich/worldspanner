---
date: 2026-03-21
cycle-id: scoreboard
tags: [scoreboard, css-refactor, imagemagick, edge-cases]
summary: Scoreboard feature evolved significantly through user feedback; reusing existing CSS classes and iterating on design during execution proved more efficient than upfront specification.
council: src-feature
related: [web-scorekeeper]
---

# Learnings: Scoreboard Feature

## What This Cycle Did

Added a real-time scoreboard to the web scorekeeper, showing team scores based on slot background colors. The feature evolved through multiple refinements: layout swap, hybrid melee logo creation, Underpit CSS refactor, and edge case fixes.

## What Went Well

- **Reusing existing CSS classes** for Underpit slots eliminated 18 lines of custom CSS. The `slot-white`, `slot-black`, and `slot-neutral` classes already handled the exact styling needed.
- **Pure function for score calculation** (`calculateScores()`) made the logic testable and easy to reason about. Council's Architect perspective reinforced this pattern.
- **ImageMagick for hybrid logo** created a clean diagonal-split melee icon in one command, avoiding manual image editing or additional dependencies.
- **Iterative refinement during execution** was efficient. User feedback on Underpit scoring, header styling, and layout position led to better outcomes than the original design specified.

## What Surprised Us

- **Design doc specified scoreboard at bottom, but top was better.** User requested the swap mid-execution. The original "add a row to the grid" approach was correct, but placement assumption was wrong.
- **Underpit scoring logic was misunderstood twice.** Initial implementation counted active slots; user clarified inactive slots should count. Then the CSS backgrounds were inverted. Domain knowledge gaps caused multiple fix commits.
- **Round 1 phase advance edge case** wasn't in any spec. Setting phase via settings to a value other than 5 or 11 in round 1 caused clicks to do nothing. Edge cases from settings interactions need explicit consideration.
- **Flex layout blocked header clicks.** Moving the header to the bottom caused the grid's `flex: 1` to potentially overflow and block pointer events. Required `min-height: 0`, `overflow: hidden`, and `z-index` fixes.

## What We Would Do Differently

- **Clarify domain rules for scoring before implementation.** The Underpit scoring logic required three commits to get right. A quick "walk me through how scoring works" question would have saved iteration.
- **Test layout changes with click interactions immediately.** The header click issue wasn't discovered until after multiple commits. Layout changes should include interaction verification.
- **Consider settings-induced edge cases in phase logic.** Any state that can be set via settings should have its advance/transition logic tested with arbitrary values, not just expected values.

## Advisor Insights

- **Architect:** Score calculation as a pure function was the right call — it made the multiple scoring logic fixes easy to isolate and verify.
- **UX Reviewer:** Scoreboard at top provides immediate score visibility; hybrid melee logo is cleaner than showing two separate icons.
- **Architect (also noted by UX Reviewer):** Reusing standard slot classes for Underpit was both a code quality win (less CSS) and a consistency win (same visual language).

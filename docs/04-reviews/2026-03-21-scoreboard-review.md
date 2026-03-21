---
phase: review
council: src-feature
target: c1323b7..HEAD
timestamp: 2026-03-21T19:31:00
---

# Scoreboard Feature Review

## Summary

Added scoreboard row showing real-time team scores, updated header styling, created hybrid melee logo, and fixed several edge cases.

## Changes Reviewed

- **Scoreboard feature:** New row at top with Skyhawks/Psiclones scores
- **Score calculation:** Pure `calculateScores()` function counts slots by background color
- **Header styling:** Blue-grey background, text color matches active team
- **Melee logo:** Hybrid diagonal-split logo for melee phases
- **Underpit refactor:** Uses standard slot classes, renamed to "Any in Underpit?"
- **Layout swap:** Scoreboard at top, phase/round at bottom
- **Bug fixes:** Round 1 phase advance edge case, header click handling

## Findings

### Critical

None.

### Important

None.

### Minor

| # | Finding | Location | Recommendation |
|---|---------|----------|----------------|
| 1 | `renderScoreboard()` uses innerHTML | `app.js:208-224` | Acceptable for 2 cells, but could use DOM manipulation for consistency |
| 2 | Duplicate scoreboard CSS comment | `styles.css:87,312` | Remove duplicate comment block |

## Council Perspectives

### Architect

- Score calculation is properly separated as a pure function
- Underpit refactor removes 18 lines of custom CSS by reusing standard classes
- Layout changes follow existing patterns

### UX Reviewer

- Scoreboard placement at top provides immediate score visibility
- Text contrast on blue-grey background is sufficient for both white and black text
- Hybrid melee logo is cleaner than showing two separate icons
- "Any in Underpit?" label is more descriptive

## Verdict

**Approve**

The implementation is clean, follows existing patterns, and addresses all requirements. Minor findings do not block merge.

## Commits Reviewed

```
de9e42f fix(web): handle edge case when phase set via settings in round 1
a6837c9 fix(web): add null check for header-clickable element
6c34e84 fix(web): add flex-shrink to scoreboard for proper layout
10e11e2 fix(web): prevent grid overflow from blocking header clicks
508e000 fix(web): ensure header is clickable with flex-shrink, z-index, min-height
d70fb9f feat(web): swap scoreboard to top, phase/round to bottom
568c881 feat(web): add hybrid melee.png logo for melee phases
ffeed5d feat(web): melee phases show both icons, text color matches active team
67dd39d fix(web): header background always blue-grey, only text color changes
438e616 chore(web): rename Underpit to 'Any in Underpit?'
c6c5740 refactor(web): use standard slot classes for Underpit, remove custom CSS
8004760 fix(web): correct Underpit backgrounds and scoring - both teams start at 1
b0641c8 fix(web): Underpit slots always count - inactive for own team, active for opposite
7417553 docs: add scoreboard execution summary
68cf677 feat(web): render scoreboard row with real-time scores
dffae8b feat(web): add calculateScores function
3e275e6 feat(web): add scoreboard CSS and update header to blue-grey
beaf5e1 docs: add scoreboard implementation plan
de5aa2b docs: add scoreboard design document
```

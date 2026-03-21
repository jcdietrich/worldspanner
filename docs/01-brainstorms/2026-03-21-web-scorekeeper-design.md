---
date: 2026-03-21
topic: web-scorekeeper
type: design
phase: brainstorm
council: none
---

# Worldspanner Web Scorekeeper

## What We're Building

A standalone web app equivalent to the M5 Fire scorekeeper, built with vanilla HTML/CSS/JS. The app tracks game state for Worldspanner: 12 phases per round, 5 faction tug-of-war scores, Lith's Favour score, and 2 Underpit toggles. State persists in localStorage with auto-save—no server or sync required.

Phone-first responsive design that works well on mobile and adapts to larger screens. Touch-friendly with optional keyboard shortcuts for desktop.

## Why This Approach

**Vanilla HTML/CSS/JS chosen over frameworks because:**
- No build step—just open index.html or serve from any static host
- Phone-first is mostly CSS (flexbox, grid, media queries)
- Simple state model fits localStorage well
- Zero dependencies, fast iteration

**Separated files (index.html, styles.css, app.js) chosen over single file because:**
- Clean separation of concerns
- Easier to maintain and read
- Standard practice without over-engineering

## Key Decisions

- **Phone-first responsive:** Full-width on mobile, max-width ~400px centered on desktop
- **Predefined faction dropdowns:** Same 9 factions as M5 (Lords, Warriors, Defenders, Villains, Icons, Outcasts, Exemplars, Adventurers, Commoners)
- **Faction locations displayed:** Shown under faction name in smaller font
- **Auto-save only:** No explicit save/load, state persists automatically
- **Phase header format:** "PHASE NAME - WHITE | BLACK" with background color allowing team-colored text
- **Tug-of-war controls:** White button (left) and black button (right) on each slot
- **Touch + keyboard:** Tap/click for all interactions, arrow keys and +/- for desktop

## Design Details

### Layout

**Header:**
- Phase: "W Action - WHITE | BLACK" (tap to advance)
- Round: "3/10" format
- Settings icon: dropdown to set phase/round manually
- Background color chosen so phase name renders in team color (white or black)

**Main Grid (2×4):**
- Slots 1-5: Faction tug-of-war (name, location, score, white/black buttons)
- Slot 6: Lith's Favour (same tug-of-war style)
- Slots 7-8: Underpit toggles (tap to toggle Yes/No)

### Interactions

**Phase/Round:**
- Tap header → advance phase
- Round 1 special: W Reinforce → B Reinforce → Round 2
- Round 2+: full 12-phase cycle
- Settings dropdown for manual selection

**Tug-of-war (slots 1-6):**
- White button → decrement (towards white/negative)
- Black button → increment (towards black/positive)
- Tap faction name → dropdown to change faction
- Background: grey=0, black=positive, white=negative

**Toggles (slots 7-8):**
- Tap anywhere → toggle No/Yes

**Keyboard (desktop):**
- Arrow keys to navigate
- +/- to adjust
- Enter to toggle/open dropdown

### Visual Design

- Dark theme base (black background)
- Medium grey header for contrast
- System fonts, no external dependencies
- 44px minimum touch targets
- Subtle grid lines

### File Structure

```
web/
├── index.html
├── styles.css
└── app.js
```

### Data Model (localStorage)

```json
{
  "factions": ["Lords", "Warriors", "Defenders", "Villains", "Icons"],
  "scores": [0, 0, 0, 0, 0, 0, 0, 0],
  "phase": 5,
  "round": 1,
  "endRound": 10
}
```

## Open Questions

None—all questions resolved during brainstorming.

## Next Steps

> Run `/cp.plan` to create an implementation plan from this design.

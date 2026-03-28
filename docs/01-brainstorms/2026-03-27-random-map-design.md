---
date: 2026-03-27
topic: random-map
type: design
phase: brainstorm
council: src-feature
---

# Random Map Feature

## What We're Building

A new view accessible from settings (when faction count is 5) that displays the game map with randomized platter and key assignments. The view shows `map-tri.svg` with rotation markers overlaid on each section, and a legend below showing the assignments.

The feature randomly selects 3 platters from 10 available, assigns rotations to each, and distributes 13 keys (5 faction, 2 Lith, 6 Dome) across the map sections with their own rotation markers. State persists across sessions so the map can be referenced or reconstructed if a game spans multiple sessions.

## Why This Approach

**View switching** was chosen over a modal overlay because:
- More screen real estate for the map
- Feels like a dedicated reference view
- Cleaner separation of concerns
- Simple back-button navigation

## Key Decisions

- **View switching**: Add `currentView` state (`'scoreboard'` | `'map'`) rather than modal
- **5-faction only**: Map button only appears when faction count is 5 (standard game)
- **Auto-fill factions**: If any factions are "Unknown" when opening map, randomly assign and update scoreboard
- **Persistent state**: Map assignments saved with game state for multi-session games
- **Shuffle button**: Allows re-randomization of all assignments

## Data Structure

```javascript
mapState: {
  selectedPlatters: [4, 7, 2],      // 3 random IDs from 1-10
  platterRotations: [0, 3, 5],      // rotation index 0-5 (60° increments)
  keyAssignments: {
    1: { type: 'faction', faction: 'Lords', rotation: 0 },
    2: { type: 'dome', rotation: 2 },
    3: { type: 'lith', rotation: 4 },
    // ... keys 1-13
  }
}
```

- **Platters**: 10 total, choose 3, each with 6 possible rotations (0°, 60°, 120°, 180°, 240°, 300°)
- **Keys**: 13 total (5 faction + 2 Lith + 6 Dome), each with 6 rotation positions (3 directions × 2 offsets)

## UI Layout

1. **Header bar**: Back button (left), "Random Map" title (center), Shuffle button (right)
2. **Map display**: `map-tri.svg` centered, rotation markers overlaid on each section
3. **Legend (below map)**:
   - Platters row: "A: Platter 4", "B: Platter 7", "C: Platter 2"
   - Keys section: Grid showing 1-13 with assigned type (faction name, Lith, or Dome)

## Randomization Logic

1. Pick 3 random platters from 1-10 (no duplicates)
2. Assign each platter a random rotation (0-5)
3. Create key pool: 5 faction keys (from current game's factions), 2 Lith, 6 Dome
4. Shuffle and assign to positions 1-13
5. Assign each key a random rotation (0-5)

## Success Criteria

- Map view opens from settings when faction count is 5
- Back button returns to scoreboard
- 3 random platters shown with rotation markers
- 13 keys assigned (5 faction, 2 Lith, 6 Dome) with rotation markers
- Legend displays assignments correctly
- Shuffle re-randomizes everything
- State persists across page reloads
- Unknown factions auto-filled when map opens

## Council Perspectives

### Consensus
- Clear separation between scoreboard and map views
- Need for visual clarity with overlaid markers
- Persistent state for multi-session games

### Advisor Contributions

#### Architect
- Recommended view switching over modal for separation of concerns
- Emphasized clear data modeling for platter/key assignments
- Flagged state persistence requirement

#### UX Reviewer
- Emphasized clear navigation (back button)
- Noted rotation markers must be visible without obscuring map
- Suggested shuffle button for re-randomization

## Open Questions

None — all questions resolved during dialogue.

## Next Steps

> Run `/cp.plan` to create an implementation plan from this design.

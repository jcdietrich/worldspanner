---
phase: plan
source: brainstorm
council: src-feature
created: 2026-03-27T19:35:00
---

# Random Map Implementation Plan

**Goal:** Add a map view accessible from settings that displays randomized platter and key assignments with rotation markers.

**Architecture:** View switching via `currentView` state ('scoreboard' | 'map'). Map state persisted alongside game state. Randomization logic as pure functions. Map view renders SVG with overlaid rotation markers and legend below.

**Tech Stack:** Vanilla JS, CSS, SVG manipulation

**Tasks:** 10 tasks, estimated 45-60 minutes total

---

### Task 1: Add Map State to DEFAULT_STATE

**Files:**
- Modify: `web/app.js:32-43`

**Step 1: Add mapState to DEFAULT_STATE**

Add the following fields to DEFAULT_STATE after `hideFactionLogos`:

```javascript
const DEFAULT_STATE = {
  version: STATE_VERSION,
  factionCount: 5,
  factions: ['', '', '', '', '', '', '', '', ''],
  scores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  phase: 5,
  round: 1,
  endRound: 10,
  hideUnderpitIcons: false,
  hideFactionLogos: false,
  currentView: 'scoreboard',
  mapState: null
};
```

**Step 2: Verify state loads correctly**

Run: Open browser console, check `state` object includes `currentView` and `mapState`
Expected: `state.currentView === 'scoreboard'` and `state.mapState === null`

**Step 3: Commit**

```bash
git add web/app.js
git commit -m "feat(map): add currentView and mapState to DEFAULT_STATE"
```

---

### Task 2: Add View Switching Functions

**Files:**
- Modify: `web/app.js` (after setHideFactionLogos function, around line 169)

**Step 1: Add view switching functions**

Add after `setHideFactionLogos`:

```javascript
// Set current view
function setCurrentView(view) {
  state.currentView = view;
  saveState();
  render();
}

// Open map view
function openMapView() {
  // Auto-fill unknown factions if any
  if (state.factionCount === 5) {
    const usedFactions = state.factions.slice(0, 5).filter(f => f !== '');
    const availableFactions = FACTIONS.map(f => f.name).filter(f => !usedFactions.includes(f));
    
    for (let i = 0; i < 5; i++) {
      if (state.factions[i] === '') {
        const randomIndex = Math.floor(Math.random() * availableFactions.length);
        state.factions[i] = availableFactions.splice(randomIndex, 1)[0];
      }
    }
    
    // Initialize map state if not exists
    if (!state.mapState) {
      initializeMapState();
    }
  }
  
  setCurrentView('map');
}

// Close map view
function closeMapView() {
  setCurrentView('scoreboard');
}
```

**Step 2: Verify functions exist**

Run: Browser console, type `typeof openMapView`
Expected: `"function"`

**Step 3: Commit**

```bash
git add web/app.js
git commit -m "feat(map): add view switching functions"
```

---

### Task 3: Add Randomization Logic

**Files:**
- Modify: `web/app.js` (after closeMapView function)

**Step 1: Add randomization functions**

```javascript
// Fisher-Yates shuffle
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Initialize map state with random assignments
function initializeMapState() {
  // Pick 3 random platters from 1-10
  const allPlatters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const shuffledPlatters = shuffleArray(allPlatters);
  const selectedPlatters = shuffledPlatters.slice(0, 3);
  
  // Random rotation for each platter (0-5)
  const platterRotations = selectedPlatters.map(() => Math.floor(Math.random() * 6));
  
  // Create key pool: 5 faction + 2 lith + 6 dome
  const factionKeys = state.factions.slice(0, 5).map(f => ({ type: 'faction', faction: f }));
  const lithKeys = [{ type: 'lith' }, { type: 'lith' }];
  const domeKeys = Array(6).fill(null).map(() => ({ type: 'dome' }));
  
  const allKeys = shuffleArray([...factionKeys, ...lithKeys, ...domeKeys]);
  
  // Assign to positions 1-13 with random rotations
  const keyAssignments = {};
  allKeys.forEach((key, index) => {
    keyAssignments[index + 1] = {
      ...key,
      rotation: Math.floor(Math.random() * 6)
    };
  });
  
  state.mapState = {
    selectedPlatters,
    platterRotations,
    keyAssignments
  };
  
  saveState();
}

// Shuffle map (re-randomize everything)
function shuffleMap() {
  initializeMapState();
  render();
}
```

**Step 2: Verify randomization works**

Run: Browser console, `initializeMapState(); console.log(state.mapState);`
Expected: Object with `selectedPlatters` (3 numbers), `platterRotations` (3 numbers 0-5), `keyAssignments` (13 entries)

**Step 3: Commit**

```bash
git add web/app.js
git commit -m "feat(map): add randomization logic for platters and keys"
```

---

### Task 4: Add Map View HTML Structure

**Files:**
- Modify: `web/index.html` (after faction-modal div, before closing </div> of .app)

**Step 1: Add map view HTML**

Add before the closing `</div>` of `.app` (after faction-modal):

```html
    <!-- Map View -->
    <div class="map-view" id="map-view">
      <div class="map-header">
        <button class="map-back-btn" id="map-back-btn">← Back</button>
        <h2>Random Map</h2>
        <button class="map-shuffle-btn" id="map-shuffle-btn">Shuffle</button>
      </div>
      <div class="map-container" id="map-container">
        <img class="map-svg" id="map-svg" src="map-tri.svg" alt="Map">
        <div class="map-markers" id="map-markers">
          <!-- Rotation markers will be generated by JS -->
        </div>
      </div>
      <div class="map-legend" id="map-legend">
        <!-- Legend will be generated by JS -->
      </div>
    </div>
```

**Step 2: Verify HTML structure**

Run: Open browser, inspect DOM for `#map-view`
Expected: Element exists with child elements

**Step 3: Commit**

```bash
git add web/index.html
git commit -m "feat(map): add map view HTML structure"
```

---

### Task 5: Add Map View CSS

**Files:**
- Modify: `web/styles.css` (at end of file)

**Step 1: Add map view styles**

```css
/* Map View */
.map-view {
  display: none;
  flex-direction: column;
  height: 100%;
  background: var(--bg-dark);
}

.map-view.active {
  display: flex;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--header-bg);
  color: var(--text-white);
}

.map-header h2 {
  font-size: 1rem;
  margin: 0;
}

.map-back-btn,
.map-shuffle-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  min-width: 44px;
  min-height: 44px;
}

.map-back-btn {
  background: var(--bg-grey);
  color: var(--text-white);
}

.map-shuffle-btn {
  background: var(--btn-white);
  color: var(--text-black);
}

.map-container {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  overflow: hidden;
}

.map-svg {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.map-markers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.map-legend {
  padding: 8px 12px;
  background: var(--bg-grey);
  color: var(--text-white);
  font-size: 0.75rem;
  max-height: 30vh;
  overflow-y: auto;
}

.legend-section {
  margin-bottom: 8px;
}

.legend-section h3 {
  font-size: 0.8rem;
  margin: 0 0 4px 0;
  color: #ccc;
}

.legend-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 4px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
}

.legend-key {
  font-weight: bold;
  min-width: 20px;
}

/* Hide scoreboard view when map is active */
body.map-active .scoreboard,
body.map-active .grid,
body.map-active .header {
  display: none;
}

body.map-active .map-view {
  display: flex;
}
```

**Step 2: Verify styles load**

Run: Browser, check map-view element has styles applied
Expected: Element styled but hidden (display: none)

**Step 3: Commit**

```bash
git add web/styles.css
git commit -m "feat(map): add map view CSS styles"
```

---

### Task 6: Update Render Function for View Switching

**Files:**
- Modify: `web/app.js:201-206`

**Step 1: Update render function**

Replace the render function:

```javascript
// Render the UI
function render() {
  // Update body class for view switching
  document.body.classList.toggle('map-active', state.currentView === 'map');
  
  if (state.currentView === 'map') {
    renderMapView();
  } else {
    renderScoreboard();
    renderHeader();
    renderGrid();
  }
}
```

**Step 2: Add renderMapView stub**

Add after render function:

```javascript
function renderMapView() {
  const mapView = document.getElementById('map-view');
  mapView.classList.add('active');
  renderMapLegend();
}
```

**Step 3: Verify view switching**

Run: Browser console, `state.currentView = 'map'; render();`
Expected: Scoreboard hides, map view shows

**Step 4: Commit**

```bash
git add web/app.js
git commit -m "feat(map): add view switching to render function"
```

---

### Task 7: Add Map Legend Rendering

**Files:**
- Modify: `web/app.js` (after renderMapView)

**Step 1: Add legend rendering function**

```javascript
function renderMapLegend() {
  const legendEl = document.getElementById('map-legend');
  if (!state.mapState) return;
  
  const { selectedPlatters, platterRotations, keyAssignments } = state.mapState;
  
  // Platter labels
  const platterLabels = ['A', 'B', 'C'];
  const platterItems = selectedPlatters.map((p, i) => 
    `<div class="legend-item"><span class="legend-key">${platterLabels[i]}:</span> Platter ${p}</div>`
  ).join('');
  
  // Key items
  const keyItems = Object.entries(keyAssignments).map(([num, data]) => {
    let label;
    if (data.type === 'faction') {
      label = data.faction;
    } else if (data.type === 'lith') {
      label = 'Lith';
    } else {
      label = 'Dome';
    }
    return `<div class="legend-item"><span class="legend-key">${num}:</span> ${label}</div>`;
  }).join('');
  
  legendEl.innerHTML = `
    <div class="legend-section">
      <h3>Platters</h3>
      <div class="legend-grid">${platterItems}</div>
    </div>
    <div class="legend-section">
      <h3>Keys</h3>
      <div class="legend-grid">${keyItems}</div>
    </div>
  `;
}
```

**Step 2: Verify legend renders**

Run: Browser, open map view, check legend shows platter and key assignments
Expected: Legend displays with correct assignments

**Step 3: Commit**

```bash
git add web/app.js
git commit -m "feat(map): add map legend rendering"
```

---

### Task 8: Add Random Map Button to Settings

**Files:**
- Modify: `web/index.html:58-62`

**Step 1: Add Random Map button**

Insert before the modal-buttons div:

```html
        <div class="setting-row" id="random-map-row">
          <button id="random-map-btn" class="setting-btn">Random Map</button>
        </div>
```

**Step 2: Add CSS for setting-btn**

Add to `web/styles.css`:

```css
.setting-btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background: var(--btn-white);
  color: var(--text-black);
  font-size: 0.9rem;
  cursor: pointer;
}

#random-map-row {
  display: none;
}

body[data-faction-count="5"] #random-map-row {
  display: block;
}
```

**Step 3: Commit**

```bash
git add web/index.html web/styles.css
git commit -m "feat(map): add Random Map button to settings (5 factions only)"
```

---

### Task 9: Wire Up Event Listeners

**Files:**
- Modify: `web/app.js` (in init function, around line 586-593)

**Step 1: Add event listeners for map buttons**

Add after the `close-settings-btn` listener:

```javascript
  // Map view buttons
  document.getElementById('random-map-btn').addEventListener('click', () => {
    closeSettingsModal();
    openMapView();
  });
  
  document.getElementById('map-back-btn').addEventListener('click', closeMapView);
  
  document.getElementById('map-shuffle-btn').addEventListener('click', shuffleMap);
```

**Step 2: Update render to set faction count data attribute**

In the render function, add after the body class toggle:

```javascript
  document.body.dataset.factionCount = state.factionCount;
```

**Step 3: Verify buttons work**

Run: Browser, set factions to 5, open settings, click Random Map
Expected: Map view opens with randomized assignments

**Step 4: Commit**

```bash
git add web/app.js
git commit -m "feat(map): wire up map view event listeners"
```

---

### Task 10: Update Build Script for Map Assets

**Files:**
- Modify: `web/build-standalone.sh`

**Step 1: Add map-tri.svg and top-marker.svg to base64 encoding**

After the LITH_B64 line (around line 24), add:

```bash
MAP_TRI_B64=$(base64 < map-tri.svg | tr -d '\n')
TOP_MARKER_B64=$(base64 < top-marker.svg | tr -d '\n')
```

**Step 2: Add sed replacements**

After the lith.svg sed replacement, add:

```bash
  sed "s|map-tri.svg|data:image/svg+xml;base64,$MAP_TRI_B64|g" | \
  sed "s|top-marker.svg|data:image/svg+xml;base64,$TOP_MARKER_B64|g" | \
```

**Step 3: Rebuild and verify**

Run: `./build-standalone.sh`
Expected: Build succeeds, worldspanner.html contains embedded map SVG

**Step 4: Commit**

```bash
git add web/build-standalone.sh
git commit -m "feat(map): add map SVGs to standalone build"
```

---

## Council Perspectives

### Consensus

- State structure implemented before UI (Tasks 1-3)
- View switching mechanism is foundational (Tasks 2, 6)
- Follow existing patterns for consistency

### Advisor Contributions

#### Architect

- Pure functions for randomization (shuffleArray, initializeMapState)
- State persistence follows existing pattern
- Separation of renderMapView from scoreboard rendering

#### UX Reviewer

- Back button and shuffle have adequate touch targets (44px min)
- Random Map button only visible when applicable (5 factions)
- Legend scrollable for mobile

---

## Next Steps

> Run `/cp.execute` when ready to implement this plan.

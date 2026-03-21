// Constants
const PHASES = [
  'W Free', 'W Action', 'B Reaction', 'WB Melee', 'W Adventure', 'W Reinforce',
  'B Free', 'B Action', 'W Reaction', 'BW Melee', 'B Adventure', 'B Reinforce'
];

const FACTIONS = [
  { name: 'Lords', location: 'Crown District' },
  { name: 'Warriors', location: 'Steel Bastion' },
  { name: 'Defenders', location: 'Watchman Keep' },
  { name: 'Villains', location: 'Dreadmark' },
  { name: 'Icons', location: 'Celestial Theatre' },
  { name: 'Outcasts', location: 'Smugglers Den' },
  { name: 'Exemplars', location: 'Hope Hospice' },
  { name: 'Adventurers', location: 'Lostlight Society' },
  { name: 'Commoners', location: 'Green Vale' }
];

const FIXED_SLOTS = [
  { name: "Lith's Favour", location: '' },
  { name: 'Underpit', location: '' },
  { name: 'Underpit', location: '' }
];

const STORAGE_KEY = 'worldspanner_state';

// Default state
const DEFAULT_STATE = {
  factions: ['Lords', 'Warriors', 'Defenders', 'Villains', 'Icons'],
  scores: [0, 0, 0, 0, 0, 0, 0, 0],
  phase: 5,
  round: 1,
  endRound: 10
};

// Current state
let state = loadState();

// Load state from localStorage
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_STATE, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return { ...DEFAULT_STATE };
}

// Save state to localStorage
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

// Reset to new game
function resetGame() {
  state = { ...DEFAULT_STATE, factions: [...state.factions], endRound: state.endRound };
  saveState();
  render();
}

// Get faction location by name
function getFactionLocation(name) {
  const faction = FACTIONS.find(f => f.name === name);
  return faction ? faction.location : '';
}

// Get phase team color (white or black text)
function getPhaseTeam(phaseIndex) {
  // Phases 0-5 are White team, 6-11 are Black team
  return phaseIndex < 6 ? 'white' : 'black';
}

// Advance phase (with Round 1 special logic)
function advancePhase() {
  if (state.round === 1) {
    // Round 1: only phases 5 and 11
    if (state.phase === 5) {
      state.phase = 11;
    } else if (state.phase === 11) {
      state.phase = 0;
      state.round = 2;
    }
  } else {
    // Normal cycle
    if (state.phase < 11) {
      state.phase++;
    } else if (state.round < state.endRound) {
      state.phase = 0;
      state.round++;
    }
  }
  saveState();
  render();
}

// Set phase directly
function setPhase(phaseIndex) {
  state.phase = phaseIndex;
  saveState();
  render();
}

// Set round directly
function setRound(roundNum) {
  state.round = roundNum;
  saveState();
  render();
}

// Set end round
function setEndRound(endRound) {
  state.endRound = endRound;
  if (state.round > endRound) {
    state.round = endRound;
  }
  saveState();
  render();
}

// Adjust tug-of-war score (slots 0-5)
function adjustScore(slotIndex, delta) {
  if (slotIndex >= 0 && slotIndex <= 5) {
    state.scores[slotIndex] += delta;
    saveState();
    render();
  }
}

// Toggle boolean (slots 6-7)
function toggleSlot(slotIndex) {
  if (slotIndex === 6 || slotIndex === 7) {
    state.scores[slotIndex] = state.scores[slotIndex] === 0 ? 1 : 0;
    saveState();
    render();
  }
}

// Set faction for slot
function setFaction(slotIndex, factionName) {
  if (slotIndex >= 0 && slotIndex <= 4) {
    state.factions[slotIndex] = factionName;
    saveState();
    render();
  }
}

// Render the UI
function render() {
  renderHeader();
  renderGrid();
}

function renderHeader() {
  const phaseNameEl = document.getElementById('phase-name');
  const roundDisplayEl = document.getElementById('round-display');
  const headerEl = document.getElementById('header');
  
  const phaseName = PHASES[state.phase];
  const team = getPhaseTeam(state.phase);
  
  phaseNameEl.textContent = phaseName;
  roundDisplayEl.textContent = `${state.round}/${state.endRound}`;
  
  // Set header color based on team
  if (team === 'white') {
    headerEl.style.background = '#404040';
    headerEl.style.color = '#fff';
  } else {
    headerEl.style.background = '#a0a0a0';
    headerEl.style.color = '#000';
  }
}

function renderGrid() {
  const gridEl = document.getElementById('grid');
  gridEl.innerHTML = '';
  
  for (let i = 0; i < 8; i++) {
    const slot = createSlot(i);
    gridEl.appendChild(slot);
  }
}

function createSlot(index) {
  const slot = document.createElement('div');
  slot.className = 'slot';
  
  const score = state.scores[index];
  
  if (index <= 4) {
    // Faction slots (0-4)
    const factionName = state.factions[index];
    const location = getFactionLocation(factionName);
    
    slot.innerHTML = `
      <div class="slot-name">${factionName}</div>
      <div class="slot-location">${location}</div>
      <div class="slot-value">${Math.abs(score)}</div>
      <div class="tow-buttons">
        <button class="tow-btn tow-btn-white" data-slot="${index}" data-delta="-1">−</button>
        <button class="tow-btn tow-btn-black" data-slot="${index}" data-delta="1">+</button>
      </div>
    `;
    
    setSlotBackground(slot, score);
    
    // Faction name click handler
    slot.querySelector('.slot-name').addEventListener('click', () => openFactionModal(index));
    
  } else if (index === 5) {
    // Lith's Favour
    slot.innerHTML = `
      <div class="slot-name">Lith's Favour</div>
      <div class="slot-value">${Math.abs(score)}</div>
      <div class="tow-buttons">
        <button class="tow-btn tow-btn-white" data-slot="${index}" data-delta="-1">−</button>
        <button class="tow-btn tow-btn-black" data-slot="${index}" data-delta="1">+</button>
      </div>
    `;
    
    setSlotBackground(slot, score);
    
  } else {
    // Underpit toggles (6-7)
    const isActive = score !== 0;
    const isWhiteSlot = index === 6;
    
    slot.classList.add('slot-toggle');
    slot.classList.add(isWhiteSlot ? 'slot-underpit-w' : 'slot-underpit-b');
    if (isActive) slot.classList.add('active');
    
    slot.innerHTML = `
      <div class="slot-name">Underpit</div>
      <div class="slot-value">${isActive ? 'Yes' : 'No'}</div>
    `;
    
    slot.addEventListener('click', () => toggleSlot(index));
  }
  
  return slot;
}

function setSlotBackground(slot, score) {
  slot.classList.remove('slot-neutral', 'slot-black', 'slot-white');
  if (score === 0) {
    slot.classList.add('slot-neutral');
  } else if (score > 0) {
    slot.classList.add('slot-black');
  } else {
    slot.classList.add('slot-white');
  }
}

// Modal state
let currentFactionSlot = null;

function openFactionModal(slotIndex) {
  currentFactionSlot = slotIndex;
  const modal = document.getElementById('faction-modal');
  const list = document.getElementById('faction-list');
  
  list.innerHTML = FACTIONS.map(f => `
    <div class="faction-option" data-faction="${f.name}">
      <div>${f.name}</div>
      <div class="location">${f.location}</div>
    </div>
  `).join('');
  
  modal.classList.add('open');
}

function closeFactionModal() {
  document.getElementById('faction-modal').classList.remove('open');
  currentFactionSlot = null;
}

function openSettingsModal() {
  const modal = document.getElementById('settings-modal');
  const phaseSelect = document.getElementById('phase-select');
  const roundSelect = document.getElementById('round-select');
  const endRoundSelect = document.getElementById('end-round-select');
  
  // Populate phase select
  phaseSelect.innerHTML = PHASES.map((p, i) => 
    `<option value="${i}" ${i === state.phase ? 'selected' : ''}>${p}</option>`
  ).join('');
  
  // Populate round select
  roundSelect.innerHTML = '';
  for (let r = 1; r <= state.endRound; r++) {
    roundSelect.innerHTML += `<option value="${r}" ${r === state.round ? 'selected' : ''}>${r}</option>`;
  }
  
  // Populate end round select
  endRoundSelect.innerHTML = '';
  for (let r = 8; r <= 12; r++) {
    endRoundSelect.innerHTML += `<option value="${r}" ${r === state.endRound ? 'selected' : ''}>${r}</option>`;
  }
  
  modal.classList.add('open');
}

function closeSettingsModal() {
  document.getElementById('settings-modal').classList.remove('open');
}

// Initialize event listeners
function init() {
  // Header click to advance phase
  document.getElementById('phase-display').addEventListener('click', advancePhase);
  
  // Settings button
  document.getElementById('settings-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    openSettingsModal();
  });
  
  // Settings modal
  document.getElementById('phase-select').addEventListener('change', (e) => {
    setPhase(parseInt(e.target.value));
  });
  
  document.getElementById('round-select').addEventListener('change', (e) => {
    setRound(parseInt(e.target.value));
  });
  
  document.getElementById('end-round-select').addEventListener('change', (e) => {
    setEndRound(parseInt(e.target.value));
  });
  
  document.getElementById('new-game-btn').addEventListener('click', () => {
    resetGame();
    closeSettingsModal();
  });
  
  document.getElementById('close-settings-btn').addEventListener('click', closeSettingsModal);
  
  // Faction modal
  document.getElementById('faction-list').addEventListener('click', (e) => {
    const option = e.target.closest('.faction-option');
    if (option && currentFactionSlot !== null) {
      setFaction(currentFactionSlot, option.dataset.faction);
      closeFactionModal();
    }
  });
  
  document.getElementById('close-faction-btn').addEventListener('click', closeFactionModal);
  
  // Grid button clicks (delegated)
  document.getElementById('grid').addEventListener('click', (e) => {
    const btn = e.target.closest('.tow-btn');
    if (btn) {
      const slot = parseInt(btn.dataset.slot);
      const delta = parseInt(btn.dataset.delta);
      adjustScore(slot, delta);
    }
  });
  
  // Initial render
  render();
}

// Keyboard navigation
let selectedSlot = -1; // -1 = header, 0-7 = slots

function handleKeydown(e) {
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      e.preventDefault();
      selectedSlot = Math.min(selectedSlot + 1, 7);
      updateSelection();
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault();
      selectedSlot = Math.max(selectedSlot - 1, -1);
      updateSelection();
      break;
    case '+':
    case '=':
      if (selectedSlot >= 0 && selectedSlot <= 5) {
        adjustScore(selectedSlot, 1);
      }
      break;
    case '-':
    case '_':
      if (selectedSlot >= 0 && selectedSlot <= 5) {
        adjustScore(selectedSlot, -1);
      }
      break;
    case 'Enter':
    case ' ':
      e.preventDefault();
      if (selectedSlot === -1) {
        advancePhase();
      } else if (selectedSlot >= 6) {
        toggleSlot(selectedSlot);
      } else if (selectedSlot >= 0 && selectedSlot <= 4) {
        openFactionModal(selectedSlot);
      }
      break;
  }
}

function updateSelection() {
  // Remove existing highlights
  document.querySelectorAll('.slot-selected, .header-selected').forEach(el => {
    el.classList.remove('slot-selected', 'header-selected');
  });
  
  if (selectedSlot === -1) {
    document.getElementById('header').classList.add('header-selected');
  } else {
    const slots = document.querySelectorAll('.slot');
    if (slots[selectedSlot]) {
      slots[selectedSlot].classList.add('slot-selected');
    }
  }
}

document.addEventListener('keydown', handleKeydown);

// Start app
document.addEventListener('DOMContentLoaded', init);

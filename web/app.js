// Constants
const PHASES = [
  { name: 'Free', team: 'white' },
  { name: 'Action', team: 'white' },
  { name: 'Reaction', team: 'black' },
  { name: 'Melee', team: 'both-white' },
  { name: 'Adventure', team: 'white' },
  { name: 'Reinforce', team: 'white' },
  { name: 'Free', team: 'black' },
  { name: 'Action', team: 'black' },
  { name: 'Reaction', team: 'white' },
  { name: 'Melee', team: 'both-black' },
  { name: 'Adventure', team: 'black' },
  { name: 'Reinforce', team: 'black' }
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

const STORAGE_KEY = 'worldspanner_state';
const STATE_VERSION = 1;

// Default state
const DEFAULT_STATE = {
  version: STATE_VERSION,
  factionCount: 5,
  factions: ['', '', '', '', '', '', '', '', ''],
  scores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
      const parsed = JSON.parse(saved);
      // Migration: if version is missing or outdated, could handle here
      if (!parsed.version || parsed.version < STATE_VERSION) {
        console.log('Migrating state from version', parsed.version || 0, 'to', STATE_VERSION);
        // Future migrations would go here
      }
      return { ...DEFAULT_STATE, ...parsed, version: STATE_VERSION };
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
  state = { ...DEFAULT_STATE, factions: ['', '', '', '', '', '', '', '', ''], factionCount: state.factionCount, endRound: state.endRound };
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
    // Round 1: normally only phases 5 and 11, but handle edge cases
    if (state.phase < 5) {
      state.phase = 5;
    } else if (state.phase < 11) {
      state.phase = 11;
    } else {
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

// Set faction count
function setFactionCount(count) {
  state.factionCount = count;
  saveState();
  render();
}

// Adjust tug-of-war score (factions + Lith's Favour)
function adjustScore(slotIndex, delta) {
  const maxTowIndex = state.factionCount; // factions (0 to factionCount-1) + Lith (factionCount)
  if (slotIndex >= 0 && slotIndex <= maxTowIndex) {
    state.scores[slotIndex] += delta;
    saveState();
    render();
  }
}

// Toggle boolean (Underpit slots)
function toggleSlot(slotIndex) {
  const underpitWhiteIndex = state.factionCount + 1;
  const underpitBlackIndex = state.factionCount + 2;
  if (slotIndex === underpitWhiteIndex || slotIndex === underpitBlackIndex) {
    state.scores[slotIndex] = state.scores[slotIndex] === 0 ? 1 : 0;
    saveState();
    render();
  }
}

// Set faction for slot
function setFaction(slotIndex, factionName) {
  if (slotIndex >= 0 && slotIndex < state.factionCount) {
    state.factions[slotIndex] = factionName;
    saveState();
    render();
  }
}

// Render the UI
function render() {
  renderScoreboard();
  renderHeader();
  renderGrid();
}

function renderHeader() {
  const phaseNameEl = document.getElementById('phase-name');
  const roundDisplayEl = document.getElementById('round-display');
  const headerEl = document.getElementById('header');
  const teamIconEl = document.getElementById('team-icon');
  
  const phase = PHASES[state.phase];
  const team = getPhaseTeam(state.phase);
  const isMelee = phase.team === 'both-white' || phase.team === 'both-black';
  
  phaseNameEl.textContent = phase.name;
  roundDisplayEl.textContent = `${state.round}/${state.endRound}`;
  
  // Set team icon - melee uses hybrid logo
  if (isMelee) {
    teamIconEl.src = 'melee.png';
  } else if (phase.team === 'white') {
    teamIconEl.src = 'skyhawks.png';
  } else {
    teamIconEl.src = 'psiclones.png';
  }
  
  // Set header text color to match active team (background always blue-grey)
  headerEl.style.color = team === 'white' ? '#fff' : '#000';
}

function renderGrid() {
  const gridEl = document.getElementById('grid');
  gridEl.innerHTML = '';
  
  const factionCount = state.factionCount;
  // Total slots: factions + Lith's Favour + 2 Underpit + blank if odd total
  const baseSlots = factionCount + 1 + 2; // factions + Lith + 2 Underpit
  const needsBlank = baseSlots % 2 !== 0;
  const totalSlots = needsBlank ? baseSlots + 1 : baseSlots;
  
  // Update grid rows dynamically
  const rows = totalSlots / 2;
  gridEl.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  
  // Add scale class based on row count for text sizing
  gridEl.classList.remove('grid-4-rows', 'grid-5-rows', 'grid-6-rows');
  gridEl.classList.add(`grid-${rows}-rows`);
  
  for (let i = 0; i < totalSlots; i++) {
    const slot = createSlot(i, factionCount, needsBlank, totalSlots);
    gridEl.appendChild(slot);
  }
}

function renderScoreboard() {
  const scoreboardEl = document.getElementById('scoreboard');
  const scores = calculateScores();
  
  scoreboardEl.innerHTML = '';
  
  const skyhawksCell = document.createElement('div');
  skyhawksCell.className = 'scoreboard-cell skyhawks';
  skyhawksCell.innerHTML = `
    <img class="scoreboard-icon" src="skyhawks.png" alt="Skyhawks">
    <span class="scoreboard-name">Skyhawks</span>
    <span class="scoreboard-score">${scores.white}</span>
  `;
  scoreboardEl.appendChild(skyhawksCell);
  
  const psiclonesCell = document.createElement('div');
  psiclonesCell.className = 'scoreboard-cell psiclones';
  psiclonesCell.innerHTML = `
    <img class="scoreboard-icon" src="psiclones.png" alt="Psiclones">
    <span class="scoreboard-name">Psiclones</span>
    <span class="scoreboard-score">${scores.black}</span>
  `;
  scoreboardEl.appendChild(psiclonesCell);
}

function createSlot(index, factionCount, needsBlank, totalSlots) {
  const slot = document.createElement('div');
  slot.className = 'slot';
  
  // Slot layout: factions, Lith, [blank if needed], underpit white, underpit black
  const lithIndex = factionCount;
  const blankIndex = needsBlank ? factionCount + 1 : -1;
  const underpitWhiteIndex = needsBlank ? factionCount + 2 : factionCount + 1;
  const underpitBlackIndex = needsBlank ? factionCount + 3 : factionCount + 2;
  
  // Map display index to score index (scores don't include blank)
  const getScoreIndex = (idx) => {
    if (idx <= lithIndex) return idx;
    if (needsBlank && idx === blankIndex) return -1; // blank has no score
    if (needsBlank) return idx - 1; // shift down by 1 after blank
    return idx;
  };
  
  const scoreIndex = getScoreIndex(index);
  const score = scoreIndex >= 0 ? state.scores[scoreIndex] : 0;
  
  if (index < factionCount) {
    // Faction slots
    const factionName = state.factions[index] || 'Unknown';
    const location = getFactionLocation(factionName);
    const absScore = Math.abs(score);
    const milestone = absScore >= 4 ? '4' : (absScore >= 3 ? '3' : '');
    
    slot.innerHTML = `
      <div class="slot-name">${factionName} <span class="dropdown-arrow">▼</span></div>
      <div class="slot-location">${location || '—'}${milestone ? ` <span class="milestone">${milestone}</span>` : ''}</div>
      <div class="slot-value">${absScore}</div>
      <div class="tow-buttons">
        <button class="tow-btn tow-btn-white" data-slot="${scoreIndex}" data-delta="-1"><img src="skyhawks.png" alt="−"></button>
        <button class="tow-btn tow-btn-black" data-slot="${scoreIndex}" data-delta="1"><img src="psiclones.png" alt="+"></button>
      </div>
    `;
    
    setSlotBackground(slot, score);
    
    // Faction name click handler
    slot.querySelector('.slot-name').addEventListener('click', () => openFactionModal(index));
    
  } else if (index === lithIndex) {
    // Lith's Favour
    slot.innerHTML = `
      <div class="slot-name">Lith's Favour</div>
      <div class="slot-value">${Math.abs(score)}</div>
      <div class="tow-buttons">
        <button class="tow-btn tow-btn-white" data-slot="${scoreIndex}" data-delta="-1"><img src="skyhawks.png" alt="−"></button>
        <button class="tow-btn tow-btn-black" data-slot="${scoreIndex}" data-delta="1"><img src="psiclones.png" alt="+"></button>
      </div>
    `;
    
    setSlotBackground(slot, score);
    
  } else if (index === blankIndex) {
    // Blank cell for even grid (before underpit)
    slot.classList.add('slot-blank');
    slot.innerHTML = '';
    
  } else if (index === underpitWhiteIndex || index === underpitBlackIndex) {
    // Underpit toggles
    const isActive = score !== 0;
    const isWhiteSlot = index === underpitWhiteIndex;
    const teamLogo = isWhiteSlot ? 'skyhawks.png' : 'psiclones.png';
    
    slot.classList.add('slot-toggle');
    
    // Use standard slot background classes
    // No (inactive): show team color, Yes (active): show grey
    if (isActive) {
      slot.classList.add('slot-neutral');
    } else {
      slot.classList.add(isWhiteSlot ? 'slot-white' : 'slot-black');
    }
    
    slot.innerHTML = `
      <div class="slot-name">Any in Underpit?</div>
      <img class="underpit-icon" src="${teamLogo}" alt="">
      <div class="slot-value">${isActive ? 'Yes' : 'No'}</div>
    `;
    
    slot.addEventListener('click', () => toggleSlot(scoreIndex));
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

function calculateScores() {
  let white = 0;
  let black = 0;
  
  const factionCount = state.factionCount;
  const lithIndex = factionCount;
  const underpitWhiteIndex = factionCount + 1;
  const underpitBlackIndex = factionCount + 2;
  
  // Tug-of-war slots (factions + Lith's Favour)
  for (let i = 0; i <= lithIndex; i++) {
    const score = state.scores[i];
    if (score < 0) white++;
    else if (score > 0) black++;
  }
  
  // Underpit toggles: "No" (score=0) shows team color = point for that team
  const underpitWhiteScore = state.scores[underpitWhiteIndex];
  const underpitBlackScore = state.scores[underpitBlackIndex];
  if (underpitWhiteScore === 0) white++;
  if (underpitBlackScore === 0) black++;
  
  return { white, black };
}

// Modal state
let currentFactionSlot = null;

function openFactionModal(slotIndex) {
  currentFactionSlot = slotIndex;
  const modal = document.getElementById('faction-modal');
  const list = document.getElementById('faction-list');
  
  // Get factions already selected in other slots
  const usedFactions = state.factions
    .slice(0, state.factionCount)
    .filter((f, i) => f && i !== slotIndex);
  
  // Filter out used factions
  const availableFactions = FACTIONS.filter(f => !usedFactions.includes(f.name));
  
  list.innerHTML = availableFactions.map(f => `
    <div class="faction-option" data-faction="${f.name}">
      <div>${f.name}</div>
      <div class="location">${f.location}</div>
    </div>
  `).join('');
  
  modal.classList.add('open');
  
  // Close on backdrop click
  modal.onclick = (e) => {
    if (e.target === modal) closeFactionModal();
  };
}

function closeFactionModal() {
  document.getElementById('faction-modal').classList.remove('open');
  currentFactionSlot = null;
}

function refreshPhaseSelect() {
  const phaseSelect = document.getElementById('phase-select');
  
  // Round 1 only shows Reinforce phases
  const validPhases = state.round === 1 
    ? PHASES.map((p, i) => ({ ...p, index: i })).filter(p => p.name === 'Reinforce')
    : PHASES.map((p, i) => ({ ...p, index: i }));
  
  phaseSelect.innerHTML = validPhases.map(p => 
    `<option value="${p.index}" ${p.index === state.phase ? 'selected' : ''}>${p.name} (${p.team})</option>`
  ).join('');
}

function openSettingsModal() {
  const modal = document.getElementById('settings-modal');
  const roundSelect = document.getElementById('round-select');
  const endRoundSelect = document.getElementById('end-round-select');
  const factionCountSelect = document.getElementById('faction-count-select');
  
  refreshPhaseSelect();
  
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
  
  // Populate faction count select
  factionCountSelect.innerHTML = '';
  for (let f = 5; f <= 9; f++) {
    factionCountSelect.innerHTML += `<option value="${f}" ${f === state.factionCount ? 'selected' : ''}>${f}</option>`;
  }
  
  modal.classList.add('open');
  
  // Close on backdrop click
  modal.onclick = (e) => {
    if (e.target === modal) closeSettingsModal();
  };
}

function closeSettingsModal() {
  document.getElementById('settings-modal').classList.remove('open');
}

// Initialize event listeners
function init() {
  // Header clickable area to advance phase
  const headerClickable = document.getElementById('header-clickable');
  if (headerClickable) {
    headerClickable.addEventListener('click', advancePhase);
  }
  
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
    // Refresh phase dropdown since valid phases depend on round
    refreshPhaseSelect();
  });
  
  document.getElementById('end-round-select').addEventListener('change', (e) => {
    setEndRound(parseInt(e.target.value));
  });
  
  document.getElementById('faction-count-select').addEventListener('change', (e) => {
    setFactionCount(parseInt(e.target.value));
  });
  
  document.getElementById('new-game-btn').addEventListener('click', () => {
    if (confirm('Start new game? Current progress will be lost.')) {
      resetGame();
      closeSettingsModal();
    }
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
  // Ignore keyboard nav when modal is open
  const settingsModal = document.getElementById('settings-modal');
  const factionModal = document.getElementById('faction-modal');
  if (settingsModal.classList.contains('open') || factionModal.classList.contains('open')) {
    if (e.key === 'Escape') {
      closeSettingsModal();
      closeFactionModal();
    }
    return;
  }
  
  switch (e.key) {
    case 'Escape':
      closeSettingsModal();
      closeFactionModal();
      break;
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

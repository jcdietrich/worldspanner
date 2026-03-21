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

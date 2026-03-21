# Worldspanner Web Scorekeeper

A browser-based scorekeeper for Worldspanner, replicating the M5 Fire device functionality.

## Usage

### Multi-file version (development)

Open `index.html` directly in a browser via `file://` protocol, or serve with any static server:

```bash
python3 -m http.server 8000
# Then open http://localhost:8000
```

### Standalone version (portable)

Build a single HTML file with all assets embedded:

```bash
./build-standalone.sh
```

This creates `worldspanner.html` (~50KB) which can be:
- Emailed
- Put on a USB drive
- Opened offline without a server

## Features

- 12-phase turn tracking with team indicators
- 8-slot grid with faction selection
- Tug-of-war scoring (slots 1-4)
- Toggle scoring (slots 5-8)
- Round tracking (configurable end round 8-12)
- Local storage persistence
- Keyboard navigation support
- Mobile-first responsive design

## Files

- `index.html` — Main HTML structure
- `styles.css` — All styling
- `app.js` — State management and logic
- `skyhawks.png` / `psiclones.png` — Team icons (greyscale)
- `build-standalone.sh` — Bundles everything into single HTML

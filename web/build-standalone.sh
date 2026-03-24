#!/bin/bash
set -e

cd "$(dirname "$0")"

# Check dependencies
command -v base64 >/dev/null || { echo "Error: base64 required"; exit 1; }

# Check for optimization tools
HAS_PNGQUANT=$(command -v pngquant >/dev/null && echo 1 || echo 0)
HAS_TERSER=$(command -v terser >/dev/null && echo 1 || echo 0)
HAS_CLEANCSS=$(command -v cleancss >/dev/null && echo 1 || echo 0)

echo "Building standalone HTML..."

# Create temp directory for optimized images
TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT

# Base64 encode SVGs for team logos
SKYHAWKS_B64=$(base64 < skyhawks.svg | tr -d '\n')
PSICLONES_B64=$(base64 < psiclones.svg | tr -d '\n')

# Optimize and base64 encode melee PNG
if [ "$HAS_PNGQUANT" = "1" ]; then
  echo "Optimizing melee image with pngquant..."
  pngquant --quality=65-80 --output "$TMPDIR/melee.png" melee.png 2>/dev/null || cp melee.png "$TMPDIR/melee.png"
  MELEE_B64=$(base64 < "$TMPDIR/melee.png" | tr -d '\n')
else
  MELEE_B64=$(base64 < melee.png | tr -d '\n')
fi

# Base64 encode favicon SVG
FAVICON_B64=$(base64 < favicon.svg | tr -d '\n')

# Minify CSS
if [ "$HAS_CLEANCSS" = "1" ]; then
  echo "Minifying CSS with clean-css..."
  CSS=$(cleancss styles.css)
else
  echo "clean-css not found, using unminified CSS"
  CSS=$(cat styles.css)
fi

# Minify JS
if [ "$HAS_TERSER" = "1" ]; then
  echo "Minifying JS with terser..."
  JS=$(terser app.js --compress --mangle)
else
  echo "terser not found, using unminified JS"
  JS=$(cat app.js)
fi

# Update JS to use data URIs for images
JS_MODIFIED=$(echo "$JS" | sed "s|skyhawks.svg|data:image/svg+xml;base64,$SKYHAWKS_B64|g" | sed "s|psiclones.svg|data:image/svg+xml;base64,$PSICLONES_B64|g" | sed "s|melee.png|data:image/png;base64,$MELEE_B64|g")

# Generate standalone HTML
cat > worldspanner.html << HTMLEOF
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Worldspanner</title>
  <link rel="icon" href="data:image/svg+xml;base64,$FAVICON_B64">
  <meta name="theme-color" content="#404040">
  <style>
$CSS
  </style>
</head>
<body>
  <div class="app">
    <div class="scoreboard" id="scoreboard"></div>

    <main class="grid" id="grid"></main>

    <header class="header" id="header">
      <div class="header-clickable" id="header-clickable" title="Click to advance phase">
        <img class="team-icon" id="team-icon" src="data:image/svg+xml;base64,$SKYHAWKS_B64" alt="Team">
        <span class="phase-name" id="phase-name">Reinforce</span>
        <span class="round-display" id="round-display">1/10</span>
      </div>
      <button class="settings-btn" id="settings-btn" title="Open settings">⚙</button>
    </header>

    <div class="modal" id="settings-modal">
      <div class="modal-content">
        <h2>Settings</h2>
        <div class="setting-row">
          <label for="phase-select">Phase:</label>
          <select id="phase-select"></select>
        </div>
        <div class="setting-row">
          <label for="round-select">Round:</label>
          <select id="round-select"></select>
        </div>
        <div class="setting-row">
          <label for="end-round-select">End Round:</label>
          <select id="end-round-select"></select>
        </div>
        <div class="setting-row">
          <label for="faction-count-select">Factions:</label>
          <select id="faction-count-select"></select>
        </div>
        <div class="setting-row">
          <label for="hide-underpit-icons">Hide Underpit Icons:</label>
          <input type="checkbox" id="hide-underpit-icons">
        </div>
        <div class="modal-buttons">
          <button id="new-game-btn">New Game</button>
          <button id="close-settings-btn">Close</button>
        </div>
      </div>
    </div>

    <div class="modal" id="faction-modal">
      <div class="modal-content">
        <h2>Select Faction</h2>
        <div class="faction-list" id="faction-list"></div>
        <button id="close-faction-btn">Cancel</button>
      </div>
    </div>
  </div>

  <script>
$JS_MODIFIED
  </script>
</body>
</html>
HTMLEOF

echo "Created worldspanner.html"
ls -lh worldspanner.html

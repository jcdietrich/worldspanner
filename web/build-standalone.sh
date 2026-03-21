#!/bin/bash
set -e

cd "$(dirname "$0")"

# Check dependencies
command -v base64 >/dev/null || { echo "Error: base64 required"; exit 1; }

echo "Building standalone HTML..."

# Base64 encode PNGs (tr -d '\n' for cross-platform compatibility)
SKYHAWKS_B64=$(base64 < skyhawks.png | tr -d '\n')
PSICLONES_B64=$(base64 < psiclones.png | tr -d '\n')
MELEE_B64=$(base64 < melee.png | tr -d '\n')

# Base64 encode favicon SVG
FAVICON_B64=$(base64 < favicon.svg | tr -d '\n')

# Read CSS and JS
CSS=$(cat styles.css)
JS=$(cat app.js)

# Update JS to use data URIs for images
JS_MODIFIED=$(echo "$JS" | sed "s|skyhawks.png|data:image/png;base64,$SKYHAWKS_B64|g" | sed "s|psiclones.png|data:image/png;base64,$PSICLONES_B64|g" | sed "s|melee.png|data:image/png;base64,$MELEE_B64|g")

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
      <div class="header-clickable" id="header-clickable">
        <img class="team-icon" id="team-icon" src="data:image/png;base64,$SKYHAWKS_B64" alt="Team">
        <span class="phase-name" id="phase-name">Reinforce</span>
        <span class="round-display" id="round-display">1/10</span>
      </div>
      <button class="settings-btn" id="settings-btn">⚙</button>
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

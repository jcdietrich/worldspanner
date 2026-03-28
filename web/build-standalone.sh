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
MELEE_B64=$(base64 < melee.svg | tr -d '\n')
LITH_B64=$(base64 < lith.svg | tr -d '\n')
MAP_TRI_B64=$(base64 < map-tri.svg | tr -d '\n')

# Optimize and base64 encode PNGs
if [ "$HAS_PNGQUANT" = "1" ]; then
  echo "Optimizing PNG images with pngquant..."
  pngquant --quality=20-40 --speed=1 --output "$TMPDIR/lords.png" lords.png 2>/dev/null || cp lords.png "$TMPDIR/lords.png"
  pngquant --quality=20-40 --speed=1 --output "$TMPDIR/warriors.png" warriors.png 2>/dev/null || cp warriors.png "$TMPDIR/warriors.png"
  pngquant --quality=20-40 --speed=1 --output "$TMPDIR/defenders.png" defenders.png 2>/dev/null || cp defenders.png "$TMPDIR/defenders.png"
  pngquant --quality=20-40 --speed=1 --output "$TMPDIR/villains.png" villains.png 2>/dev/null || cp villains.png "$TMPDIR/villains.png"
  pngquant --quality=20-40 --speed=1 --output "$TMPDIR/icons.png" icons.png 2>/dev/null || cp icons.png "$TMPDIR/icons.png"
  pngquant --quality=20-40 --speed=1 --output "$TMPDIR/outcasts.png" outcasts.png 2>/dev/null || cp outcasts.png "$TMPDIR/outcasts.png"
  pngquant --quality=20-40 --speed=1 --output "$TMPDIR/exemplars.png" exemplars.png 2>/dev/null || cp exemplars.png "$TMPDIR/exemplars.png"
  pngquant --quality=20-40 --speed=1 --output "$TMPDIR/adventurers.png" adventurers.png 2>/dev/null || cp adventurers.png "$TMPDIR/adventurers.png"
  pngquant --quality=20-40 --speed=1 --output "$TMPDIR/commoners.png" commoners.png 2>/dev/null || cp commoners.png "$TMPDIR/commoners.png"
  magick amaze.png -resize 48x48 "$TMPDIR/amaze_resized.png" 2>/dev/null || convert amaze.png -resize 48x48 "$TMPDIR/amaze_resized.png"
  pngquant --quality=20-40 --speed=1 --output "$TMPDIR/amaze.png" "$TMPDIR/amaze_resized.png" 2>/dev/null || cp "$TMPDIR/amaze_resized.png" "$TMPDIR/amaze.png"
  LORDS_B64=$(base64 < "$TMPDIR/lords.png" | tr -d '\n')
  WARRIORS_B64=$(base64 < "$TMPDIR/warriors.png" | tr -d '\n')
  DEFENDERS_B64=$(base64 < "$TMPDIR/defenders.png" | tr -d '\n')
  VILLAINS_B64=$(base64 < "$TMPDIR/villains.png" | tr -d '\n')
  ICONS_B64=$(base64 < "$TMPDIR/icons.png" | tr -d '\n')
  OUTCASTS_B64=$(base64 < "$TMPDIR/outcasts.png" | tr -d '\n')
  EXEMPLARS_B64=$(base64 < "$TMPDIR/exemplars.png" | tr -d '\n')
  ADVENTURERS_B64=$(base64 < "$TMPDIR/adventurers.png" | tr -d '\n')
  COMMONERS_B64=$(base64 < "$TMPDIR/commoners.png" | tr -d '\n')
  AMAZE_B64=$(base64 < "$TMPDIR/amaze.png" | tr -d '\n')
else
  LORDS_B64=$(base64 < lords.png | tr -d '\n')
  WARRIORS_B64=$(base64 < warriors.png | tr -d '\n')
  DEFENDERS_B64=$(base64 < defenders.png | tr -d '\n')
  VILLAINS_B64=$(base64 < villains.png | tr -d '\n')
  ICONS_B64=$(base64 < icons.png | tr -d '\n')
  OUTCASTS_B64=$(base64 < outcasts.png | tr -d '\n')
  EXEMPLARS_B64=$(base64 < exemplars.png | tr -d '\n')
  ADVENTURERS_B64=$(base64 < adventurers.png | tr -d '\n')
  COMMONERS_B64=$(base64 < commoners.png | tr -d '\n')
  AMAZE_B64=$(base64 < amaze.png | tr -d '\n')
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
JS_MODIFIED=$(echo "$JS" | \
  sed "s|skyhawks.svg|data:image/svg+xml;base64,$SKYHAWKS_B64|g" | \
  sed "s|psiclones.svg|data:image/svg+xml;base64,$PSICLONES_B64|g" | \
  sed "s|melee.svg|data:image/svg+xml;base64,$MELEE_B64|g" | \
  sed "s|lith.svg|data:image/svg+xml;base64,$LITH_B64|g" | \
  sed "s|lords.png|data:image/png;base64,$LORDS_B64|g" | \
  sed "s|warriors.png|data:image/png;base64,$WARRIORS_B64|g" | \
  sed "s|defenders.png|data:image/png;base64,$DEFENDERS_B64|g" | \
  sed "s|villains.png|data:image/png;base64,$VILLAINS_B64|g" | \
  sed "s|icons.png|data:image/png;base64,$ICONS_B64|g" | \
  sed "s|outcasts.png|data:image/png;base64,$OUTCASTS_B64|g" | \
  sed "s|exemplars.png|data:image/png;base64,$EXEMPLARS_B64|g" | \
  sed "s|adventurers.png|data:image/png;base64,$ADVENTURERS_B64|g" | \
  sed "s|commoners.png|data:image/png;base64,$COMMONERS_B64|g" | \
  sed "s|amaze.png|data:image/png;base64,$AMAZE_B64|g")

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
        <div class="setting-row">
          <label for="hide-faction-logos">Hide Faction Logos:</label>
          <input type="checkbox" id="hide-faction-logos">
        </div>
        <div class="setting-row" id="view-map-row">
          <button id="view-map-btn" class="setting-btn">View Map</button>
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

    <div class="map-view" id="map-view">
      <div class="map-header">
        <button class="map-back-btn" id="map-back-btn">← Back</button>
        <h2>Random Map</h2>
        <button class="map-shuffle-btn" id="map-shuffle-btn">Shuffle</button>
      </div>
      <div class="map-container" id="map-container">
        <div class="map-svg-wrapper" id="map-svg-wrapper">
$(cat map-tri.svg | grep -v '<?xml' | grep -v '<!--')
        </div>
      </div>
      <div class="map-legend" id="map-legend"></div>
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

---
phase: plan
source: brainstorm
council: none
created: 2026-03-21T17:38:00
---

# Standalone HTML Build Script Implementation Plan

**Goal:** Create a shell script that bundles the multi-file web scorekeeper into a single portable HTML file with embedded greyscale icons.

**Architecture:** Shell script reads source files, converts PNGs to greyscale via ImageMagick, base64-encodes them, and inlines CSS/JS into a single HTML output.

**Tech Stack:** Bash, ImageMagick (convert), base64, sed

**Tasks:** 3 tasks, estimated 15-20 minutes total.

---

### Task 1: Create Build Script

**Files:**

- Create: `web/build-standalone.sh`

**Step 1: Write the build script**

Create the shell script that:
1. Converts PNGs to greyscale and base64-encodes them
2. Reads CSS and JS files
3. Generates a single HTML file with everything inlined

```bash
#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "Building standalone HTML..."

# Convert PNGs to greyscale and base64
SKYHAWKS_B64=$(convert skyhawks.png -colorspace Gray png:- | base64)
PSICLONES_B64=$(convert psiclones.png -colorspace Gray png:- | base64)

# Read CSS and JS
CSS=$(cat styles.css)
JS=$(cat app.js)

# Update JS to use data URIs for images
JS_MODIFIED=$(echo "$JS" | sed "s|skyhawks.png|data:image/png;base64,$SKYHAWKS_B64|g" | sed "s|psiclones.png|data:image/png;base64,$PSICLONES_B64|g")

# Generate standalone HTML
cat > scorekeeper-standalone.html << HTMLEOF
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Worldspanner</title>
  <style>
$CSS
  </style>
</head>
<body>
  <div class="app">
    <header class="header" id="header">
      <div class="header-clickable" id="header-clickable">
        <img class="team-icon" id="team-icon" src="data:image/png;base64,$SKYHAWKS_B64" alt="Team">
        <span class="phase-name" id="phase-name">Reinforce</span>
        <span class="round-display" id="round-display">1/10</span>
      </div>
      <button class="settings-btn" id="settings-btn">⚙</button>
    </header>

    <main class="grid" id="grid"></main>

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

echo "Created scorekeeper-standalone.html"
ls -lh scorekeeper-standalone.html
```

**Step 2: Make script executable**

Run: `chmod +x web/build-standalone.sh`

**Step 3: Commit**

```bash
git add web/build-standalone.sh
git commit -m "feat(web): add build script for standalone HTML"
```

---

### Task 2: Test Build Script

**Files:**

- Run: `web/build-standalone.sh`
- Verify: `web/scorekeeper-standalone.html`

**Step 1: Run the build script**

Run: `./web/build-standalone.sh`
Expected: Script completes without errors, prints file size

**Step 2: Verify output file exists**

Run: `ls -la web/scorekeeper-standalone.html`
Expected: File exists, size ~80-100KB

**Step 3: Verify HTML structure**

Run: `head -20 web/scorekeeper-standalone.html`
Expected: Valid HTML with inlined `<style>` block

**Step 4: Verify base64 images are embedded**

Run: `grep -c "data:image/png;base64" web/scorekeeper-standalone.html`
Expected: At least 2 matches (skyhawks and psiclones in HTML, plus references in JS)

**Step 5: Manual browser test**

Open `web/scorekeeper-standalone.html` in browser via file:// protocol.
Verify: App loads, icons display (greyscale), all functionality works.

---

### Task 3: Add to .gitignore and Final Commit

**Files:**

- Modify: `.gitignore`

**Step 1: Add standalone output to .gitignore**

The standalone HTML is a build artifact and should not be committed.

Add to `.gitignore`:
```
web/scorekeeper-standalone.html
```

**Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore standalone HTML build artifact"
```

---

## Verification Summary

After all tasks complete:

1. `web/build-standalone.sh` exists and is executable
2. Running the script produces `web/scorekeeper-standalone.html`
3. The standalone file works offline in a browser
4. Icons appear in greyscale
5. Build artifact is gitignored

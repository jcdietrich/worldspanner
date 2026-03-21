---
phase: plan
source: brainstorm
council: src-feature
created: 2026-03-21T19:01:00
---

# Scoreboard Implementation Plan

**Goal:** Add a scoreboard row to the grid showing real-time team scores, and update header to use matching blue-grey background.

**Architecture:** Add CSS variable for blue-grey, update grid to 5 rows, add `calculateScores()` function, render scoreboard in `renderGrid()`.

**Tech Stack:** Vanilla JS, CSS

**Tasks:** 3 tasks, estimated 10-15 minutes total.

---

### Task 1: Add CSS for Scoreboard and Update Header

**Files:**

- Modify: `web/styles.css`

**Step 1: Add blue-grey CSS variable and scoreboard styles**

Add to `:root`:
```css
--bg-blue-grey: #5a6a7a;
```

Update `.header` background:
```css
background: var(--bg-blue-grey);
```

Update `.grid` to 5 rows:
```css
grid-template-rows: repeat(4, 1fr) auto;
```

Add scoreboard cell styles:
```css
.scoreboard-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg-blue-grey);
}

.scoreboard-cell.skyhawks {
  color: var(--text-white);
}

.scoreboard-cell.psiclones {
  color: var(--text-black);
}

.scoreboard-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.scoreboard-name {
  font-size: 0.9rem;
  font-weight: 500;
}

.scoreboard-score {
  font-size: 1.5rem;
  font-weight: 700;
  margin-left: auto;
}
```

**Step 2: Verify CSS compiles**

Open `web/index.html` in browser, verify header is now blue-grey.

**Step 3: Commit**

```bash
git add web/styles.css
git commit -m "feat(web): add scoreboard CSS and update header to blue-grey"
```

---

### Task 2: Add Score Calculation Function

**Files:**

- Modify: `web/app.js`

**Step 1: Add calculateScores function**

Add after `setSlotBackground()`:

```javascript
function calculateScores() {
  let white = 0;
  let black = 0;
  
  for (let i = 0; i < 8; i++) {
    const score = state.scores[i];
    if (i <= 5) {
      // Tug-of-war slots: negative = white, positive = black
      if (score < 0) white++;
      else if (score > 0) black++;
    } else {
      // Underpit toggles: slot 6 = white when active, slot 7 = black when active
      if (score !== 0) {
        if (i === 6) white++;
        else black++;
      }
    }
  }
  
  return { white, black };
}
```

**Step 2: Verify function exists**

No runtime test yet — will verify in Task 3.

**Step 3: Commit**

```bash
git add web/app.js
git commit -m "feat(web): add calculateScores function"
```

---

### Task 3: Render Scoreboard Row

**Files:**

- Modify: `web/app.js`

**Step 1: Update renderGrid to include scoreboard**

At the end of `renderGrid()`, after the slot loop, add:

```javascript
  // Render scoreboard row
  const scores = calculateScores();
  
  const skyhawksCell = document.createElement('div');
  skyhawksCell.className = 'scoreboard-cell skyhawks';
  skyhawksCell.innerHTML = `
    <img class="scoreboard-icon" src="skyhawks.png" alt="Skyhawks">
    <span class="scoreboard-name">Skyhawks</span>
    <span class="scoreboard-score">${scores.white}</span>
  `;
  gridEl.appendChild(skyhawksCell);
  
  const psiclonesCell = document.createElement('div');
  psiclonesCell.className = 'scoreboard-cell psiclones';
  psiclonesCell.innerHTML = `
    <img class="scoreboard-icon" src="psiclones.png" alt="Psiclones">
    <span class="scoreboard-name">Psiclones</span>
    <span class="scoreboard-score">${scores.black}</span>
  `;
  gridEl.appendChild(psiclonesCell);
```

**Step 2: Verify scoreboard renders**

Open `web/index.html` in browser:
- Scoreboard row appears at bottom of grid
- Skyhawks cell shows white text, Psiclones shows black text
- Scores update when tug-of-war buttons are clicked

**Step 3: Rebuild standalone**

```bash
./build-standalone.sh
```

**Step 4: Commit**

```bash
git add web/app.js
git commit -m "feat(web): render scoreboard row with real-time scores"
```

---

## Verification Summary

After all tasks complete:

1. Header background is blue-grey
2. Scoreboard row appears at bottom of grid (row 5)
3. Skyhawks cell: logo, name, score in white text on blue-grey
4. Psiclones cell: logo, name, score in black text on blue-grey
5. Scores update in real-time when slots change
6. Standalone build includes all changes

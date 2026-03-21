# Review Report: Web Scorekeeper

**Date:** 2026-03-21
**Plan:** docs/02-plans/2026-03-21-web-scorekeeper-plan.md
**Diff range:** 54b68809..3eaf7ef5
**Council:** Solo review
**Advisors:** N/A

> **Note:** This is a self-review. The same agent executed Phase 3 and is reviewing its own output. Consider activating a council for independent perspectives.

## Strengths

- **Clean state management** (`web/app.js:39-59`): localStorage persistence with proper error handling and fallback to defaults
- **Round 1 special logic** (`web/app.js:80-101`): Correctly implements W Reinforce → B Reinforce → Round 2 flow matching M5 behavior
- **Responsive design** (`web/styles.css:314-324`): Phone-first with graceful desktop enhancement
- **Delegated event handling** (`web/app.js:356-364`): Grid button clicks use event delegation, avoiding memory leaks from per-element listeners
- **Touch-friendly targets** (`web/styles.css:131`): 44px minimum button width meets accessibility guidelines
- **CSS variables** (`web/styles.css:7-18`): Centralized color definitions for maintainability

## Findings

### Critical (Must Fix — Blocks Merge)

None.

### Important (Should Fix)

#### 1. FIXED_SLOTS constant is unused
- **File:** `web/app.js:19-23`
- **Issue:** `FIXED_SLOTS` array is defined but never referenced
- **Impact:** Dead code adds confusion; suggests incomplete implementation
- **Fix:** Remove the unused constant or use it in `createSlot()` for slots 5-7
- **Source:** Solo review

#### 2. No confirmation on New Game
- **File:** `web/app.js:338-341`
- **Issue:** New Game button immediately resets without confirmation
- **Impact:** Accidental tap could lose game progress
- **Fix:** Add `if (confirm('Start new game? Current progress will be lost.'))` before `resetGame()`
- **Source:** Solo review

#### 3. Modal backdrop click doesn't close modal
- **File:** `web/app.js:264-277`, `web/app.js:284-308`
- **Issue:** Clicking outside modal content doesn't close the modal
- **Impact:** Users expect backdrop click to dismiss; requires finding Cancel/Close button
- **Fix:** Add click handler on `.modal` that closes if `e.target === modal`
- **Source:** Solo review

### Minor (Nice to Have)

#### 4. Keyboard navigation doesn't work when modal is open
- **File:** `web/app.js:373-411`
- **Issue:** Arrow keys and Enter still fire when settings/faction modal is open
- **Impact:** Unexpected behavior; phase could advance while in settings
- **Fix:** Check if any modal is open at start of `handleKeydown()` and return early
- **Source:** Solo review

#### 5. No visual feedback on button press (mobile)
- **File:** `web/styles.css:139-141`
- **Issue:** Only `:active` state defined; no `:hover` for desktop
- **Impact:** Desktop users don't see hover feedback on tug-of-war buttons
- **Fix:** Add `.tow-btn:hover { opacity: 0.5; }` for desktop
- **Source:** Solo review

#### 6. Escape key doesn't close modals
- **File:** `web/app.js:373-411`
- **Issue:** Escape key is not handled
- **Impact:** Standard UX pattern missing
- **Fix:** Add `case 'Escape': closeSettingsModal(); closeFactionModal(); break;`
- **Source:** Solo review

## Advisor Disagreements

N/A — Solo review.

## Recommendations

1. **Add a favicon** — Prevents 404 in browser console
2. **Consider adding PWA manifest** — Would allow "Add to Home Screen" on mobile
3. **Add version number to state** — Future-proofs localStorage migrations

## Verdict

**Merge decision:** Approve with Fixes

**Reasoning:** Implementation matches plan requirements. All core functionality works correctly (phase advancement, scoring, persistence, responsive layout). The Important findings are UX improvements that don't affect core functionality but should be addressed before production use.

**Critical findings:** 0
**Important findings:** 3
**Minor findings:** 3

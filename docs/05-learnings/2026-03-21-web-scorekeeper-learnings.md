---
date: 2026-03-21
cycle-id: web-scorekeeper
tags: [vanilla-js, web-app, local-storage, responsive-design]
summary: Building a vanilla JS web app from an M5 device spec worked smoothly; dead code and missing UX patterns were the main review findings.
council: none
related: []
---

# Learnings: Web Scorekeeper

## What This Cycle Did

Built a standalone web app replicating the M5 Fire scorekeeper functionality, with local storage persistence and responsive phone-first design. Referenced the design doc "Web Scorekeeper Design" for requirements.

## What Went Well

- **Brainstorm-to-plan-to-execute pipeline** produced a clean implementation with minimal rework. The Socratic dialogue in Phase 1 surfaced key decisions (faction dropdowns, tug-of-war buttons, Round 1 special logic) before any code was written.
- **Vanilla JS choice** kept the stack simple. No build step, no dependencies, instant browser testing via `file://` protocol.
- **Event delegation pattern** for grid buttons avoided memory leaks and simplified the render loop -- re-rendering the entire grid on state change was safe because listeners were on the parent.
- **CSS variables** for colors made the slot background logic (neutral/white/black) easy to reason about and maintain.

## What Surprised Us

- **Browser preview proxy interference.** The IDE's browser preview injected its own framework scripts, causing blank pages when serving via `python3 -m http.server`. The app worked fine via `file://` protocol. This was a tooling surprise, not a code issue.
- **Dead code slipped through.** The `FIXED_SLOTS` constant was defined during planning but never used in implementation. Self-review caught it, but a council might have caught it earlier.
- **Command execution outage.** Mid-session, all terminal commands returned exit code 1 with no output for ~10 minutes. This forced batching commits that would otherwise have been atomic per-task.

## What We Would Do Differently

- **Add a "confirm destructive action" pattern to the plan.** The New Game button lacked confirmation -- a common UX oversight. Future plans for apps with reset/delete actions should include this explicitly.
- **Include modal backdrop-close in the CSS/JS template.** This is standard UX that was missing. Consider adding it to any future modal implementation checklist.
- **Test with a local server early.** The `file://` fallback worked, but discovering the proxy issue earlier would have saved debugging time.

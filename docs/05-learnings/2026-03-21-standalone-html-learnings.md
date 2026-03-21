---
date: 2026-03-21
cycle-id: standalone-html
tags: [build-script, shell, base64, pwa, offline-first]
summary: Build scripts benefit from iterative simplification; council configuration should exist before it's needed.
council: none
related: [web-scorekeeper]
---

# Learnings: Standalone HTML Build

## What This Cycle Did

Extended the web scorekeeper with a build script that bundles all assets into a single portable HTML file for offline use. Also added PWA manifest, favicon, and state versioning.

## What Went Well

- **Iterative simplification worked.** Started with ImageMagick greyscale conversion at build time, then pre-generated greyscale PNGs, then replaced color PNGs entirely. Each iteration reduced complexity and dependencies.
- **User-driven refinement.** Quick feedback loops ("just use the PNGs", "rename to worldspanner.html") kept the implementation aligned with actual needs rather than over-engineering.
- **Addressing review recommendations immediately** (favicon, PWA manifest, state versioning) added polish without scope creep — each was a small, focused commit.

## What Surprised Us

- **Council configuration didn't exist.** When `--council=src-feature` was specified, the `.compound-powers/` directory didn't exist. The pipeline proceeded with a solo self-review, but the user expected council participation. Council infrastructure should be set up proactively.
- **macOS vs GNU base64 behavior.** macOS `base64` outputs line breaks by default; GNU does not. This cross-platform difference wasn't obvious until review. `tr -d '\n'` is now standard practice for base64 in shell scripts.
- **User preference for council was implicit.** The user always wants council participation in pipeline phases, but this wasn't captured until explicitly stated. Preferences like this should be surfaced early.

## What We Would Do Differently

- **Set up council configuration at project start.** Don't wait until a review phase fails to find advisors. Create `.compound-powers/councils.yml` and basic advisors when initializing a project.
- **Add cross-platform compatibility checks to shell script templates.** The `tr -d '\n'` pattern for base64 should be default, not a review finding.
- **Capture user preferences proactively.** When a user specifies `--council` once, ask if they want it as a default for all pipeline phases.

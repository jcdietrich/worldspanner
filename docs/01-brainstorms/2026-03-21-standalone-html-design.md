---
date: 2026-03-21
topic: standalone-html
type: design
phase: brainstorm
council: none
---

# Standalone HTML Scorekeeper

## What We're Building

A build script that bundles the multi-file web scorekeeper (`index.html`, `styles.css`, `app.js`, and PNG icons) into a single portable HTML file. The output can be emailed, put on a USB drive, or opened offline without a server.

## Why This Approach

**Considered:**
1. **Manually maintained single file** — simpler but drifts from source
2. **Build artifact from source** — always in sync, single source of truth

Chose option 2. The multi-file version remains the source of truth; the standalone file is generated on demand.

**Image handling:**
- Convert PNGs to greyscale at build time (smaller file size, no runtime CSS filter)
- Embed as base64 data URIs

## Key Decisions

- **Build script:** `web/build-standalone.sh` (shell script, no dependencies beyond ImageMagick for greyscale conversion)
- **Output:** `web/scorekeeper-standalone.html`
- **Greyscale PNGs:** Converted at build time via ImageMagick, then base64-encoded
- **Inlining:** CSS goes into `<style>` tag, JS goes into `<script>` tag, images become data URIs
- **Trigger:** Manual — run the script when a fresh bundle is needed

## Open Questions

None.

## Next Steps

> Run `/cp.plan` to create an implementation plan from this design.

# Motion Designer Showreel — Remotion

A 15-second, 1920×1080 motion-graphics résumé reel built and rendered with **Remotion 4**. Everything is generated from code: the typography, 3D wireframes, shape choreography, data interfaces, transition wipes, HUD/film treatment, and a beat-synced stereo soundtrack.

## Deliverables

- **`output/motion-designer-showreel.mp4`** — the final 15-second showreel
- **`output/showreel-poster.png`** — a still from the finished title card

Verified output: **1920×1080, 30 fps, 450 frames, H.264 video, 48 kHz stereo AAC audio**. The video stream is exactly 15.000 seconds; the MP4 container is 15.019 seconds because of AAC frame padding.

## Timeline

| Time | Chapter | Focus |
| --- | --- | --- |
| 0.0–2.5s | 00 / Open / Impact | Iris assembly, kinetic title, rotating wireframe |
| 2.5–5.0s | 01 / Kinetic Type | Split-glyph typography, stagger, variable weight, ticker |
| 5.0–7.5s | 02 / Spatial Systems | Projected 3D cube, trails, orbit rings, particle field |
| 7.5–10.0s | 03 / Color & Form | Bauhaus shape collision, path morphing, animated star/ribbon |
| 10.0–12.5s | 04 / Data in Motion | Line trace, path-following cursor, gauge, spectrum bars |
| 12.5–15.0s | 05 / End Frame | Six-card montage collapse and final title card |

Scene changes land on the 120 BPM soundtrack's 2.5-second downbeats. Every cut uses a color-keyed diagonal wipe, chromatic number flash, camera impulse, and audio riser/impact.

## Commands

```bash
npm install

# Generate local fonts + procedural WAV soundtrack
npm run assets

# Render the final MP4 and poster into output/
npm run render

# Render representative stills into output/previews/
npm run preview

# Open Remotion Studio for interactive inspection
npm run studio
```

On Linux, `scripts/browser.mjs` extracts the Chromium binary bundled through `@sparticuz/chromium`, sets up its shared libraries, and passes it to Remotion. Set `REMOTION_BROWSER_EXECUTABLE` to use a different Chrome/Chromium binary.

## Source map

- `src/Showreel.jsx` — composition assembly, audio, camera, and global layers
- `src/scenes/` — the six chapters
- `src/components/` — scene chrome, kinetic type, 3D wireframe, global HUD/transitions
- `src/theme.js` — timeline, palette, typography, and animation helpers
- `scripts/generate-audio.mjs` — deterministic 15-second WAV synthesizer
- `scripts/render.mjs` — reproducible Remotion bundle + MP4 render
- `public/fonts/` and `public/audio/` — local assets, prepared by `npm run assets`

Remotion packages used include `@remotion/cli`, `@remotion/bundler`, `@remotion/renderer`, `@remotion/fonts`, `@remotion/paths`, and `@remotion/shapes`.

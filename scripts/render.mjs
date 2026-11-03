import {mkdirSync, statSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {prepareBrowser} from './browser.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_DIR = path.join(ROOT, 'output');
const VIDEO_PATH = path.join(OUTPUT_DIR, 'motion-designer-showreel.mp4');
const POSTER_PATH = path.join(OUTPUT_DIR, 'showreel-poster.png');
const ENTRY_POINT = path.join(ROOT, 'src/index.jsx');
const PUBLIC_DIR = path.join(ROOT, 'public');
const COMPOSITION_ID = 'MotionDesignerShowreel';

await import('./copy-fonts.mjs');
await import('./generate-audio.mjs');

mkdirSync(OUTPUT_DIR, {recursive: true});

const browser = await prepareBrowser();
const concurrency = Math.max(1, Math.min(2, os.cpus().length));

console.log('Bundling Remotion project…');
const serveUrl = await bundle({
  entryPoint: ENTRY_POINT,
  publicDir: PUBLIC_DIR,
  onProgress: (progress) => {
    if (progress === 100) console.log('Bundle ready');
  },
  webpackOverride: (config) => config,
});

console.log(`Using browser: ${browser.browserExecutable ?? 'Remotion-managed Chrome'}`);
const composition = await selectComposition({
  serveUrl,
  id: COMPOSITION_ID,
  ...browser,
});

console.log(
  `Rendering ${composition.durationInFrames} frames at ${composition.width}×${composition.height} / ${composition.fps} fps…`,
);

let lastLoggedPercent = -1;
await renderMedia({
  serveUrl,
  composition,
  codec: 'h264',
  audioCodec: 'aac',
  audioBitrate: '192k',
  crf: 18,
  pixelFormat: 'yuv420p',
  imageFormat: 'jpeg',
  jpegQuality: 94,
  x264Preset: 'medium',
  sampleRate: 48000,
  concurrency,
  overwrite: true,
  enforceAudioTrack: true,
  outputLocation: VIDEO_PATH,
  metadata: {
    title: 'Motion Designer Showreel 2026',
    artist: 'Arena.ai Agent Mode',
    comment: '15-second procedural motion graphics showreel rendered with Remotion',
  },
  logLevel: 'info',
  onProgress: ({progress, renderedFrames, encodedFrames}) => {
    const percent = Math.floor(progress * 100);
    if (percent >= lastLoggedPercent + 5 && percent % 5 === 0) {
      lastLoggedPercent = percent;
      console.log(
        `${String(percent).padStart(3, '%')}%  rendered ${renderedFrames}/${composition.durationInFrames}  encoded ${encodedFrames}`,
      );
    }
  },
  ...browser,
});

await renderStill({
  composition,
  serveUrl,
  output: POSTER_PATH,
  frame: 445,
  overwrite: true,
  ...browser,
});

const size = statSync(VIDEO_PATH).size;
console.log(`\nRendered video: ${VIDEO_PATH} (${(size / 1024 / 1024).toFixed(2)} MB)`);
console.log(`Rendered poster: ${POSTER_PATH}`);

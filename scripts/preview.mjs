import {mkdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {prepareBrowser} from './browser.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_DIR = path.join(ROOT, 'output/previews');
const FRAMES = [20, 45, 75, 100, 130, 180, 225, 260, 300, 340, 375, 420, 445];

await import('./copy-fonts.mjs');
await import('./generate-audio.mjs');

mkdirSync(OUTPUT_DIR, {recursive: true});

const browser = await prepareBrowser();
const serveUrl = await bundle({
  entryPoint: path.join(ROOT, 'src/index.jsx'),
  publicDir: path.join(ROOT, 'public'),
  onProgress: () => {},
  webpackOverride: (config) => config,
});
const composition = await selectComposition({
  serveUrl,
  id: 'MotionDesignerShowreel',
  ...browser,
});

for (const frame of FRAMES) {
  const output = path.join(OUTPUT_DIR, `frame-${String(frame).padStart(3, '0')}.png`);
  await renderStill({composition, serveUrl, output, frame, overwrite: true, ...browser});
  console.log(`Preview ${frame}: ${output}`);
}

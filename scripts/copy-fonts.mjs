import {copyFileSync, mkdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.join(ROOT, 'public/fonts');

mkdirSync(destination, {recursive: true});

const fonts = [
  [
    'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
    'space-grotesk-latin-wght-normal.woff2',
  ],
  [
    'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
    'inter-latin-wght-normal.woff2',
  ],
];

for (const [source, filename] of fonts) {
  copyFileSync(path.join(ROOT, source), path.join(destination, filename));
}

console.log(`Prepared ${fonts.length} variable fonts in public/fonts`);

import {spawn} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {prepareBrowser} from './browser.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = process.env.PORT ?? '3000';
const browser = await prepareBrowser();

const args = [
  'remotion',
  'studio',
  'src/index.jsx',
  '--port',
  PORT,
  '--public-dir',
  'public',
  '--no-open',
  '--ipv4',
  '--chrome-mode',
  'headless-shell',
  '--enable-multiprocess-on-linux',
];

if (browser.browserExecutable) {
  args.push('--browser-executable', browser.browserExecutable);
}

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const child = spawn(command, args, {
  cwd: ROOT,
  env: process.env,
  stdio: 'inherit',
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal));
}

child.on('exit', (code) => process.exit(code ?? 0));

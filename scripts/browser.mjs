import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export async function prepareBrowser() {
  const shared = {
    chromiumOptions: {enableMultiProcessOnLinux: true},
    chromeMode: 'headless-shell',
  };

  if (process.env.REMOTION_BROWSER_EXECUTABLE) {
    return {
      ...shared,
      browserExecutable: process.env.REMOTION_BROWSER_EXECUTABLE,
    };
  }

  if (process.platform !== 'linux') {
    // On macOS/Windows, let Remotion use its own Chrome Headless Shell.
    return {...shared, browserExecutable: null};
  }

  const chromiumModule = await import('@sparticuz/chromium');
  const chromium = chromiumModule.default;
  const {inflate} = chromiumModule;

  process.env.FONTCONFIG_PATH ??= '/tmp/fonts';
  process.env.HOME ??= '/tmp';

  const browserExecutable = await chromium.executablePath();
  await inflate(path.join(ROOT, 'node_modules/@sparticuz/chromium/bin/al2023.tar.br'));

  const bundledLibs = '/tmp/al2023/lib';
  process.env.LD_LIBRARY_PATH = [bundledLibs, process.env.LD_LIBRARY_PATH]
    .filter(Boolean)
    .join(':');

  return {...shared, browserExecutable};
}

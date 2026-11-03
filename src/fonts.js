import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// loadFont() uses Remotion's delayRender() internally, so every rendered frame
// waits for both variable fonts before capture.
loadFont({
  family: 'Space Grotesk Variable',
  url: staticFile('fonts/space-grotesk-latin-wght-normal.woff2'),
  weight: '300 700',
  style: 'normal',
  display: 'block',
  format: 'woff2',
});

loadFont({
  family: 'Inter Variable',
  url: staticFile('fonts/inter-latin-wght-normal.woff2'),
  weight: '100 900',
  style: 'normal',
  display: 'block',
  format: 'woff2',
});

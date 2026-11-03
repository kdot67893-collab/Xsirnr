import {Easing, interpolate, spring} from 'remotion';

export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 30;
export const DURATION_IN_FRAMES = 15 * FPS;
export const SCENE_LENGTH = 75;
export const BEAT_LENGTH = 15;
export const SCENE_STARTS = [0, 75, 150, 225, 300, 375];
export const TRANSITION_STARTS = [75, 150, 225, 300, 375];

export const FONT_DISPLAY = '"Space Grotesk Variable", "Arial Black", sans-serif';
export const FONT_TEXT = '"Inter Variable", Arial, sans-serif';
export const FONT_MONO = '"DejaVu Sans Mono", "SFMono-Regular", Consolas, monospace';

export const COLORS = {
  ink: '#05070D',
  ink2: '#090D18',
  paper: '#F3F5EF',
  muted: '#8A94A6',
  cyan: '#55F2FF',
  coral: '#FF3D71',
  lime: '#D9FF43',
  violet: '#9671FF',
  orange: '#FF8A3D',
  blue: '#3577FF',
};

export const SCENES = [
  {
    number: '00',
    name: 'OPEN / IMPACT',
    title: 'MOTION DESIGNER',
    subtitle: 'SHOWREEL — 2026',
    accent: COLORS.cyan,
    secondary: COLORS.coral,
    bg: '#050812',
  },
  {
    number: '01',
    name: 'KINETIC TYPE',
    title: 'TYPE IN MOTION',
    subtitle: 'RHYTHM · TIMING · WEIGHT',
    accent: COLORS.coral,
    secondary: COLORS.cyan,
    bg: '#100811',
  },
  {
    number: '02',
    name: 'SPATIAL SYSTEMS',
    title: 'DEPTH / ORBIT',
    subtitle: 'PERSPECTIVE · STRUCTURE · TRAILS',
    accent: COLORS.violet,
    secondary: COLORS.cyan,
    bg: '#08091B',
  },
  {
    number: '03',
    name: 'COLOR & FORM',
    title: 'FORM FOLLOWS MOTION',
    subtitle: 'SHAPE · COLOR · COLLISION',
    accent: COLORS.lime,
    secondary: COLORS.orange,
    bg: '#101007',
  },
  {
    number: '04',
    name: 'DATA IN MOTION',
    title: 'SIGNAL BECOMES STORY',
    subtitle: 'INTERFACES · CHARTS · CLARITY',
    accent: COLORS.cyan,
    secondary: COLORS.lime,
    bg: '#04101A',
  },
  {
    number: '05',
    name: 'END FRAME',
    title: "LET'S MAKE IT MOVE",
    subtitle: 'MOTION DESIGN / DIRECTION / SYSTEMS',
    accent: COLORS.paper,
    secondary: COLORS.cyan,
    bg: '#07090C',
  },
];

export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export const lerp = (a, b, t) => a + (b - a) * t;

export const hexAlpha = (hex, alpha) => {
  const amount = Math.round(clamp(alpha) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${amount}`;
};

export const sceneAt = (frame) =>
  Math.min(SCENES.length - 1, Math.floor(clamp(frame, 0, DURATION_IN_FRAMES - 1) / SCENE_LENGTH));

export const easeOut = (value) => Easing.out(Easing.cubic)(clamp(value));
export const easeInOut = (value) => Easing.inOut(Easing.cubic)(clamp(value));

export const enter = (frame, delay = 0, fps = FPS, config = {}) => {
  const local = Math.max(0, frame - delay);
  return spring({
    frame: local,
    fps,
    config: {damping: 14, stiffness: 125, mass: 0.72, ...config},
  });
};

export const pulse = (frame, period = BEAT_LENGTH, sharpness = 0.48) => {
  const phase = frame % period;
  return Math.exp(-phase * sharpness);
};

export const transitionPulse = (frame, center, halfWidth = 8) =>
  1 - clamp(Math.abs(frame - center) / halfWidth);

export const fadeEdges = (frame, duration = SCENE_LENGTH, inFrames = 7, outFrames = 7) => {
  return Math.min(
    interpolate(frame, [0, inFrames], [0, 1], {extrapolateRight: 'clamp'}),
    interpolate(frame, [duration - outFrames, duration], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
};

export const deterministic = (seed) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

export const timecode = (frame, fps = FPS) => {
  const totalSeconds = Math.floor(frame / fps);
  const frames = frame % fps;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return [minutes, seconds, frames].map((v) => String(v).padStart(2, '0')).join(':');
};

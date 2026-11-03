import {mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = path.join(ROOT, 'public/audio/showreel.wav');
const SAMPLE_RATE = 48000;
const DURATION = 15;
const SAMPLE_COUNT = SAMPLE_RATE * DURATION;
const TAU = Math.PI * 2;

const left = new Float32Array(SAMPLE_COUNT);
const right = new Float32Array(SAMPLE_COUNT);

const midiToFrequency = (midi) => 440 * Math.pow(2, (midi - 69) / 12);
const noise = (n) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453123;
  return (x - Math.floor(x)) * 2 - 1;
};
const clampIndex = (index) => index >= 0 && index < SAMPLE_COUNT;

const addStereo = (index, l, r) => {
  if (!clampIndex(index)) return;
  left[index] += l;
  right[index] += r;
};

const addKick = (start, gain = 0.85) => {
  const first = Math.floor(start * SAMPLE_RATE);
  const length = Math.floor(0.28 * SAMPLE_RATE);
  let phase = 0;
  for (let j = 0; j < length; j += 1) {
    const t = j / SAMPLE_RATE;
    const frequency = 46 + 118 * Math.exp(-t * 27);
    phase += (TAU * frequency) / SAMPLE_RATE;
    const envelope = Math.exp(-t * 17);
    const click = noise(first + j) * Math.exp(-t * 95) * 0.32;
    const sample = (Math.sin(phase) * envelope + click) * gain;
    addStereo(first + j, sample, sample);
  }
};

const addNoiseHit = (start, duration, gain, decay, pan = 0.5, highpass = 0.45, seed = 0) => {
  const first = Math.floor(start * SAMPLE_RATE);
  const length = Math.floor(duration * SAMPLE_RATE);
  let lowpass = 0;
  for (let j = 0; j < length; j += 1) {
    const t = j / SAMPLE_RATE;
    const white = noise(first + j + seed);
    lowpass += (white - lowpass) * highpass;
    const filtered = white - lowpass;
    const envelope = Math.exp(-t * decay);
    const sample = filtered * envelope * gain;
    addStereo(first + j, sample * (1 - pan * 0.55), sample * (0.45 + pan * 0.55));
  }
};

const addClap = (start, pan = 0.5) => {
  addNoiseHit(start, 0.17, 0.24, 24, pan, 0.48, 71);
  addNoiseHit(start + 0.011, 0.13, 0.18, 30, 1 - pan, 0.52, 137);
  addNoiseHit(start + 0.024, 0.1, 0.13, 36, pan, 0.56, 211);
};

const addHat = (start, gain = 0.07, pan = 0.5) => {
  addNoiseHit(start, 0.055, gain, 70, pan, 0.78, 331);
};

const addBass = (start, duration, midi, gain = 0.24) => {
  const first = Math.floor(start * SAMPLE_RATE);
  const length = Math.floor(duration * SAMPLE_RATE);
  const frequency = midiToFrequency(midi);
  let phase = 0;
  for (let j = 0; j < length; j += 1) {
    const t = j / SAMPLE_RATE;
    phase += (TAU * frequency) / SAMPLE_RATE;
    const attack = Math.min(1, t / 0.012);
    const envelope = attack * Math.exp(-t * 2.6);
    const saw = 2 * ((frequency * t) % 1) - 1;
    const sample = (Math.sin(phase) + saw * 0.14) * envelope * gain;
    addStereo(first + j, sample * 0.92, sample * 0.92);
  }
};

const addPluck = (start, midi, gain = 0.12, pan = 0.5) => {
  const first = Math.floor(start * SAMPLE_RATE);
  const length = Math.floor(0.24 * SAMPLE_RATE);
  const frequency = midiToFrequency(midi);
  for (let j = 0; j < length; j += 1) {
    const t = j / SAMPLE_RATE;
    const envelope = Math.min(1, t / 0.004) * Math.exp(-t * 11);
    const vibrato = 1 + Math.sin(TAU * 5.2 * t) * 0.003;
    const wave =
      Math.sin(TAU * frequency * vibrato * t) +
      0.34 * Math.sin(TAU * frequency * 2 * t) +
      0.13 * Math.sin(TAU * frequency * 3 * t);
    const sample = wave * envelope * gain;
    addStereo(
      first + j,
      sample * (1 - pan * 0.7),
      sample * (0.3 + pan * 0.7),
    );
  }
};

const addPad = (start, duration, chord, gain = 0.035) => {
  const first = Math.floor(start * SAMPLE_RATE);
  const length = Math.floor(duration * SAMPLE_RATE);
  const phases = chord.map(() => 0);
  for (let j = 0; j < length; j += 1) {
    const t = j / SAMPLE_RATE;
    const attack = Math.min(1, t / 0.35);
    const release = Math.min(1, (duration - t) / 0.5);
    const envelope = attack * release;
    let l = 0;
    let r = 0;
    for (let k = 0; k < chord.length; k += 1) {
      const detune = k % 2 === 0 ? 0.997 : 1.003;
      const frequency = midiToFrequency(chord[k]) * detune;
      phases[k] += (TAU * frequency) / SAMPLE_RATE;
      const tone = Math.sin(phases[k]) * envelope * gain;
      l += tone * (0.55 + k * 0.06);
      r += tone * (0.95 - k * 0.06);
    }
    addStereo(first + j, l, r);
  }
};

const addRiser = (start, duration, gain = 0.16) => {
  const first = Math.floor(start * SAMPLE_RATE);
  const length = Math.floor(duration * SAMPLE_RATE);
  let lowpass = 0;
  let phase = 0;
  for (let j = 0; j < length; j += 1) {
    const t = j / SAMPLE_RATE;
    const progress = t / duration;
    const white = noise(first + j + 991);
    lowpass += (white - lowpass) * (0.12 + progress * 0.62);
    const filtered = white - lowpass;
    const frequency = 180 + progress * 1250;
    phase += (TAU * frequency) / SAMPLE_RATE;
    const envelope = Math.pow(progress, 1.8);
    const sample = (filtered * 0.9 + Math.sin(phase) * 0.12) * envelope * gain;
    addStereo(first + j, sample * (0.7 + progress * 0.3), sample * (1 - progress * 0.3));
  }
};

// Six scene-specific chords: Am7, Fmaj7, Cmaj7, G6, Dm7, Eadd9.
const CHORDS = [
  [57, 60, 64, 67],
  [53, 57, 60, 64],
  [48, 52, 55, 59],
  [55, 59, 62, 64],
  [50, 53, 57, 60],
  [52, 56, 59, 66],
];

for (let scene = 0; scene < CHORDS.length; scene += 1) {
  const sceneStart = scene * 2.5;
  const chord = CHORDS[scene];
  addPad(sceneStart, 2.5, chord, 0.032 + scene * 0.0015);

  for (let step = 0; step < 5; step += 1) {
    const time = sceneStart + step * 0.5;
    addBass(time, 0.46, chord[0] - 24 + (step % 2 === 0 ? 0 : 7), 0.22);
  }

  for (let step = 0; step < 10; step += 1) {
    const time = sceneStart + step * 0.25;
    const note = chord[(step + scene) % chord.length] + (step % 4 === 3 ? 24 : 12);
    addPluck(time, note, step % 4 === 0 ? 0.115 : 0.075, (step % 3) / 2);
  }
}

for (let beat = 0; beat < 30; beat += 1) {
  const time = beat * 0.5;
  addKick(time, beat % 5 === 0 ? 1.02 : 0.78);
  if (beat % 4 === 1 || beat % 4 === 3) {
    addClap(time, beat % 8 < 4 ? 0.3 : 0.7);
  }
}

for (let sixteenth = 0; sixteenth < 60; sixteenth += 1) {
  addHat(sixteenth * 0.25, sixteenth % 4 === 0 ? 0.055 : 0.085, (sixteenth % 5) / 4);
}

for (let boundary = 1; boundary < 6; boundary += 1) {
  const time = boundary * 2.5;
  addRiser(time - 0.72, 0.72, 0.15 + boundary * 0.008);
  addNoiseHit(time, 0.55, 0.16, 7, 0.5, 0.18, 1200 + boundary * 73);
  addKick(time, 1.12);
}
addNoiseHit(0, 0.65, 0.13, 6, 0.5, 0.16, 1701);

// Short, deterministic stereo delay for space, then soft clipping.
const delayA = Math.floor(0.187 * SAMPLE_RATE);
const delayB = Math.floor(0.371 * SAMPLE_RATE);
const outL = new Float32Array(SAMPLE_COUNT);
const outR = new Float32Array(SAMPLE_COUNT);
let peak = 0;

for (let i = 0; i < SAMPLE_COUNT; i += 1) {
  let l = left[i];
  let r = right[i];
  if (i >= delayA) {
    l += right[i - delayA] * 0.16;
    r += left[i - delayA] * 0.13;
  }
  if (i >= delayB) {
    l += right[i - delayB] * 0.075;
    r += left[i - delayB] * 0.085;
  }
  outL[i] = Math.tanh(l * 1.25);
  outR[i] = Math.tanh(r * 1.25);
  peak = Math.max(peak, Math.abs(outL[i]), Math.abs(outR[i]));
}

const normalization = 0.88 / Math.max(peak, 0.001);
const buffer = Buffer.alloc(44 + SAMPLE_COUNT * 4);
buffer.write('RIFF', 0, 'ascii');
buffer.writeUInt32LE(36 + SAMPLE_COUNT * 4, 4);
buffer.write('WAVE', 8, 'ascii');
buffer.write('fmt ', 12, 'ascii');
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(2, 22);
buffer.writeUInt32LE(SAMPLE_RATE, 24);
buffer.writeUInt32LE(SAMPLE_RATE * 4, 28);
buffer.writeUInt16LE(4, 32);
buffer.writeUInt16LE(16, 34);
buffer.write('data', 36, 'ascii');
buffer.writeUInt32LE(SAMPLE_COUNT * 4, 40);

let sumSquares = 0;
for (let i = 0; i < SAMPLE_COUNT; i += 1) {
  const t = i / SAMPLE_RATE;
  const fadeIn = Math.min(1, t / 0.045);
  const fadeOut = Math.min(1, Math.max(0, (DURATION - t) / 0.55));
  const fade = fadeIn * fadeOut;
  const l = outL[i] * normalization * fade;
  const r = outR[i] * normalization * fade;
  const li = Math.max(-32767, Math.min(32767, Math.round(l * 32767)));
  const ri = Math.max(-32767, Math.min(32767, Math.round(r * 32767)));
  buffer.writeInt16LE(li, 44 + i * 4);
  buffer.writeInt16LE(ri, 46 + i * 4);
  sumSquares += l * l + r * r;
}

mkdirSync(path.dirname(OUTPUT), {recursive: true});
writeFileSync(OUTPUT, buffer);
const rms = Math.sqrt(sumSquares / (SAMPLE_COUNT * 2));
console.log(`Generated ${DURATION}s stereo soundtrack: ${OUTPUT} (${(buffer.length / 1024 / 1024).toFixed(2)} MB, RMS ${rms.toFixed(3)})`);

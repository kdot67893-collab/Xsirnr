import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SceneFrame} from '../components/SceneFrame';
import {WireCube} from '../components/WireCube';
import {
  COLORS,
  FONT_DISPLAY,
  FONT_MONO,
  FONT_TEXT,
  SCENES,
  clamp,
  deterministic,
  hexAlpha,
} from '../theme';

const FloorGrid = ({frame, accent}) => (
  <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
    <g opacity="0.35">
      {Array.from({length: 19}).map((_, i) => {
        const bottomX = -80 + i * 116;
        return (
          <line
            key={`v-${i}`}
            x1={960}
            y1={615}
            x2={bottomX}
            y2={1080}
            stroke={hexAlpha(accent, 0.13)}
            strokeWidth="1"
          />
        );
      })}
      {Array.from({length: 13}).map((_, i) => {
        const base = 620 + Math.pow(i / 12, 1.8) * 460;
        const y = base + ((frame * 2.2) % 34) * (i / 12);
        return (
          <line
            key={`h-${i}`}
            x1={0}
            y1={y}
            x2={1920}
            y2={y}
            stroke={hexAlpha(accent, 0.1 + i * 0.012)}
            strokeWidth="1"
          />
        );
      })}
    </g>
  </svg>
);

const OrbitParticles = ({frame, accent, secondary}) => (
  <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
    {Array.from({length: 78}).map((_, i) => {
      const seedA = deterministic(i + 1);
      const seedB = deterministic(i + 91);
      const radius = 210 + seedA * 470;
      const angle = seedB * Math.PI * 2 + frame * (0.005 + (i % 4) * 0.0018);
      const z = Math.sin(angle * 2 + i) * radius * 0.23;
      const x = 960 + Math.cos(angle) * radius * 0.92;
      const y = 490 + Math.sin(angle) * radius * 0.34 + z * 0.22;
      const depth = clamp((z + 130) / 260);
      const r = 1.2 + depth * 3.4;
      return (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={r}
          fill={i % 5 === 0 ? secondary : accent}
          opacity={0.14 + depth * 0.7}
        />
      );
    })}
  </svg>
);

const OrbitRings = ({frame, accent, secondary}) => (
  <svg viewBox="0 0 1200 900" width="1200" height="900" style={{position: 'absolute', left: 360, top: 50, overflow: 'visible'}}>
    {[
      {rx: 470, ry: 165, rotate: -18, color: accent, speed: 1.2},
      {rx: 390, ry: 250, rotate: 32, color: secondary, speed: -0.8},
      {rx: 530, ry: 105, rotate: 8, color: COLORS.paper, speed: 0.5},
    ].map((ring, i) => (
      <ellipse
        key={i}
        cx="600"
        cy="440"
        rx={ring.rx}
        ry={ring.ry}
        fill="none"
        stroke={hexAlpha(ring.color, i === 2 ? 0.16 : 0.46)}
        strokeWidth={i === 0 ? 3 : 1.5}
        strokeDasharray={i === 0 ? '12 16' : i === 1 ? '3 12' : '1 9'}
        strokeDashoffset={frame * ring.speed}
        transform={`rotate(${ring.rotate + Math.sin(frame * 0.015 + i) * 5} 600 440)`}
      />
    ))}
  </svg>
);

export const SpatialScene = () => {
  const frame = useCurrentFrame();
  const scene = SCENES[2];
  const cubeScale = interpolate(frame, [0, 22, 62, 75], [0.72, 1, 1.06, 1.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cubeRotate = frame * 0.18;
  const orbitA = frame * 0.035;
  const x = Math.sin(frame * 0.071) * 0.84;
  const y = Math.cos(frame * 0.052) * 0.61;
  const z = Math.sin(frame * 0.039 + 1.2) * 1.18;

  return (
    <SceneFrame scene={scene}>
      <FloorGrid frame={frame} accent={scene.accent} />
      <OrbitParticles frame={frame} accent={scene.accent} secondary={scene.secondary} />
      <OrbitRings frame={frame} accent={scene.accent} secondary={scene.secondary} />

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 800,
          height: 800,
          transform: `translate(-50%, -50%) scale(${cubeScale}) rotate(${cubeRotate}deg)`,
        }}
      >
        <WireCube
          frame={frame * 1.75 + 18}
          size={205}
          color={scene.accent}
          secondary={scene.secondary}
          trails={5}
          strokeWidth={3.4}
        />
      </div>

      {[0, 1, 2].map((i) => {
        const angle = orbitA + (i / 3) * Math.PI * 2;
        const left = 960 + Math.cos(angle) * (470 + i * 30);
        const top = 500 + Math.sin(angle) * (150 + i * 24);
        const scale = 0.2 + i * 0.025;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left,
              top,
              width: 800,
              height: 800,
              marginLeft: -400,
              marginTop: -400,
              transform: `scale(${scale})`,
              opacity: 0.36 + i * 0.1,
            }}
          >
            <WireCube
              frame={frame * 1.3 + i * 70}
              size={180}
              color={i === 1 ? scene.secondary : scene.accent}
              secondary={scene.accent}
              trails={1}
              strokeWidth={5}
            />
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          right: 130,
          top: 205,
          width: 270,
          padding: '20px 22px',
          border: `1px solid ${hexAlpha(scene.accent, 0.32)}`,
          backgroundColor: hexAlpha(COLORS.ink, 0.55),
          fontFamily: FONT_MONO,
          fontSize: 12,
          letterSpacing: 2,
          color: hexAlpha(COLORS.paper, 0.65),
          lineHeight: 2,
        }}
      >
        <div style={{color: scene.accent, marginBottom: 8}}>PROJECTED / 3D</div>
        <div>X {x >= 0 ? '+' : ''}{x.toFixed(2)}</div>
        <div>Y {y >= 0 ? '+' : ''}{y.toFixed(2)}</div>
        <div>Z {z >= 0 ? '+' : ''}{z.toFixed(2)}</div>
        <div style={{marginTop: 10, opacity: 0.5}}>ROT {String(Math.round(frame * 1.75) % 360).padStart(3, '0')}°</div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 118,
          top: 260,
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          fontFamily: FONT_DISPLAY,
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: 8,
          color: hexAlpha(COLORS.paper, 0.32),
        }}
      >
        PERSPECTIVE · DEPTH · TRAILS
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          bottom: 250,
          display: 'flex',
          gap: 14,
          alignItems: 'center',
          fontFamily: FONT_TEXT,
          fontSize: 13,
          letterSpacing: 5,
          color: hexAlpha(COLORS.paper, 0.5),
        }}
      >
        <span style={{width: 40, height: 1, backgroundColor: scene.secondary}} />
        WIREFRAME SYSTEM / 08 VERTICES / 12 EDGES
      </div>
    </SceneFrame>
  );
};

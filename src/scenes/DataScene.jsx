import React from 'react';
import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneFrame} from '../components/SceneFrame';
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

const CHART_PATH =
  'M 60 350 L 150 310 L 240 332 L 330 224 L 420 262 L 510 170 L 600 205 L 690 128 L 780 172 L 870 92 L 960 132 L 1050 55';
const CHART_LENGTH = getLength(CHART_PATH);

const Panel = ({frame, fps, delay, x, y, width, height, accent, title, children}) => {
  const p = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: {damping: 15, stiffness: 110, mass: 0.75},
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        padding: 20,
        boxSizing: 'border-box',
        backgroundColor: hexAlpha(COLORS.ink, 0.68),
        border: `1px solid ${hexAlpha(accent, 0.28)}`,
        boxShadow: `0 18px 60px ${hexAlpha(COLORS.ink, 0.5)}, inset 0 0 40px ${hexAlpha(accent, 0.035)}`,
        opacity: p,
        transform: `translateY(${(1 - p) * 34}px) scale(${0.96 + p * 0.04})`,
        transformOrigin: 'top left',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: FONT_MONO,
          fontSize: 11,
          letterSpacing: 3,
          color: hexAlpha(COLORS.paper, 0.55),
          marginBottom: 14,
        }}
      >
        <span style={{color: accent}}>{title}</span>
        <span>LIVE / 60HZ</span>
      </div>
      {children}
    </div>
  );
};

const SignalNetwork = ({frame, accent}) => (
  <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{position: 'absolute', inset: 0, opacity: 0.38}}>
    {Array.from({length: 22}).map((_, i) => {
      const x = 90 + deterministic(i + 200) * 1740;
      const y = 120 + deterministic(i + 400) * 820 + Math.sin(frame * 0.02 + i) * 8;
      const nextX = 90 + deterministic(i + 201) * 1740;
      const nextY = 120 + deterministic(i + 401) * 820 + Math.sin(frame * 0.02 + i + 1) * 8;
      return (
        <g key={i}>
          {i > 0 && (
            <line
              x1={x}
              y1={y}
              x2={nextX}
              y2={nextY}
              stroke={hexAlpha(accent, 0.08)}
              strokeWidth="1"
            />
          )}
          <circle cx={x} cy={y} r={i % 4 === 0 ? 4 : 2} fill={hexAlpha(accent, 0.5)} />
        </g>
      );
    })}
  </svg>
);

export const DataScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scene = SCENES[4];
  const lineReveal = evolvePath(clamp(frame / 42), CHART_PATH);
  const cursorProgress = clamp(frame / 48) * 0.999;
  const cursor = getPointAtLength(CHART_PATH, CHART_LENGTH * cursorProgress) ?? {x: 60, y: 350};
  const metric = interpolate(frame, [8, 60], [12.8, 98.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const gaugeProgress = interpolate(frame, [10, 58], [0, 0.86], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const circumference = 2 * Math.PI * 68;

  return (
    <SceneFrame scene={scene}>
      <SignalNetwork frame={frame} accent={scene.accent} />

      <div
        style={{
          position: 'absolute',
          left: 150,
          top: 155,
          display: 'flex',
          gap: 16,
          fontFamily: FONT_MONO,
          fontSize: 11,
          letterSpacing: 3,
          color: hexAlpha(COLORS.paper, 0.55),
        }}
      >
        {[
          ['SIGNAL', '01'],
          ['MOTION', '02'],
          ['CLARITY', '03'],
          ['OUTPUT', '04'],
        ].map(([label, number], i) => (
          <div
            key={label}
            style={{
              padding: '10px 14px',
              border: `1px solid ${hexAlpha(i === 1 ? scene.secondary : scene.accent, 0.3)}`,
              backgroundColor: hexAlpha(COLORS.ink, 0.55),
            }}
          >
            <span style={{color: i === 1 ? scene.secondary : scene.accent}}>{number}</span> / {label}
          </div>
        ))}
      </div>

      <Panel frame={frame} fps={fps} delay={2} x={150} y={240} width={1110} height={500} accent={scene.accent} title="SIGNAL / 12 POINT TRACE">
        <svg viewBox="0 0 1070 420" width="100%" height="420" style={{overflow: 'visible'}}>
          {Array.from({length: 6}).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="40"
              y1={40 + i * 68}
              x2="1060"
              y2={40 + i * 68}
              stroke={hexAlpha(COLORS.paper, 0.08)}
              strokeWidth="1"
            />
          ))}
          {Array.from({length: 12}).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={60 + i * 90}
              y1="20"
              x2={60 + i * 90}
              y2="380"
              stroke={hexAlpha(COLORS.paper, 0.06)}
              strokeWidth="1"
            />
          ))}
          <path
            d={CHART_PATH}
            fill="none"
            stroke={hexAlpha(scene.accent, 0.16)}
            strokeWidth="20"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={lineReveal.strokeDasharray}
            strokeDashoffset={lineReveal.strokeDashoffset}
          />
          <path
            d={CHART_PATH}
            fill="none"
            stroke={scene.accent}
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={lineReveal.strokeDasharray}
            strokeDashoffset={lineReveal.strokeDashoffset}
          />
          <line
            x1={cursor.x}
            y1={cursor.y}
            x2={cursor.x}
            y2="380"
            stroke={hexAlpha(scene.secondary, 0.55)}
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <line
            x1="40"
            y1={cursor.y}
            x2={cursor.x}
            y2={cursor.y}
            stroke={hexAlpha(scene.secondary, 0.35)}
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <circle cx={cursor.x} cy={cursor.y} r="15" fill={hexAlpha(scene.secondary, 0.18)} />
          <circle cx={cursor.x} cy={cursor.y} r="6" fill={COLORS.paper} stroke={scene.secondary} strokeWidth="3" />
          <text
            x={cursor.x + 16}
            y={cursor.y - 16}
            fill={COLORS.paper}
            fontFamily={FONT_MONO}
            fontSize="12"
            letterSpacing="2"
          >
            {metric.toFixed(1)}
          </text>
          {[0, 1, 2, 3, 4].map((i) => (
            <text
              key={i}
              x="8"
              y={44 + i * 68}
              fill={hexAlpha(COLORS.paper, 0.35)}
              fontFamily={FONT_MONO}
              fontSize="10"
            >
              {String(100 - i * 20).padStart(3, '0')}
            </text>
          ))}
        </svg>
      </Panel>

      <Panel frame={frame} fps={fps} delay={8} x={1300} y={240} width={470} height={220} accent={scene.secondary} title="SYSTEM / EFFICIENCY">
        <div style={{position: 'relative', width: 190, height: 160, margin: '-4px auto 0'}}>
          <svg viewBox="0 0 200 200" width="190" height="190" style={{position: 'absolute', left: 0, top: -12}}>
            <circle cx="100" cy="100" r="68" fill="none" stroke={hexAlpha(COLORS.paper, 0.1)} strokeWidth="14" />
            <circle
              cx="100"
              cy="100"
              r="68"
              fill="none"
              stroke={scene.secondary}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${circumference * gaugeProgress} ${circumference}`}
              transform="rotate(-90 100 100)"
            />
            <circle cx="100" cy="100" r="48" fill="none" stroke={hexAlpha(scene.accent, 0.22)} strokeWidth="1" strokeDasharray="3 7" />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT_DISPLAY,
              fontSize: 44,
              fontWeight: 700,
              color: COLORS.paper,
            }}
          >
            {Math.round(gaugeProgress * 100)}%
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 24,
            bottom: 22,
            fontFamily: FONT_MONO,
            fontSize: 10,
            letterSpacing: 2,
            color: hexAlpha(COLORS.paper, 0.45),
            textAlign: 'right',
            lineHeight: 1.8,
          }}
        >
          FRAME LOCK<br />Δ 0.016 MS
        </div>
      </Panel>

      <Panel frame={frame} fps={fps} delay={12} x={1300} y={490} width={470} height={250} accent={scene.accent} title="SPECTRUM / 14 CHANNELS">
        <div
          style={{
            height: 160,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 9,
            padding: '0 8px',
            borderBottom: `1px solid ${hexAlpha(COLORS.paper, 0.18)}`,
          }}
        >
          {Array.from({length: 14}).map((_, i) => {
            const p = spring({
              frame: Math.max(0, frame - 16 - i * 1.4),
              fps,
              config: {damping: 13, stiffness: 125, mass: 0.6},
            });
            const base = 26 + deterministic(i + 600) * 118;
            const wobble = Math.sin(frame * 0.12 + i * 0.9) * 8;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: Math.max(3, (base + wobble) * p),
                  backgroundColor: i % 4 === 0 ? scene.secondary : scene.accent,
                  opacity: 0.52 + deterministic(i + 700) * 0.48,
                  boxShadow: `0 0 16px ${hexAlpha(i % 4 === 0 ? scene.secondary : scene.accent, 0.22)}`,
                }}
              />
            );
          })}
        </div>
      </Panel>

      <div
        style={{
          position: 'absolute',
          left: 150,
          bottom: 245,
          fontFamily: FONT_TEXT,
          fontSize: 12,
          letterSpacing: 4,
          color: hexAlpha(COLORS.paper, 0.45),
        }}
      >
        DATA DOESN'T BORE — IT CHOREOGRAPHS
      </div>
    </SceneFrame>
  );
};

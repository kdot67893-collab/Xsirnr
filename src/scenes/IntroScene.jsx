import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneFrame} from '../components/SceneFrame';
import {KineticLine} from '../components/KineticText';
import {WireCube} from '../components/WireCube';
import {COLORS, FONT_DISPLAY, FONT_MONO, FONT_TEXT, SCENES, hexAlpha} from '../theme';

const Rings = ({frame, fps, accent, secondary}) => (
  <svg viewBox="0 0 1200 1200" width="1200" height="1200" style={{overflow: 'visible'}}>
    {Array.from({length: 12}).map((_, i) => {
      const p = spring({
        frame: Math.max(0, frame - 2 - i * 1.1),
        fps,
        config: {damping: 16, stiffness: 90, mass: 0.8},
      });
      const radius = 110 + i * 42;
      const circumference = 2 * Math.PI * radius;
      return (
        <circle
          key={i}
          cx="600"
          cy="600"
          r={radius}
          fill="none"
          stroke={i % 3 === 0 ? secondary : accent}
          strokeWidth={i % 3 === 0 ? 2.5 : 1}
          opacity={0.1 + p * 0.2}
          strokeDasharray={`${circumference * p} ${circumference}`}
          strokeDashoffset={-frame * (i % 2 === 0 ? 0.8 : -0.8)}
          transform={`rotate(${frame * (i % 2 === 0 ? 0.13 : -0.09)} 600 600)`}
        />
      );
    })}
    {Array.from({length: 36}).map((_, i) => {
      const p = spring({
        frame: Math.max(0, frame - 8 - i * 0.35),
        fps,
        config: {damping: 18, stiffness: 120, mass: 0.6},
      });
      const angle = (i / 36) * Math.PI * 2;
      const x1 = 600 + Math.cos(angle) * 90;
      const y1 = 600 + Math.sin(angle) * 90;
      const x2 = 600 + Math.cos(angle) * (150 + 410 * p);
      const y2 = 600 + Math.sin(angle) * (150 + 410 * p);
      return (
        <line
          key={`r-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={hexAlpha(i % 4 === 0 ? secondary : accent, 0.25)}
          strokeWidth={i % 4 === 0 ? 2 : 1}
        />
      );
    })}
  </svg>
);

export const IntroScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scene = SCENES[0];
  const lineWidth = interpolate(frame, [0, 9], [0, 1700], {extrapolateRight: 'clamp'});
  const lineOpacity = interpolate(frame, [0, 7, 16], [1, 1, 0], {extrapolateRight: 'clamp'});
  const cubeScale = interpolate(frame, [4, 45, 75], [0.72, 1, 1.18], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cubeOpacity = interpolate(frame, [0, 8, 66, 75], [0, 0.78, 0.78, 0.55], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const kickerOpacity = interpolate(frame, [10, 24], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <SceneFrame scene={scene} minimal>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            position: 'absolute',
            width: lineWidth,
            height: 3,
            backgroundColor: COLORS.paper,
            opacity: lineOpacity,
            boxShadow: `0 0 36px ${hexAlpha(scene.accent, 0.9)}`,
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) scale(${cubeScale})`,
            opacity: cubeOpacity,
          }}
        >
          <Rings frame={frame} fps={fps} accent={scene.accent} secondary={scene.secondary} />
        </div>

        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) scale(${cubeScale * 0.82}) rotate(${frame * 0.15}deg)`,
            opacity: cubeOpacity,
          }}
        >
          <WireCube
            frame={frame * 1.45}
            size={190}
            color={scene.accent}
            secondary={scene.secondary}
            trails={4}
            strokeWidth={3}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            right: 105,
            top: 180,
            fontFamily: FONT_DISPLAY,
            fontSize: 330,
            fontWeight: 700,
            letterSpacing: -30,
            lineHeight: 0.8,
            color: 'transparent',
            WebkitTextStroke: `1px ${hexAlpha(COLORS.paper, 0.08)}`,
            transform: `translateY(${Math.sin(frame * 0.06) * 12}px)`,
          }}
        >
          15″
        </div>

        <div
          style={{
            position: 'absolute',
            top: 185,
            width: '100%',
            zIndex: 3,
          }}
        >
          <div
            style={{
              textAlign: 'center',
              fontFamily: FONT_MONO,
              fontSize: 14,
              letterSpacing: 8,
              color: hexAlpha(scene.accent, 0.9),
              opacity: kickerOpacity,
              marginBottom: 28,
            }}
          >
            A MOTION DESIGN SHOWREEL
          </div>
          <KineticLine
            text="MOTION"
            size={218}
            weight={700}
            color={COLORS.paper}
            accent={scene.accent}
            secondary={scene.secondary}
            start={5}
            stagger={2.4}
            direction={1}
            glitch={frame > 46 ? 7 : 0}
            letterSpacing={-12}
            style={{textShadow: `0 0 60px ${hexAlpha(scene.accent, 0.24)}`}}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            top: 610,
            width: '100%',
            zIndex: 3,
          }}
        >
          <KineticLine
            text="DESIGNER"
            size={104}
            weight={500}
            color={COLORS.paper}
            accent={scene.accent}
            secondary={scene.secondary}
            start={12}
            stagger={1.7}
            direction={-1}
            glitch={frame > 52 ? 4 : 0}
            letterSpacing={14}
            outline
          />
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 150,
            display: 'flex',
            gap: 26,
            alignItems: 'center',
            fontFamily: FONT_MONO,
            fontSize: 12,
            letterSpacing: 3,
            color: hexAlpha(COLORS.paper, 0.58),
            opacity: kickerOpacity,
            zIndex: 3,
          }}
        >
          <span>15 SECONDS</span>
          <span style={{width: 7, height: 7, backgroundColor: scene.accent, transform: 'rotate(45deg)'}} />
          <span>6 DISCIPLINES</span>
          <span style={{width: 7, height: 7, backgroundColor: scene.secondary, transform: 'rotate(45deg)'}} />
          <span>ONE OBSESSION</span>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 120,
            bottom: 118,
            fontFamily: FONT_TEXT,
            fontSize: 12,
            letterSpacing: 4,
            color: hexAlpha(COLORS.paper, 0.5),
            opacity: kickerOpacity,
          }}
        >
          SHOWREEL / 2026
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};

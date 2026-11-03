import React from 'react';
import {evolvePath} from '@remotion/paths';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneFrame} from '../components/SceneFrame';
import {KineticLine} from '../components/KineticText';
import {
  COLORS,
  FONT_DISPLAY,
  FONT_MONO,
  FONT_TEXT,
  SCENES,
  clamp,
  easeOut,
  hexAlpha,
  lerp,
  pulse,
} from '../theme';

const FINAL_LINE = 'M 460 760 C 700 720, 1220 800, 1460 760';

const TILES = [
  {label: 'KINETIC TYPE', color: COLORS.coral, fromX: -550, fromY: -260, icon: 'Aa'},
  {label: 'SPATIAL', color: COLORS.violet, fromX: 0, fromY: -420, icon: '3D'},
  {label: 'COLOR / FORM', color: COLORS.lime, fromX: 550, fromY: -260, icon: '△'},
  {label: 'SYSTEMS', color: COLORS.cyan, fromX: -550, fromY: 300, icon: '◫'},
  {label: 'DATA', color: COLORS.orange, fromX: 0, fromY: 420, icon: '▥'},
  {label: 'IMPACT', color: COLORS.paper, fromX: 550, fromY: 300, icon: '✦'},
];

const TileArt = ({icon, color}) => {
  if (icon === '▥') {
    return (
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 8, height: 92}}>
        {[36, 66, 48, 86, 58, 74, 44].map((height, i) => (
          <div key={i} style={{width: 12, height, backgroundColor: i % 2 ? color : COLORS.paper, opacity: 0.8}} />
        ))}
      </div>
    );
  }
  if (icon === '◫') {
    return (
      <svg viewBox="0 0 160 110" width="160" height="110">
        <path d="M 30 35 L 80 10 L 135 35 L 85 62 Z" fill="none" stroke={color} strokeWidth="3" />
        <path d="M 30 35 L 30 82 L 85 105 L 85 62 M 135 35 L 135 80 L 85 105" fill="none" stroke={COLORS.paper} strokeWidth="2" opacity="0.65" />
      </svg>
    );
  }
  return (
    <div
      style={{
        fontFamily: FONT_DISPLAY,
        fontSize: icon.length > 2 ? 58 : 92,
        fontWeight: 700,
        letterSpacing: -5,
        color: icon === '△' || icon === '✦' ? color : COLORS.paper,
        lineHeight: 1,
      }}
    >
      {icon}
    </div>
  );
};

const Monogram = ({frame, accent}) => (
  <svg viewBox="0 0 220 220" width="190" height="190" style={{overflow: 'visible'}}>
    <circle
      cx="110"
      cy="110"
      r="96"
      fill="none"
      stroke={hexAlpha(COLORS.paper, 0.2)}
      strokeWidth="2"
      strokeDasharray="2 10"
      transform={`rotate(${frame * 1.2} 110 110)`}
    />
    <circle
      cx="110"
      cy="110"
      r="76"
      fill="none"
      stroke={accent}
      strokeWidth="5"
      strokeLinecap="round"
      strokeDasharray="340 500"
      strokeDashoffset={-frame * 2.4}
      transform={`rotate(${frame * 0.6 - 90} 110 110)`}
    />
    <circle cx="110" cy="110" r="56" fill={hexAlpha(COLORS.ink, 0.72)} stroke={hexAlpha(COLORS.paper, 0.25)} strokeWidth="1" />
    <text
      x="110"
      y="126"
      textAnchor="middle"
      fill={COLORS.paper}
      fontFamily={FONT_DISPLAY}
      fontSize="42"
      fontWeight="700"
      letterSpacing="-3"
    >
      MD
    </text>
  </svg>
);

export const OutroScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scene = SCENES[5];
  const collapse = easeOut(interpolate(frame, [26, 44], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));
  const cardOpacity = interpolate(frame, [32, 46], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lineReveal = evolvePath(clamp((frame - 42) / 24), FINAL_LINE);
  const beat = pulse(frame, 15, 0.55);

  return (
    <SceneFrame scene={scene} minimal holdEnd>
      {frame < 46 && (
        <AbsoluteFill>
          {TILES.map((tile, i) => {
            const p = spring({
              frame: Math.max(0, frame - 1 - i * 1.8),
              fps,
              config: {damping: 13, stiffness: 115, mass: 0.7},
            });
            const gridX = 290 + (i % 3) * 390;
            const gridY = 258 + Math.floor(i / 3) * 270;
            const finalX = 780;
            const finalY = 435;
            const x = lerp(gridX, finalX, collapse) + (1 - p) * tile.fromX;
            const y = lerp(gridY, finalY, collapse) + (1 - p) * tile.fromY;
            const scale = lerp(1, 0.08, collapse) * (0.82 + p * 0.18);
            const rotate = (1 - p) * (i % 2 ? 14 : -14) + collapse * (i % 2 ? 70 : -70);

            return (
              <div
                key={tile.label}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width: 360,
                  height: 210,
                  padding: 22,
                  boxSizing: 'border-box',
                  backgroundColor: hexAlpha(COLORS.ink, 0.82),
                  border: `1px solid ${hexAlpha(tile.color, 0.55)}`,
                  boxShadow: `0 20px 80px ${hexAlpha(COLORS.ink, 0.7)}, inset 0 0 50px ${hexAlpha(tile.color, 0.08)}`,
                  opacity: p * (1 - collapse),
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                  transformOrigin: '50% 50%',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    right: -30,
                    bottom: -70,
                    width: 220,
                    height: 220,
                    borderRadius: '50%',
                    backgroundColor: hexAlpha(tile.color, 0.16),
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: FONT_MONO,
                    fontSize: 10,
                    letterSpacing: 3,
                    color: hexAlpha(COLORS.paper, 0.55),
                  }}
                >
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{color: tile.color}}>REEL</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', height: 120, justifyContent: 'space-between'}}>
                  <TileArt icon={tile.icon} color={tile.color} />
                  <div
                    style={{
                      writingMode: 'vertical-rl',
                      fontFamily: FONT_TEXT,
                      fontSize: 10,
                      letterSpacing: 3,
                      color: hexAlpha(COLORS.paper, 0.45),
                    }}
                  >
                    {tile.label}
                  </div>
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      )}

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: cardOpacity,
          transform: `scale(${1 + (1 - cardOpacity) * 0.12})`,
          zIndex: 4,
        }}
      >
        <div style={{position: 'absolute', top: 165, transform: `scale(${1 + beat * 0.025})`}}>
          <Monogram frame={frame} accent={scene.secondary} />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 205,
            textAlign: 'center',
            fontFamily: FONT_DISPLAY,
            fontSize: 260,
            fontWeight: 700,
            letterSpacing: -18,
            lineHeight: 1,
            color: 'transparent',
            WebkitTextStroke: `1px ${hexAlpha(COLORS.paper, 0.08)}`,
            opacity: 0.85,
          }}
        >
          MOVE
        </div>

        <div style={{position: 'absolute', left: 0, right: 0, top: 365}}>
          <KineticLine
            text="LET'S MAKE IT"
            size={112}
            weight={600}
            color={COLORS.paper}
            accent={scene.secondary}
            secondary={COLORS.coral}
            start={34}
            stagger={1.4}
            direction={-1}
            letterSpacing={-3}
          />
        </div>

        <div style={{position: 'absolute', left: 0, right: 0, top: 485}}>
          <KineticLine
            text="MOVE"
            size={250}
            weight={700}
            color={COLORS.paper}
            accent={scene.secondary}
            secondary={COLORS.violet}
            start={42}
            stagger={3}
            direction={1}
            glitch={beat * 4}
            letterSpacing={-16}
          />
        </div>

        <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <path
            d={FINAL_LINE}
            fill="none"
            stroke={scene.secondary}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={lineReveal.strokeDasharray}
            strokeDashoffset={lineReveal.strokeDashoffset}
          />
          <path
            d={FINAL_LINE}
            fill="none"
            stroke={hexAlpha(COLORS.coral, 0.45)}
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={lineReveal.strokeDasharray}
            strokeDashoffset={lineReveal.strokeDashoffset}
            transform="translate(0, 12)"
            opacity="0.3"
          />
        </svg>

        <div
          style={{
            position: 'absolute',
            bottom: 175,
            textAlign: 'center',
            fontFamily: FONT_MONO,
            fontSize: 13,
            letterSpacing: 5,
            color: hexAlpha(COLORS.paper, 0.62),
            lineHeight: 2.2,
          }}
        >
          <div>MOTION DESIGNER · DIRECTION · SYSTEMS</div>
          <div style={{color: scene.secondary}}>AVAILABLE FOR WHAT'S NEXT / 2026</div>
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};

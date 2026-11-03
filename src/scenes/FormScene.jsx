import React from 'react';
import {evolvePath, interpolatePath} from '@remotion/paths';
import {makeStar} from '@remotion/shapes';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneFrame} from '../components/SceneFrame';
import {COLORS, FONT_DISPLAY, FONT_MONO, SCENES, clamp, hexAlpha} from '../theme';

const STAR = makeStar({points: 5, innerRadius: 72, outerRadius: 170, cornerRadius: 7});
const RIBBON = 'M -120 600 C 180 250, 430 850, 780 480 S 1320 120, 2050 520';
const BLOB_A = 'M 250 120 C 390 20 540 80 550 220 C 560 360 450 430 300 390 C 150 350 110 220 250 120 Z';
const BLOB_B = 'M 250 120 C 430 90 500 0 550 170 C 600 340 480 440 330 390 C 180 340 70 150 250 120 Z';

const Shape = ({frame, fps, delay, x, y, size, rotate = 0, fromX = 0, fromY = 0, float = 0, zIndex = 2, children}) => {
  const p = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: {damping: 12, stiffness: 115, mass: 0.7},
  });
  const driftY = Math.sin(frame * 0.055 + delay) * float;
  const driftX = Math.cos(frame * 0.042 + delay) * float * 0.65;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        zIndex,
        opacity: p,
        transform: `translate3d(${(1 - p) * fromX + driftX}px, ${(1 - p) * fromY + driftY}px, 0) rotate(${rotate + (1 - p) * 35 + Math.sin(frame * 0.025 + delay) * 4}deg) scale(${0.72 + p * 0.28})`,
        transformOrigin: '50% 50%',
      }}
    >
      {children}
    </div>
  );
};

export const FormScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scene = SCENES[3];
  const starReveal = evolvePath(clamp(frame / 30), STAR.path);
  const ribbonReveal = evolvePath(clamp(frame / 42), RIBBON);
  const blobMorph = 0.5 + 0.5 * Math.sin(frame * 0.055);
  const blobPath = interpolatePath(blobMorph, BLOB_A, BLOB_B);

  return (
    <SceneFrame scene={scene}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 165,
          textAlign: 'center',
          fontFamily: FONT_DISPLAY,
          fontSize: 126,
          fontWeight: 700,
          letterSpacing: -7,
          color: 'transparent',
          WebkitTextStroke: `1px ${hexAlpha(COLORS.paper, 0.14)}`,
          opacity: 0.9,
          zIndex: 1,
        }}
      >
        FORM FOLLOWS MOTION
      </div>

      <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{position: 'absolute', inset: 0, zIndex: 1}}>
        <path
          d={RIBBON}
          fill="none"
          stroke={hexAlpha(scene.accent, 0.2)}
          strokeWidth="112"
          strokeLinecap="round"
          strokeDasharray={ribbonReveal.strokeDasharray}
          strokeDashoffset={ribbonReveal.strokeDashoffset}
        />
        <path
          d={RIBBON}
          fill="none"
          stroke={hexAlpha(scene.secondary, 0.7)}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={ribbonReveal.strokeDasharray}
          strokeDashoffset={ribbonReveal.strokeDashoffset}
        />
        <path
          d={blobPath}
          transform="translate(1050 190) scale(0.82)"
          fill={hexAlpha(COLORS.coral, 0.58)}
          stroke={hexAlpha(COLORS.paper, 0.35)}
          strokeWidth="3"
        />
      </svg>

      <Shape frame={frame} fps={fps} delay={2} x={190} y={285} size={340} fromX={-420} float={12} rotate={-8}>
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: COLORS.coral,
            boxShadow: `0 0 70px ${hexAlpha(COLORS.coral, 0.3)}`,
          }}
        />
      </Shape>

      <Shape frame={frame} fps={fps} delay={6} x={455} y={410} size={420} fromY={420} float={10} rotate={18} zIndex={3}>
        <div
          style={{
            width: '100%',
            height: '50%',
            borderTopLeftRadius: 420,
            borderTopRightRadius: 420,
            backgroundColor: COLORS.violet,
            boxShadow: `0 0 60px ${hexAlpha(COLORS.violet, 0.35)}`,
          }}
        />
      </Shape>

      <Shape frame={frame} fps={fps} delay={9} x={745} y={285} size={360} fromX={520} float={15} rotate={-5}>
        <div
          style={{
            width: '100%',
            height: '100%',
            clipPath: 'polygon(50% 0, 100% 100%, 0 100%)',
            backgroundColor: scene.accent,
            boxShadow: `0 0 70px ${hexAlpha(scene.accent, 0.25)}`,
          }}
        />
      </Shape>

      <Shape frame={frame} fps={fps} delay={12} x={1210} y={270} size={300} fromY={-400} float={13} rotate={24}>
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: scene.secondary,
            border: `14px solid ${hexAlpha(COLORS.paper, 0.75)}`,
          }}
        />
      </Shape>

      <Shape frame={frame} fps={fps} delay={15} x={1430} y={540} size={310} fromX={420} float={16} rotate={0} zIndex={3}>
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: `54px solid ${COLORS.cyan}`,
            boxShadow: `inset 0 0 0 8px ${hexAlpha(COLORS.paper, 0.35)}, 0 0 70px ${hexAlpha(COLORS.cyan, 0.25)}`,
          }}
        />
      </Shape>

      <Shape frame={frame} fps={fps} delay={18} x={620} y={470} size={380} fromY={420} float={9} rotate={0} zIndex={4}>
        <svg viewBox="0 0 340 340" width="100%" height="100%" style={{overflow: 'visible'}}>
          <path d={STAR.path} fill={hexAlpha(COLORS.paper, 0.08)} stroke="none" />
          <path
            d={STAR.path}
            fill="none"
            stroke={COLORS.paper}
            strokeWidth="8"
            strokeLinejoin="round"
            strokeDasharray={starReveal.strokeDasharray}
            strokeDashoffset={starReveal.strokeDashoffset}
          />
          <path
            d={STAR.path}
            fill="none"
            stroke={hexAlpha(scene.secondary, 0.75)}
            strokeWidth="22"
            strokeLinejoin="round"
            strokeDasharray={starReveal.strokeDasharray}
            strokeDashoffset={starReveal.strokeDashoffset}
            transform="translate(10, 10)"
            opacity="0.45"
          />
        </svg>
      </Shape>

      <Shape frame={frame} fps={fps} delay={22} x={1050} y={650} size={430} fromX={560} float={7} rotate={-7} zIndex={4}>
        <div
          style={{
            width: '100%',
            height: 94,
            backgroundImage: `repeating-linear-gradient(90deg, ${COLORS.paper} 0 42px, ${COLORS.ink} 42px 84px), repeating-linear-gradient(0deg, ${COLORS.paper} 0 42px, ${COLORS.ink} 42px 84px)`,
            backgroundSize: '84px 84px',
            backgroundBlendMode: 'difference',
            border: `2px solid ${hexAlpha(COLORS.paper, 0.5)}`,
          }}
        />
      </Shape>

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 210,
          fontFamily: FONT_MONO,
          fontSize: 12,
          letterSpacing: 3,
          color: hexAlpha(COLORS.paper, 0.5),
          zIndex: 5,
        }}
      >
        SHAPE LIBRARY / 07 OBJECTS / 01 MORPH
      </div>

      <div
        style={{
          position: 'absolute',
          right: 125,
          bottom: 135,
          display: 'flex',
          gap: 12,
          zIndex: 5,
        }}
      >
        {[COLORS.coral, COLORS.violet, scene.accent, scene.secondary, COLORS.cyan, COLORS.paper].map((color, i) => (
          <div key={i} style={{width: 52, textAlign: 'center'}}>
            <div style={{height: 42, backgroundColor: color, border: `1px solid ${hexAlpha(COLORS.paper, 0.3)}`}} />
            <div
              style={{
                marginTop: 7,
                fontFamily: FONT_MONO,
                fontSize: 8,
                letterSpacing: 1,
                color: hexAlpha(COLORS.paper, 0.5),
              }}
            >
              {color.replace('#', '')}
            </div>
          </div>
        ))}
      </div>
    </SceneFrame>
  );
};

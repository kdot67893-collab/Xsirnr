import React from 'react';
import {evolvePath} from '@remotion/paths';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneFrame} from '../components/SceneFrame';
import {COLORS, FONT_DISPLAY, FONT_MONO, FONT_TEXT, SCENES, clamp, hexAlpha, pulse} from '../theme';

const UNDERLINE = 'M 280 640 C 500 560, 690 710, 900 622 S 1330 550, 1640 640';

const SplitWord = ({text, frame, fps, accent, secondary}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: FONT_DISPLAY,
      fontSize: 220,
      fontWeight: 700,
      letterSpacing: -12,
      lineHeight: 0.9,
      color: COLORS.paper,
      whiteSpace: 'pre',
    }}
  >
    {Array.from(text).map((char, i) => {
      const p = spring({
        frame: Math.max(0, frame - 3 - i * 2.2),
        fps,
        config: {damping: 11, stiffness: 140, mass: 0.65},
      });
      const split = interpolate(frame, [26, 40, 56, 68], [0, 1, 0.14, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const direction = i % 2 === 0 ? 1 : -1;
      const jitter = Math.sin((frame + i * 11) * 0.75) * split * 9;
      const topShift = split * direction * -34 + jitter;
      const bottomShift = split * direction * 34 - jitter;
      const yTop = (1 - p) * -150 + Math.sin(p * Math.PI) * 8;
      const yBottom = (1 - p) * 150 - Math.sin(p * Math.PI) * 8;
      const rotate = (1 - p) * 9 * direction;
      const chroma = split * 10;
      const shadow = `${chroma}px 0 0 ${hexAlpha(secondary, 0.8)}, ${-chroma}px 0 0 ${hexAlpha(accent, 0.8)}, 0 0 42px ${hexAlpha(accent, 0.2)}`;

      return (
        <span
          key={`${char}-${i}`}
          style={{
            position: 'relative',
            display: 'inline-block',
            opacity: p,
            transform: `rotate(${rotate}deg)`,
            transformOrigin: '50% 50%',
          }}
        >
          <span
            style={{
              position: 'relative',
              display: 'inline-block',
              clipPath: 'inset(0 0 49% 0)',
              transform: `translate3d(${topShift}px, ${yTop}px, 0)`,
              textShadow: shadow,
            }}
          >
            {char}
          </span>
          <span
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              display: 'inline-block',
              clipPath: 'inset(51% 0 0 0)',
              transform: `translate3d(${bottomShift}px, ${yBottom}px, 0)`,
              textShadow: shadow,
            }}
          >
            {char}
          </span>
        </span>
      );
    })}
  </div>
);

const BackgroundType = ({frame, accent, secondary}) => (
  <AbsoluteFill style={{overflow: 'hidden', opacity: 0.16}}>
    {[0, 1, 2].map((row) => (
      <div
        key={row}
        style={{
          position: 'absolute',
          top: 150 + row * 300,
          left: 0,
          display: 'flex',
          gap: 90,
          whiteSpace: 'nowrap',
          transform: `translateX(${-((frame * (row % 2 === 0 ? 7 : -5) + row * 240) % 720) - 300}px) rotate(-7deg)`,
          fontFamily: FONT_DISPLAY,
          fontSize: 164,
          fontWeight: 700,
          letterSpacing: -10,
          color: 'transparent',
          WebkitTextStroke: `1px ${hexAlpha(row === 1 ? secondary : accent, 0.7)}`,
        }}
      >
        {Array.from({length: 8}).map((_, i) => (
          <span key={i}>TYPE</span>
        ))}
      </div>
    ))}
  </AbsoluteFill>
);

export const TypeScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scene = SCENES[1];
  const beat = pulse(frame, 15, 0.55);
  const split = interpolate(frame, [26, 40], [0, 1], {extrapolateRight: 'clamp'});
  const lineReveal = evolvePath(clamp(frame / 34), UNDERLINE);
  const tickerX = -((frame * 12) % 620);

  return (
    <SceneFrame scene={scene}>
      <BackgroundType frame={frame} accent={scene.accent} secondary={scene.secondary} />

      {Array.from({length: 5}).map((_, i) => {
        const p = spring({
          frame: Math.max(0, frame - 8 - i * 2),
          fps,
          config: {damping: 15, stiffness: 110, mass: 0.7},
        });
        const fromLeft = i % 2 === 0;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: fromLeft ? 0 : undefined,
              right: fromLeft ? undefined : 0,
              top: 275 + i * 96,
              width: 470 + i * 95,
              height: 12 + (i % 2) * 6,
              backgroundColor: i % 2 === 0 ? scene.accent : scene.secondary,
              opacity: 0.12 + 0.42 * p,
              transform: `translateX(${(1 - p) * (fromLeft ? -1 : 1) * 700}px) skewX(-18deg)`,
              boxShadow: `0 0 32px ${hexAlpha(i % 2 === 0 ? scene.accent : scene.secondary, 0.35)}`,
            }}
          />
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 342,
          zIndex: 3,
          transform: `scale(${1 + beat * 0.012})`,
        }}
      >
        <SplitWord text="RHYTHM" frame={frame} fps={fps} accent={scene.accent} secondary={scene.secondary} />
      </div>

      <svg
        viewBox="0 0 1920 760"
        width="1920"
        height="760"
        style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', zIndex: 2}}
      >
        <path
          d={UNDERLINE}
          fill="none"
          stroke={hexAlpha(scene.accent, 0.92)}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={lineReveal.strokeDasharray}
          strokeDashoffset={lineReveal.strokeDashoffset}
        />
        <path
          d={UNDERLINE}
          fill="none"
          stroke={hexAlpha(scene.secondary, 0.3)}
          strokeWidth={18}
          strokeLinecap="round"
          strokeDasharray={lineReveal.strokeDasharray}
          strokeDashoffset={lineReveal.strokeDashoffset}
          transform="translate(0, 10)"
        />
      </svg>

      <div
        style={{
          position: 'absolute',
          top: 226,
          right: 132,
          display: 'flex',
          gap: 18,
          alignItems: 'center',
          fontFamily: FONT_MONO,
          fontSize: 12,
          letterSpacing: 3,
          color: hexAlpha(COLORS.paper, 0.62),
        }}
      >
        <span style={{color: scene.accent}}>VARIABLE WEIGHT</span>
        <span style={{width: 42, height: 1, backgroundColor: scene.accent}} />
        <span>300 → 700</span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 163,
          height: 58,
          borderTop: `1px solid ${hexAlpha(scene.accent, 0.35)}`,
          borderBottom: `1px solid ${hexAlpha(scene.accent, 0.35)}`,
          overflow: 'hidden',
          backgroundColor: hexAlpha(COLORS.ink, 0.5),
          zIndex: 4,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 70,
            alignItems: 'center',
            height: '100%',
            whiteSpace: 'nowrap',
            transform: `translateX(${tickerX}px)`,
            fontFamily: FONT_DISPLAY,
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: 3,
            color: hexAlpha(COLORS.paper, 0.78),
          }}
        >
          {Array.from({length: 12}).map((_, i) => (
            <React.Fragment key={i}>
              <span>{i % 3 === 0 ? 'EASING' : i % 3 === 1 ? 'TIMING' : 'SPACING'}</span>
              <span style={{color: scene.accent}}>✦</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 690,
          fontFamily: FONT_TEXT,
          fontSize: 15,
          letterSpacing: 5,
          color: hexAlpha(COLORS.paper, 0.45),
          zIndex: 4,
        }}
      >
        {split > 0.45 ? 'SPLIT / SHIFT / SETTLE' : 'EVERY FRAME HAS A BEAT'}
      </div>
    </SceneFrame>
  );
};

import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS, FONT_DISPLAY, clamp, hexAlpha} from '../theme';

export const KineticLine = ({
  text,
  size = 160,
  weight = 700,
  color = COLORS.paper,
  accent = COLORS.cyan,
  secondary = COLORS.coral,
  start = 0,
  stagger = 2,
  direction = 1,
  glitch = 0,
  letterSpacing = -4,
  outline = false,
  style,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: FONT_DISPLAY,
        fontSize: size,
        lineHeight: 0.86,
        fontWeight: weight,
        letterSpacing,
        textTransform: 'uppercase',
        whiteSpace: 'pre',
        ...style,
      }}
    >
      {Array.from(text).map((char, i) => {
        const localFrame = Math.max(0, frame - start - i * stagger);
        const p = clamp(
          1 - Math.pow(1 - clamp(localFrame / 15), 3),
        );
        const settle = clamp(localFrame / 22);
        const overshoot = Math.sin(settle * Math.PI) * 10;
        const y = (1 - p) * 150 * direction + overshoot * direction;
        const rotate = (1 - p) * 11 * (i % 2 === 0 ? direction : -direction);
        const scale = 0.78 + p * 0.22;
        const chroma = glitch * (0.4 + 0.6 * Math.sin((frame + i * 9) * 0.8));
        const textShadow = outline
          ? 'none'
          : `${chroma}px 0 0 ${hexAlpha(secondary, 0.7)}, ${-chroma}px 0 0 ${hexAlpha(accent, 0.72)}, 0 0 36px ${hexAlpha(accent, 0.18)}`;

        return (
          <span
            key={`${char}-${i}`}
            style={{
              display: 'inline-block',
              whiteSpace: 'pre',
              opacity: p,
              color: outline ? 'transparent' : color,
              WebkitTextStroke: outline ? `2px ${hexAlpha(color, 0.85)}` : undefined,
              fontWeight: Math.round(300 + (weight - 300) * p),
              textShadow,
              transform: `translate3d(0, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`,
              transformOrigin: '50% 100%',
              willChange: 'transform, opacity',
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

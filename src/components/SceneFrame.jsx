import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {
  COLORS,
  FONT_DISPLAY,
  FONT_MONO,
  FONT_TEXT,
  SCENE_LENGTH,
  clamp,
  hexAlpha,
} from '../theme';

export const SceneFrame = ({
  scene,
  children,
  duration = SCENE_LENGTH,
  minimal = false,
  holdEnd = false,
  contentStyle,
}) => {
  const frame = useCurrentFrame();
  const inOpacity = interpolate(frame, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
  const outOpacity = holdEnd
    ? 1
    : interpolate(frame, [duration - 7, duration], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
  const opacity = Math.min(inOpacity, outOpacity);
  const titleIn = interpolate(frame, [2, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const numberIn = interpolate(frame, [0, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitScale = holdEnd
    ? 1
    : interpolate(frame, [duration - 12, duration], [1, 1.035], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

  return (
    <AbsoluteFill
      style={{
        opacity,
        fontFamily: FONT_TEXT,
        overflow: 'hidden',
        color: COLORS.paper,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 42%, ${hexAlpha(scene.accent, 0.08)} 0%, transparent 48%), linear-gradient(135deg, ${hexAlpha(scene.secondary, 0.05)}, transparent 45%)`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 132,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          opacity: titleIn * 0.86,
          fontFamily: FONT_MONO,
          fontSize: 12,
          letterSpacing: 3,
          textTransform: 'uppercase',
        }}
      >
        <div style={{width: 34, height: 1, backgroundColor: scene.accent}} />
        <span style={{color: scene.accent}}>CHAPTER {scene.number}</span>
        <span style={{color: hexAlpha(COLORS.paper, 0.42)}}>/ {scene.name}</span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 180,
          width: 4,
          height: 610,
          backgroundColor: hexAlpha(scene.accent, 0.62),
          transform: `scaleY(${titleIn})`,
          transformOrigin: 'top',
        }}
      />

      {!minimal && (
        <>
          <div
            style={{
              position: 'absolute',
              right: 90,
              top: 112,
              fontFamily: FONT_DISPLAY,
              fontSize: 300,
              fontWeight: 700,
              letterSpacing: -28,
              lineHeight: 1,
              color: 'transparent',
              WebkitTextStroke: `1px ${hexAlpha(scene.accent, 0.13)}`,
              opacity: numberIn,
              transform: `translateY(${(1 - numberIn) * 60}px)`,
            }}
          >
            {scene.number}
          </div>

          <div
            style={{
              position: 'absolute',
              left: 120,
              bottom: 118,
              opacity: titleIn,
              transform: `translateY(${(1 - titleIn) * 30}px)`,
            }}
          >
            <div
              style={{
                width: 220,
                height: 2,
                backgroundColor: scene.accent,
                marginBottom: 18,
                transform: `scaleX(${clamp(titleIn)})`,
                transformOrigin: 'left',
              }}
            />
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 40,
                fontWeight: 700,
                letterSpacing: -1.5,
                lineHeight: 1,
                textTransform: 'uppercase',
              }}
            >
              {scene.title}
            </div>
            <div
              style={{
                marginTop: 10,
                fontFamily: FONT_MONO,
                fontSize: 12,
                letterSpacing: 3,
                color: hexAlpha(COLORS.paper, 0.5),
              }}
            >
              {scene.subtitle}
            </div>
          </div>
        </>
      )}

      <AbsoluteFill
        style={{
          transform: `scale(${exitScale})`,
          transformOrigin: '50% 50%',
          zIndex: 2,
          ...contentStyle,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

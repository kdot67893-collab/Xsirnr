import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {
  COLORS,
  FONT_DISPLAY,
  FONT_MONO,
  FONT_TEXT,
  SCENES,
  SCENE_LENGTH,
  TRANSITION_STARTS,
  clamp,
  hexAlpha,
  pulse,
  sceneAt,
  timecode,
} from '../theme';

const cornerStyle = (accent, position) => ({
  position: 'absolute',
  width: 26,
  height: 26,
  borderColor: hexAlpha(accent, 0.65),
  borderStyle: 'solid',
  borderWidth: 0,
  ...position,
});

export const Backdrop = ({frame, accent, secondary, bg}) => {
  const grid = hexAlpha(COLORS.paper, 0.055);
  const x1 = 24 + Math.sin(frame * 0.018) * 12;
  const y1 = 38 + Math.cos(frame * 0.014) * 10;
  const x2 = 78 + Math.cos(frame * 0.011) * 10;
  const y2 = 62 + Math.sin(frame * 0.017) * 12;

  return (
    <AbsoluteFill style={{backgroundColor: bg, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px)`,
          backgroundSize: '80px 80px, 80px 80px',
          backgroundPosition: `${frame * 0.22}px ${frame * 0.09}px`,
          opacity: 0.62,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${x1}% ${y1}%, ${hexAlpha(accent, 0.18)} 0%, transparent 34%), radial-gradient(circle at ${x2}% ${y2}%, ${hexAlpha(secondary, 0.14)} 0%, transparent 36%)`,
          mixBlendMode: 'screen',
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(115deg, ${hexAlpha(COLORS.paper, 0.025)} 0 1px, transparent 1px 140px)`,
          backgroundPosition: `${-frame * 1.1}px 0`,
          opacity: 0.9,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${hexAlpha(COLORS.ink, 0.5)} 0%, transparent 22%, transparent 76%, ${hexAlpha(COLORS.ink, 0.72)} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const SceneCamera = ({frame, children}) => {
  const beat = pulse(frame, 15, 0.52);
  const wave = Math.max(
    ...TRANSITION_STARTS.map((start) =>
      Math.sin(Math.PI * clamp((frame - (start - 8)) / 16)),
    ),
  );
  const scale = 1 + beat * 0.006 + wave * 0.024;
  const dx = Math.sin(frame * 2.13) * beat * 2.5 + Math.sin(frame * 0.91) * wave * 5;
  const dy = Math.cos(frame * 1.77) * beat * 2.5 + Math.cos(frame * 0.67) * wave * 4;
  const rotate = Math.sin(frame * 0.51) * wave * 0.24;

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale}) translate3d(${dx}px, ${dy}px, 0) rotate(${rotate}deg)`,
        transformOrigin: '50% 50%',
        overflow: 'hidden',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Transitions = ({frame}) => {
  const boundary = TRANSITION_STARTS.find((start) => Math.abs(frame - start) <= 8);
  if (boundary === undefined) return null;

  const t = clamp((frame - (boundary - 8)) / 16);
  const wave = Math.sin(Math.PI * t);
  const shift = interpolate(t, [0, 0.5, 1], [-1, 0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const next = SCENES[Math.round(boundary / SCENE_LENGTH)];
  const accent = next.accent;
  const cutNumber = String(next.number).padStart(2, '0');

  return (
    <AbsoluteFill style={{pointerEvents: 'none', zIndex: 20, overflow: 'hidden'}}>
      {Array.from({length: 11}).map((_, i) => {
        const direction = i % 2 === 0 ? -1 : 1;
        const y = shift * direction * 1350;
        const color = i % 3 === 0 ? accent : i % 3 === 1 ? COLORS.ink : hexAlpha(accent, 0.55);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: -170 + i * 210,
              top: -190,
              width: 270,
              height: 1500,
              backgroundColor: color,
              clipPath: 'polygon(14% 0, 100% 0, 86% 100%, 0% 100%)',
              transform: `translate3d(0, ${y}px, 0) rotate(-4deg)`,
              boxShadow: `0 0 40px ${hexAlpha(accent, 0.32)}`,
            }}
          />
        );
      })}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: COLORS.paper,
          opacity: Math.pow(wave, 11) * 0.72,
          mixBlendMode: 'overlay',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: Math.pow(wave, 3) * 0.65,
          color: COLORS.paper,
          fontFamily: FONT_DISPLAY,
          fontSize: 260,
          fontWeight: 700,
          letterSpacing: -16,
          textShadow: `12px 0 0 ${hexAlpha(accent, 0.75)}, -12px 0 0 ${hexAlpha(next.secondary, 0.65)}`,
          transform: `scale(${1 + (1 - wave) * 0.2})`,
        }}
      >
        {cutNumber}
      </div>
    </AbsoluteFill>
  );
};

export const FilmOverlay = ({frame, accent}) => {
  const beat = pulse(frame, 15, 0.72);
  const scanY = (frame * 13) % 1080;
  const dotX = (frame * 3) % 6;
  const dotY = (frame * 5) % 6;

  return (
    <AbsoluteFill style={{pointerEvents: 'none', zIndex: 24}}>
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.42) 0.55px, transparent 0.55px)',
          backgroundSize: '6px 6px',
          backgroundPosition: `${dotX}px ${dotY}px`,
          opacity: 0.075,
          mixBlendMode: 'overlay',
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 4px)',
          opacity: 0.12,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: scanY,
          height: 1,
          backgroundColor: hexAlpha(accent, 0.35 * beat),
          boxShadow: `0 0 18px ${hexAlpha(accent, 0.45 * beat)}`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: hexAlpha(accent, 1),
          opacity: beat * 0.018,
          mixBlendMode: 'screen',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.42) 82%, rgba(0,0,0,0.78) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

export const Hud = ({frame, fps, accent}) => {
  const index = sceneAt(frame);
  const scene = SCENES[index];
  const local = frame - index * SCENE_LENGTH;
  const progress = clamp(local / SCENE_LENGTH);
  const tc = timecode(frame, fps);

  return (
    <AbsoluteFill
      style={{
        zIndex: 30,
        pointerEvents: 'none',
        color: COLORS.paper,
        fontFamily: FONT_MONO,
        fontSize: 14,
        letterSpacing: 2,
        textTransform: 'uppercase',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 78,
          right: 78,
          top: 58,
          height: 1,
          backgroundColor: hexAlpha(COLORS.paper, 0.22),
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 78,
          right: 78,
          bottom: 58,
          height: 1,
          backgroundColor: hexAlpha(COLORS.paper, 0.22),
        }}
      />

      <div style={cornerStyle(accent, {left: 52, top: 52, borderTopWidth: 2, borderLeftWidth: 2})} />
      <div style={cornerStyle(accent, {right: 52, top: 52, borderTopWidth: 2, borderRightWidth: 2})} />
      <div style={cornerStyle(accent, {left: 52, bottom: 52, borderBottomWidth: 2, borderLeftWidth: 2})} />
      <div style={cornerStyle(accent, {right: 52, bottom: 52, borderBottomWidth: 2, borderRightWidth: 2})} />

      <div style={{position: 'absolute', left: 88, top: 74, display: 'flex', alignItems: 'center', gap: 14}}>
        <div
          style={{
            width: 28,
            height: 28,
            border: `2px solid ${accent}`,
            transform: 'rotate(45deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{width: 8, height: 8, backgroundColor: accent}} />
        </div>
        <div style={{lineHeight: 1.55}}>
          <div style={{opacity: 0.95}}>MOTION DESIGNER / SHOWREEL</div>
          <div style={{opacity: 0.48, fontSize: 11}}>DESIGN · DIRECTION · SYSTEMS</div>
        </div>
      </div>

      <div style={{position: 'absolute', right: 88, top: 74, textAlign: 'right', lineHeight: 1.55}}>
        <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10}}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 8,
              backgroundColor: COLORS.coral,
              boxShadow: `0 0 12px ${COLORS.coral}`,
              opacity: 0.55 + pulse(frame, 15, 0.3) * 0.45,
            }}
          />
          <span>REC</span>
          <span style={{opacity: 0.5}}>/</span>
          <span>{tc}</span>
        </div>
        <div style={{opacity: 0.45, fontSize: 11}}>1920 × 1080 · {fps} FPS · 15:00</div>
      </div>

      <div style={{position: 'absolute', left: 88, bottom: 76, lineHeight: 1.55}}>
        <div style={{color: accent, fontSize: 12}}>
          {scene.number} / {scene.name}
        </div>
        <div style={{opacity: 0.5, fontSize: 11}}>{scene.subtitle}</div>
      </div>

      <div style={{position: 'absolute', right: 88, bottom: 82, display: 'flex', gap: 7}}>
        {SCENES.map((item, i) => {
          const fill = i < index ? 1 : i === index ? progress : 0;
          return (
            <div
              key={item.number}
              style={{
                width: 38,
                height: 4,
                backgroundColor: hexAlpha(COLORS.paper, 0.16),
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${fill * 100}%`,
                  height: '100%',
                  backgroundColor: i === index ? accent : hexAlpha(COLORS.paper, 0.55),
                }}
              />
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 68,
          transform: 'translateX(-50%)',
          color: hexAlpha(COLORS.paper, 0.3),
          fontFamily: FONT_TEXT,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: 4,
        }}
      >
        FRAME {String(frame).padStart(3, '0')} / 450
      </div>
    </AbsoluteFill>
  );
};

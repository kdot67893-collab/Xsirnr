import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Backdrop, FilmOverlay, Hud, SceneCamera, Transitions} from './components/GlobalLayers';
import {IntroScene} from './scenes/IntroScene';
import {TypeScene} from './scenes/TypeScene';
import {SpatialScene} from './scenes/SpatialScene';
import {FormScene} from './scenes/FormScene';
import {DataScene} from './scenes/DataScene';
import {OutroScene} from './scenes/OutroScene';
import {COLORS, DURATION_IN_FRAMES, SCENES, SCENE_LENGTH, sceneAt} from './theme';

const SceneStack = () => (
  <>
    <Sequence from={0 * SCENE_LENGTH} durationInFrames={SCENE_LENGTH}>
      <IntroScene />
    </Sequence>
    <Sequence from={1 * SCENE_LENGTH} durationInFrames={SCENE_LENGTH}>
      <TypeScene />
    </Sequence>
    <Sequence from={2 * SCENE_LENGTH} durationInFrames={SCENE_LENGTH}>
      <SpatialScene />
    </Sequence>
    <Sequence from={3 * SCENE_LENGTH} durationInFrames={SCENE_LENGTH}>
      <FormScene />
    </Sequence>
    <Sequence from={4 * SCENE_LENGTH} durationInFrames={SCENE_LENGTH}>
      <DataScene />
    </Sequence>
    <Sequence from={5 * SCENE_LENGTH} durationInFrames={SCENE_LENGTH}>
      <OutroScene />
    </Sequence>
  </>
);

export const Showreel = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scene = SCENES[sceneAt(frame)];

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.ink, overflow: 'hidden'}}>
      <Backdrop frame={frame} accent={scene.accent} secondary={scene.secondary} bg={scene.bg} />

      <SceneCamera frame={frame}>
        <SceneStack />
      </SceneCamera>

      <Transitions frame={frame} />
      <FilmOverlay frame={frame} accent={scene.accent} />
      <Hud frame={frame} fps={fps} accent={scene.accent} />

      <Audio
        src={staticFile('audio/showreel.wav')}
        volume={(f) =>
          interpolate(
            f,
            [0, 5, DURATION_IN_FRAMES - 18, DURATION_IN_FRAMES],
            [0, 1, 1, 0],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
          )
        }
      />
    </AbsoluteFill>
  );
};

import React from 'react';
import {Composition} from 'remotion';
import {Showreel} from './Showreel';
import {DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH} from './theme';

export const Root = () => (
  <Composition
    id="MotionDesignerShowreel"
    component={Showreel}
    durationInFrames={DURATION_IN_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);

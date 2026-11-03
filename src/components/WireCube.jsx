import React from 'react';
import {clamp, hexAlpha, lerp} from '../theme';

const VERTICES = [
  [-1, -1, -1],
  [1, -1, -1],
  [1, 1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1],
];

const EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
];

const rotatePoint = ([x, y, z], frame) => {
  const rx = frame * 0.022;
  const ry = frame * 0.031;
  const rz = frame * 0.013;
  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  let py = y * cosX - z * sinX;
  let pz = y * sinX + z * cosX;
  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);
  let px = x * cosY + pz * sinY;
  pz = -x * sinY + pz * cosY;
  const cosZ = Math.cos(rz);
  const sinZ = Math.sin(rz);
  const finalX = px * cosZ - py * sinZ;
  const finalY = px * sinZ + py * cosZ;
  return [finalX, finalY, pz];
};

export const WireCube = ({
  frame,
  size = 210,
  color,
  secondary,
  opacity = 1,
  trails = 3,
  strokeWidth = 3,
  style,
}) => {
  const project = (vertex, localFrame) => {
    const [x, y, z] = rotatePoint(vertex, localFrame);
    const perspective = 4 / (4 + z * 0.72);
    return {
      x: 400 + x * size * perspective,
      y: 400 + y * size * perspective,
      z,
    };
  };

  const layers = Array.from({length: trails + 1}).map((_, i) => ({
    localFrame: frame - i * 5,
    alpha: i === 0 ? 1 : 0.22 / i,
    width: i === 0 ? strokeWidth : strokeWidth * 0.7,
  }));

  return (
    <svg
      viewBox="0 0 800 800"
      width="800"
      height="800"
      style={{overflow: 'visible', opacity, ...style}}
    >
      {layers.map((layer, layerIndex) => {
        const points = VERTICES.map((vertex) => project(vertex, layer.localFrame));
        const layerColor = layerIndex === 0 ? color : secondary ?? color;
        return (
          <g key={layerIndex}>
            {EDGES.map(([a, b], edgeIndex) => {
              const p1 = points[a];
              const p2 = points[b];
              const depth = clamp((p1.z + p2.z + 2.8) / 5.6);
              return (
                <line
                  key={edgeIndex}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={hexAlpha(layerColor, layer.alpha * lerp(0.34, 1, depth))}
                  strokeWidth={layer.width * lerp(0.7, 1.35, depth)}
                  strokeLinecap="round"
                />
              );
            })}
            {layerIndex === 0 &&
              points.map((point, pointIndex) => (
                <circle
                  key={pointIndex}
                  cx={point.x}
                  cy={point.y}
                  r={lerp(3, 7, clamp((point.z + 1.4) / 2.8))}
                  fill={color}
                  opacity={lerp(0.35, 1, clamp((point.z + 1.4) / 2.8))}
                />
              ))}
          </g>
        );
      })}
      <circle cx="400" cy="400" r={size * 1.55} fill="none" stroke={hexAlpha(color, 0.08)} strokeWidth="1" />
      <line x1="400" y1="70" x2="400" y2="730" stroke={hexAlpha(color, 0.07)} strokeWidth="1" />
      <line x1="70" y1="400" x2="730" y2="400" stroke={hexAlpha(color, 0.07)} strokeWidth="1" />
    </svg>
  );
};

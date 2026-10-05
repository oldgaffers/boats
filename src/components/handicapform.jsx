import React, { useState } from 'react';
import { Stage, Layer, Rect, Circle, Text, Line, Arrow } from 'react-konva';

export default function HandicapForm({ boat }) {

  const [rectPosition, setRectPosition] = useState({ x: 20, y: 50 });
  const [circlePosition, setCirclePosition] = useState({ x: 200, y: 100 });

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Line
          points={[100, 415, 1000, 415]}
          stroke="blue"
          strokeWidth={1}
          lineCap="round"
          lineJoin="round"
          y={5}
        />
        <Arrow
          points={[210, 420, 210, 520]}
          stroke="blue"
          pointerAtBeginning={true}
          strokeWidth={1}
            fill="blue"
        />
        <Text x={160} y={460} text="Draft" fontSize={20} />
        <Rect
          x={rectPosition.x}
          y={rectPosition.y}
          width={100}
          height={100}
          fill="red"
          shadowBlur={10}
          draggable
          onDragEnd={(e) => setRectPosition(e.target.position())}
        />
        <Circle
          x={circlePosition.x}
          y={circlePosition.y}
          radius={50}
          fill="green"
          draggable
          onDragEnd={(e) => setCirclePosition(e.target.position())}
        />
      </Layer>
    </Stage>
  );
};

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Circle as KonvaCircle, Group, Text, Transformer } from 'react-konva';
import { LIMITS } from '../constants';

const boundBoxCallbackForCircle = (oldBox, newBox) => {
  // limit resize
  if (
    newBox.width < LIMITS.CIRCLE.MIN ||
    newBox.height < LIMITS.CIRCLE.MIN ||
    newBox.width > LIMITS.CIRCLE.MAX ||
    newBox.height > LIMITS.CIRCLE.MAX
  ) {
    return oldBox;
  }
  return newBox;
};
export function Circle({ onTap, ...shapeProps }) {
  const textRef = useRef();
  const transformerRef = useRef(null);
  const shapeRef = useRef(null);

  const [isSelected, setIsSelected] = useState(false);
  const handleSelect = (event) => {
    event.cancelBubble = true;
    onTap(event);
  };

  const handleDrag = useCallback(
    (event) => {
      shapeProps.moveShape(shapeProps.id, event);
    },
    [shapeProps]
  );

  const handleTransform = useCallback(
    (event) => {
      shapeProps.transformCircleShape(shapeRef.current, shapeProps.id, event);
    },
    [shapeProps]
  );

  useEffect(() => {
    if (shapeProps.selected.includes(shapeProps.id)) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [shapeProps]);

  useEffect(() => {
    if (isSelected && transformerRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Group
        id={shapeProps.id}
        onClick={handleSelect}
        onTap={handleSelect}
        onDragStart={handleSelect}
        ref={shapeRef}
        onDragEnd={handleDrag}
        onTransformEnd={handleTransform}
        draggable
        x={shapeProps.x}
        y={shapeProps.y}
        width={shapeProps.radius}
        height={shapeProps.radius}
        {...shapeProps}
      >
        <KonvaCircle
          id={shapeProps.id}
          fill={shapeProps.fill}
          stroke={shapeProps.stroke}
          width={shapeProps.width}
          height={shapeProps.height}
          radius={shapeProps.radius}
        />
        <Text
          ref={textRef}
          fontSize={16}
          text={shapeProps.staff?.username || '[null]'}
          stroke={shapeProps.color}
          strokeWidth={1}
          align="center"
          x={-18}
          y={-7}
        />
      </Group>
      {isSelected && (
        <Transformer
          anchorSize={5}
          borderDash={[6, 2]}
          ref={transformerRef}
          rotateEnabled={false}
          enabledAnchors={[
            'top-left',
            'top-right',
            'bottom-right',
            'bottom-left',
          ]}
          boundBoxFunc={boundBoxCallbackForCircle}
        />
      )}
    </>
  );
}

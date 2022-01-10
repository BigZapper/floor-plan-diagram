import { useCallback, useEffect, useRef, useState } from 'react';
import { Group, Rect as KonvaRectangle, Text, Transformer } from 'react-konva';
import { LIMITS } from '../constants';

const boundBoxCallbackForRectangle = (oldBox, newBox) => {
  // limit resize
  if (
    newBox.width < LIMITS.RECT.MIN ||
    newBox.height < LIMITS.RECT.MIN ||
    newBox.width > LIMITS.RECT.MAX ||
    newBox.height > LIMITS.RECT.MAX
  ) {
    return oldBox;
  }
  return newBox;
};

export function Rectangle({ onTap, ...shapeProps }) {
  const textRef = useRef();
  const [isSelected, setIsSelected] = useState(false);
  const transformerRef = useRef(null);
  const shapeRef = useRef(null);
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
      shapeProps.transformRectangleShape(
        shapeRef.current,
        shapeProps.id,
        event
      );
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
        width={shapeProps.width}
        height={shapeProps.height}
        rotation={shapeProps.rotation}
        {...shapeProps}
      >
        <KonvaRectangle
          id={shapeProps.id}
          fill={shapeProps.fill}
          stroke={shapeProps.stroke}
          width={shapeProps.width}
          height={shapeProps.height}
          x={0}
          y={0}
        />
        <Text
          ref={textRef}
          fontSize={16}
          text={shapeProps.staff?.username || '[null]'}
          stroke={shapeProps.color}
          strokeWidth={1}
          align="center"
          x={shapeProps.width / 2 - 17}
          y={shapeProps.height / 2 - 5}
        />
      </Group>
      {isSelected && (
        <Transformer
          anchorSize={5}
          borderDash={[6, 2]}
          ref={transformerRef}
          boundBoxFunc={boundBoxCallbackForRectangle}
        />
      )}
    </>
  );
}

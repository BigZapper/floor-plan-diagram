import { useCallback, useEffect, useRef, useState } from 'react';
import { Ellipse as KonvaEllipse, Group, Text, Transformer } from 'react-konva';
import { LIMITS } from '../constants';

const boundBoxCallbackForEllipse = (oldBox, newBox) => {
  // limit resize
  if (
    newBox.width < LIMITS.ELLIPSE.MIN ||
    newBox.height < LIMITS.ELLIPSE.MIN ||
    newBox.width > LIMITS.ELLIPSE.MAX ||
    newBox.height > LIMITS.ELLIPSE.MAX
  ) {
    return oldBox;
  }
  return newBox;
};

export function Ellipse({ onTap, ...shapeProps }) {
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
      shapeProps.transformEllipseShape(shapeRef.current, shapeProps.id, event);
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
        <KonvaEllipse
          id={shapeProps.id}
          fill={shapeProps.fill}
          stroke={shapeProps.stroke}
          width={shapeProps.width}
          height={shapeProps.height}
          radius={shapeProps.radius}
          radiusX={shapeProps.radiusX}
          radiusY={shapeProps.radiusY}
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
          boundBoxFunc={boundBoxCallbackForEllipse}
        />
      )}
    </>
  );
}

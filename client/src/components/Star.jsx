import { useCallback, useEffect, useRef, useState } from "react";
import { Star as KonvaStar, Transformer } from "react-konva";
import { LIMITS } from "../constants";

const boundBoxCallbackForStar = (oldBox, newBox) => {
  // limit resize
  if (
    newBox.width < LIMITS.STAR.MIN ||
    newBox.height < LIMITS.STAR.MIN ||
    newBox.width > LIMITS.STAR.MAX ||
    newBox.height > LIMITS.STAR.MAX
  ) {
    return oldBox;
  }
  return newBox;
};

export function Star({ ...shapeProps }) {
  const [isSelected, setIsSelected] = useState(false);
  const transformerRef = useRef(null);
  const shapeRef = useRef(null);
  const handleSelect = (event) => {
    event.cancelBubble = true;
    shapeProps.selectShape(shapeProps.id);
  };

  const handleDrag = useCallback(
    (event) => {
      shapeProps.moveShape(shapeProps.id, event);
    },
    [shapeProps]
  );

  const handleTransform = useCallback(
    (event) => {
      shapeProps.transformStarShape(shapeRef.current, shapeProps.id, event);
    },
    [shapeProps]
  );

  useEffect(() => {
    if (shapeProps.id === shapeProps.selected) {
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
      <KonvaStar
        onClick={handleSelect}
        onTap={handleSelect}
        onDragStart={handleSelect}
        ref={shapeRef}
        {...shapeProps}
        onDragEnd={handleDrag}
        onTransformEnd={handleTransform}
        draggable
      />
      {isSelected && (
        <Transformer
          enabledAnchors={[
            "top-left",
            "top-center",
            "top-right",
            "middle-right",
            "middle-left",
            "bottom-left",
            "bottom-center",
            "bottom-right",
          ]}
          anchorSize={5}
          borderDash={[6, 2]}
          ref={transformerRef}
          boundBoxFunc={boundBoxCallbackForStar}
        />
      )}
    </>
  );
}

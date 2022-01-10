import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Transformer } from 'react-konva';

function URLImage({
  image,
  selectShape,
  selected,
  moveShape,
  transform,
  img,
  lockBackground,
}) {
  const [isSelected, setIsSelected] = useState(false);
  const transformerRef = useRef(null);
  const shapeRef = useRef(null);
  const handleSelect = (event) => {
    event.cancelBubble = true;
    selectShape(shapeRef.current);
  };

  const handleDrag = useCallback(
    (event) => {
      moveShape(image.id, event);
    },
    [image.id, moveShape]
  );

  const handleTransform = useCallback(
    (event) => {
      transform(shapeRef.current, image.id, event);
    },
    [image.id, transform]
  );

  useEffect(() => {
    if (image.id === selected) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [image.id, selected]);

  useEffect(() => {
    if (isSelected && transformerRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      {lockBackground ? (
        <Image
          ref={shapeRef}
          image={img}
          x={image.x}
          y={image.y}
          offsetX={img ? img.width / 2 : 0}
          offsetY={img ? img.height / 2 : 0}
          width={image?.width}
          height={image?.height}
        />
      ) : (
        <Image
          id={image.id}
          onClick={handleSelect}
          onTap={handleSelect}
          onDragStart={handleSelect}
          ref={shapeRef}
          onDragEnd={handleDrag}
          draggable
          onTransformEnd={handleTransform}
          image={img}
          x={image.x}
          y={image.y}
          offsetX={img ? img.width / 2 : 0}
          offsetY={img ? img.height / 2 : 0}
          width={image?.width}
          height={image?.height}
        />
      )}
      {isSelected && (
        <Transformer anchorSize={5} borderDash={[6, 2]} ref={transformerRef} />
      )}
    </>
  );
}

export default URLImage;

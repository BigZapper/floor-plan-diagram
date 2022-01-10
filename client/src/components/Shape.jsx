import { memo } from 'react';
import { SHAPE_TYPES } from '../constants';
import { Circle } from './Circle';
import { Ellipse } from './Ellipse';
import { Rectangle } from './Rectangle';
import { Star } from './Star';

function Shape({
  shape,
  selected,
  moveShape,
  transformRectangleShape,
  transformCircleShape,
  transformEllipseShape,
  transformStarShape,
  onTap,
}) {
  if (shape.type === SHAPE_TYPES.RECT) {
    return (
      <Rectangle
        {...shape}
        selected={selected}
        moveShape={moveShape}
        transformRectangleShape={transformRectangleShape}
        onTap={onTap}
      />
    );
  } else if (shape.type === SHAPE_TYPES.CIRCLE) {
    return (
      <Circle
        {...shape}
        selected={selected}
        moveShape={moveShape}
        transformCircleShape={transformCircleShape}
        onTap={onTap}
      />
    );
  } else if (shape.type === SHAPE_TYPES.ELLIPSE) {
    return (
      <Ellipse
        {...shape}
        selected={selected}
        moveShape={moveShape}
        transformEllipseShape={transformEllipseShape}
        onTap={onTap}
      />
    );
  } else if (shape.type === SHAPE_TYPES.STAR) {
    return (
      <Star
        {...shape}
        selected={selected}
        moveShape={moveShape}
        transformStarShape={transformStarShape}
      />
    );
  }
  return null;
}
export default memo(Shape);

import React, { useRef, useState } from 'react';
import { DRAG_DATA_KEY, SHAPE_TYPES } from '../constants';
import SearchForm from './SearchForm';
import Widget from './Widget';

const handleDragStart = (event) => {
  const target = event.target;
  const type = target.dataset.shape;

  if (type) {
    // x,y coordinates of the mouse pointer relative to the position of the padding edge of the target node
    const offsetX = event.nativeEvent.offsetX;
    const offsetY = event.nativeEvent.offsetY;

    // dimensions of the node on the browser
    const clientWidth = target.clientWidth;
    const clientHeight = target.clientHeight;
    const src = target.src;

    const dragPayload = JSON.stringify({
      type,
      offsetX,
      offsetY,
      clientWidth,
      clientHeight,
      src,
    });

    if (event.nativeEvent.dataTransfer) {
      event.nativeEvent.dataTransfer.setData(DRAG_DATA_KEY, dragPayload);
    }
  }
};
function Palette() {
  const searchRef = useRef(null);
  const [isShowSeach, setIsShowSearch] = useState(false);

  function handleClickOutsideSearch(event) {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsShowSearch(false);
    } else {
      setIsShowSearch(true);
    }
  }
  document.addEventListener('mousedown', handleClickOutsideSearch);
  return (
    <aside className="palette">
      <div className="title-block">
        <div className="inline-block">
          <i className="fa fa-cog"></i>
          <h6>Shapes</h6>
        </div>
        <div className="inline-block">
          <i className="fa fa-file-image-o"></i>
          <div className="search mr-3 my-1" ref={searchRef}>
            <i
              className="fa fa-search"
              onClick={() => setIsShowSearch(true)}
            ></i>
            <SearchForm show={isShowSeach} />
          </div>
        </div>
      </div>
      <Widget title="Stardard" collapsed={false}>
        <div className="shapeblock">
          <div
            className="shape rectangle"
            data-shape={SHAPE_TYPES.RECT}
            draggable
            onDragStart={handleDragStart}
          />
          <div
            className="shape circle"
            data-shape={SHAPE_TYPES.CIRCLE}
            draggable
            onDragStart={handleDragStart}
          />
          <div
            className="shape ellipse"
            data-shape={SHAPE_TYPES.ELLIPSE}
            draggable
            onDragStart={handleDragStart}
          />
        </div>
      </Widget>

      <Widget title="General" collapsed={false}>
        <div className="shapeblock">
          <div
            className="shape star"
            data-shape={SHAPE_TYPES.STAR}
            draggable
            onDragStart={handleDragStart}
          >
            ☆
          </div>
        </div>
      </Widget>

      {/* <img
        className="image-insert"
        alt="insert"
        src="https://i.pinimg.com/originals/00/41/29/004129545f335d22367d0536015a87fe.png"
        draggable="true"
        data-shape={SHAPE_TYPES.IMG}
        onDragStart={handleDragStart}
      /> */}
    </aside>
  );
}

export default Palette;

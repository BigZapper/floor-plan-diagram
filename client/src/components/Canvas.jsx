import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Layer, Rect, Stage, Transformer } from 'react-konva';
import { AuthContext } from '../authContext/AuthContext';
import { BuildingContext } from '../buildingContext/BuildingContext';
import { DRAG_DATA_KEY, SHAPE_TYPES } from '../constants';
import { ShapeContext } from '../shapeContext/context';
import EditCanvasForm from './EditCanvasForm';
import Modal from './Modal';
import Shape from './Shape';
import URLImage from './URLImage';
import Loading from './Loading';
import useImage from 'use-image';
import FloorTab from './FloorTab';
import { getBuilding } from '../api';

function Canvas() {
  const stageRef = useRef(null);
  const { building } = useContext(BuildingContext);
  const {
    shapes,
    lockBackground,
    dispatch,
    createRectangle,
    createCircle,
    createEllipse,
    createStar,
    createImage,
    selectShapes,
    selected,
    clearSelection,
    moveShape,
    transformRectangleShape,
    transformCircleShape,
    transformEllipseShape,
    transformStarShape,
    transformImage,
    saveDiagram,
    createDiagram,
    deleteShape,
    reset,
    getFloors,
  } = useContext(ShapeContext);
  const [isOpenEditCanvas, setIsOpenEditCanvas] = useState(false);

  const { user, dispatch: userDispatch } = useContext(AuthContext);
  const { dispatch: buildingDispatch, listBuilding } =
    useContext(BuildingContext);

  const [img] = useImage(shapes?.shapes[0]?.src || null);

  const [nodesArray, setNodes] = React.useState([]);
  const trRef = React.useRef();
  const layerRef = React.useRef();
  const Konva = window.Konva;
  const selectionRectRef = React.useRef();
  const selection = React.useRef({
    visible: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  const handleDragOver = (event) => event.preventDefault();

  const handleSave = () => {
    saveDiagram();
  };
  const handleNew = async () => {
    dispatch({ type: 'RESET' });
    const res = await createDiagram(building);
    if (res) {
      setIsOpenEditCanvas(true);
    }
  };

  const handleDelete = () => {
    setNodes((prevState) =>
      prevState.filter((n) => !selected.includes(n.attrs.id))
    );
    deleteShape(selected);
  };

  const handleExit = () => {
    dispatch({ type: 'RESET' });
    buildingDispatch({ type: 'RESET' });
  };

  const handleDrop = useCallback(
    (event) => {
      if (!user.act.includes('add_shape')) {
        userDispatch({
          type: 'CHANGE_ACT_OBJ',
          payload: {
            act: [...user.act, 'add_shape'],
            obj: 'shape',
          },
        });
      }
      if (event.nativeEvent.dataTransfer) {
        const draggedData =
          event.nativeEvent.dataTransfer.getData(DRAG_DATA_KEY);
        if (draggedData) {
          const { offsetX, offsetY, type, clientHeight, clientWidth, src } =
            JSON.parse(draggedData);

          const currentStage = stageRef.current;
          if (currentStage) {
            currentStage.setPointersPositions(event);

            const coords = currentStage.getPointerPosition() || { x: 0, y: 0 };
            if (type === SHAPE_TYPES.RECT) {
              // rectangle x, y is at the top,left corner
              createRectangle({
                x: coords.x - offsetX,
                y: coords.y - offsetY,
              });
            } else if (type === SHAPE_TYPES.CIRCLE) {
              // circle x, y is at the center of the circle
              createCircle({
                x: coords.x - (offsetX - clientWidth / 2),
                y: coords.y - (offsetY - clientHeight / 2),
              });
            } else if (type === SHAPE_TYPES.ELLIPSE) {
              // circle x, y is at the center of the circle
              createEllipse({
                x: coords.x - (offsetX - clientWidth / 2),
                y: coords.y - (offsetY - clientHeight / 2),
              });
            } else if (type === SHAPE_TYPES.STAR) {
              // circle x, y is at the center of the circle
              createStar({
                x: coords.x - (offsetX - clientWidth / 2),
                y: coords.y - (offsetY - clientHeight / 2),
              });
            } else if (type === SHAPE_TYPES.IMG) {
              createImage({
                x: coords.x - (offsetX - clientWidth / 2),
                y: coords.y - (offsetY - clientHeight / 2),
                src,
              });
            }
          }
        }
      }
    },
    [
      user.act,
      userDispatch,
      createRectangle,
      createCircle,
      createEllipse,
      createStar,
      createImage,
    ]
  );

  const handleCloseCanvasForm = () => {
    setIsOpenEditCanvas(false);
    userDispatch({ type: 'RESET_OBJ_ACT' });
  };

  const handleChangeBuilding = (e) => {
    getFloors(e.target.value);
    getBuilding(e.target.value, user, buildingDispatch);
  };

  const updateSelectionRect = () => {
    const node = selectionRectRef.current;
    node.setAttrs({
      visible: selection.current.visible,
      x: Math.min(selection.current.x1, selection.current.x2),
      y: Math.min(selection.current.y1, selection.current.y2),
      width: Math.abs(selection.current.x1 - selection.current.x2),
      height: Math.abs(selection.current.y1 - selection.current.y2),
      fill: 'rgba(0, 161, 255, 0.3)',
      selector: true,
    });
    node.getLayer().batchDraw();
  };

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      clearSelection();
      trRef.current.nodes([]);
      setNodes([]);
    }
  };

  const oldPos = React.useRef(null);
  const onMouseDown = (e) => {
    const isElement = e.target.findAncestor('.elements-container');
    const isTransformer = e.target.findAncestor('Transformer');
    if (isElement || isTransformer) {
      return;
    }

    const pos = e.target.getStage().getPointerPosition();
    selection.current.visible = true;
    selection.current.x1 = pos.x;
    selection.current.y1 = pos.y;
    selection.current.x2 = pos.x;
    selection.current.y2 = pos.y;
    updateSelectionRect();
  };

  const onMouseMove = (e) => {
    if (!selection.current.visible) {
      return;
    }
    const pos = e.target.getStage().getPointerPosition();
    selection.current.x2 = pos.x;
    selection.current.y2 = pos.y;
    updateSelectionRect();
  };

  const onClickTap = (e) => {
    // if we are selecting with rect, do nothing
    // if (selection.current.visible) {
    //   return;
    // }
    // if (!Konva.listenClickTap) {
    //   return;
    // }
    let stage = e.target.getStage();
    let layer = layerRef.current;
    let tr = trRef.current;
    // if click on empty area - remove all selections
    if (
      e.target === stage ||
      (lockBackground && e.target.className === 'Image')
    ) {
      localStorage['selected'] = JSON.stringify([]);
      clearSelection();
      setNodes([]);
      tr.nodes([]);
      layer.draw();
      return;
    }
    // do nothing if clicked NOT on our rectangles
    // if (e.target.className === 'Transfomer') {
    //   return;
    // }
    // do we pressed shift or ctrl?
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = nodesArray.some((n) => n._id === e.target.parent._id);
    if (!metaPressed) {
      return;
    }
    if (metaPressed) {
      setNodes([e.target.parent]);
    } else if (!metaPressed && isSelected) {
      // if we pressed keys and node was selected
      // we need to remove it from selection:
      // const nodes = tr.nodes().slice(); // use slice to have new copy of array
      // remove node from array
      // nodes.splice(nodes.indexOf(e.target), 1);
      // Konva.listenMouseUp = false;
      setNodes((prevState) =>
        prevState.filter((n) => n._id !== e.target.parent._id)
      );
    } else if (metaPressed && !isSelected) {
      // add the node into selection
      // Konva.listenMouseUp = false;
      setNodes((prevState) => [...prevState, e.target.parent]);
    }
    layer.draw();
  };

  const onMouseUp = () => {
    oldPos.current = null;
    if (!selection.current.visible) {
      return;
    }
    const selBox = selectionRectRef.current.getClientRect();
    let elements = nodesArray.slice();
    layerRef.current.find('Group').forEach((elementNode) => {
      const elBox = elementNode.getClientRect();
      if (
        Konva.Util.haveIntersection(selBox, elBox) &&
        !elementNode.attrs.selector &&
        !elementNode.attrs.anchorSize &&
        elementNode.className !== 'Transformer' &&
        nodesArray.indexOf(elementNode) === -1
      ) {
        elements.push(elementNode);
      }
    });
    setNodes(elements);
    selection.current.visible = false;
    // disable click event
    updateSelectionRect();
  };

  useEffect(() => {
    if (nodesArray.length > 0) {
      trRef.current.nodes(nodesArray);
      selectShapes(nodesArray.map((n) => n.attrs.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodesArray]);

  useEffect(() => {
    setNodes([]);
  }, [shapes._id]);

  useEffect(() => {
    if (localStorage['selected']) {
      selectShapes(JSON.parse(localStorage['selected']));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main
      className="canvas"
      id="canvas"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {shapes.isLoading && <Loading />}
      {shapes.shapes[0]?.src ? !img?.complete ? <Loading /> : null : null}
      <Modal open={isOpenEditCanvas} onClose={handleCloseCanvasForm}>
        <EditCanvasForm data={shapes} onClose={handleCloseCanvasForm} />
      </Modal>
      <div className="navbar">
        <div className="buttons">
          <button className="btn new" onClick={handleNew}>
            <i className="fa fa-plus-circle"></i> New
          </button>
          <button className="btn save" onClick={handleSave}>
            <i className="fa fa-save"></i> Save
          </button>
          <button className="btn reset" onClick={() => reset()}>
            <i className="fa fa-refresh"></i> Reset
          </button>
          <button
            className={
              selected.length === 0 ? 'btn delete disabled' : 'btn delete'
            }
            onClick={handleDelete}
          >
            <i className="fa fa-trash-o"></i> Delete
          </button>
          <button className="btn back" onClick={handleExit}>
            <i className="fa fa-arrow-left"></i> Back
          </button>
        </div>
        <div className="buildingInfo">
          <select
            name="building"
            className="select-field"
            onChange={handleChangeBuilding}
          >
            <option value={''}>Choose building</option>
            {listBuilding.map((b) => (
              <option
                value={b._id}
                key={b._id}
                selected={building?._id === b._id}
              >
                {b.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Stage
        ref={stageRef}
        width={window.innerWidth - 550}
        height={window.innerHeight - 90}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onTouchStart={checkDeselect}
        onClick={onClickTap}
      >
        <Layer ref={layerRef}>
          {shapes.shapes &&
            shapes.shapes.map((s) =>
              s.type === 'image' ? (
                <URLImage
                  key={s.id}
                  image={s}
                  img={img}
                  selected={selected}
                  moveShape={moveShape}
                  transform={transformImage}
                  selectShape={(e) => setNodes([e])}
                  lockBackground={lockBackground}
                />
              ) : shapes.shapes[0].src ? (
                img?.complete ? (
                  <Shape
                    key={s.id}
                    shape={s}
                    selected={selected}
                    moveShape={moveShape}
                    transformRectangleShape={transformRectangleShape}
                    transformCircleShape={transformCircleShape}
                    transformEllipseShape={transformEllipseShape}
                    transformStarShape={transformStarShape}
                    onTap={onClickTap}
                  />
                ) : null
              ) : (
                <Shape
                  key={s.id}
                  shape={s}
                  selected={selected}
                  moveShape={moveShape}
                  transformRectangleShape={transformRectangleShape}
                  transformCircleShape={transformCircleShape}
                  transformEllipseShape={transformEllipseShape}
                  transformStarShape={transformStarShape}
                  onTap={onClickTap}
                />
              )
            )}
          <Transformer
            // ref={trRef.current[getKey]}
            borderDash={[6, 2]}
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
          <Rect fill="rgba(0,0,255,0.5)" ref={selectionRectRef} />
        </Layer>
      </Stage>
      <FloorTab />
    </main>
  );
}

export default Canvas;

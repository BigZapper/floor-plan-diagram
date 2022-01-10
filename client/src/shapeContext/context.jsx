import clamp from 'clamp';
import { nanoid } from 'nanoid';
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import {
  getShapes,
  createShapes,
  updateShapes,
  getShapesSpecified,
} from '../api';
import {
  createImageSuccess,
  createShapeSuccess,
  deleteShapeState,
  getShapesSuccess,
  updateShapeState,
} from './actions';
import { DEFAULTS, LIMITS, SHAPE_TYPES } from '../constants';
import shapeReducer from './reducer';
import { AuthContext } from '../authContext/AuthContext';

const ShapeContextDefaultData = {
  shapes: [],
  isLoading: true,
  error: null,
  selected: [],
  building: '',
  createRectangle: () => {
    //createRectangle
  },
  createCircle: () => {
    //createCircle
  },
  createEllipse: () => {
    //createEllipse
  },
  createStar: () => {
    //createStar
  },
  createImage: () => {
    //createImage
  },
  selectShape: () => {
    //selectShape
  },
  clearSelection: () => {
    //clearSelection
  },
  moveShape: () => {
    //moveShape
  },
  transformRectangleShape: () => {
    //transformRectangleShape
  },
  transformCircleShape: () => {
    //transformCircleShape
  },
  transformEllipseShape: () => {
    //transformEllipseShape
  },
  transformStarShape: () => {
    //transformStarShape
  },
  transformImage: () => {
    //transformImage
  },
  updateAttribute: () => {
    //updateAttribute
  },
  saveDiagram: () => {
    //saveDiagram
  },
  deleteShape: () => {
    //deleteShape
  },
  getFloors: () => {
    //getFloors
  },
  reset: () => {
    //reset
  },
};

export const ShapeContext = createContext(ShapeContextDefaultData);

const ShapeContextProvider = ({ children }) => {
  const [shapes, dispatch] = useReducer(
    shapeReducer,
    ShapeContextDefaultData.shapes
  );
  const { user, dispatch: userDispatch } = useContext(AuthContext);
  const [selected, setSelected] = useState([]);
  const [lockBackground, setLockBackground] = useState(true);
  const [groups, setGroups] = useState([]);
  const [projects, setProjects] = useState([]);
  // useEffect(() => {
  // getShapes(dispatch, user);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  // useEffect(() => {
  // setSelected(shapes.slice(-1)[0]?.id || "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    if (shapes._id) {
      const u = shapes.users.find((s) => {
        if (s.userId._id) {
          return s.userId._id === user?._id;
        } else return s.userId === user?._id;
      });
      if (u) {
        userDispatch({ type: 'CHANGE_ROLE', payload: u.role });
      }
    }
  }, [shapes?._id, shapes?.users, user?._id, userDispatch]);

  const createRectangle = ({ x, y }) => {
    const shape = {
      id: nanoid(),
      type: SHAPE_TYPES.RECT, // rect
      width: DEFAULTS.RECT.WIDTH, // 150
      height: DEFAULTS.RECT.HEIGHT, // 100
      fill: DEFAULTS.RECT.FILL, // #ffffff
      stroke: DEFAULTS.RECT.STROKE, // black
      color: '#7b7b7b',
      rotation: DEFAULTS.RECT.ROTATION, // 0
      x,
      y,
      radius: 0,
      floor: shapes._id,
    };
    if (shapes.shapes) {
      dispatch(createShapeSuccess(shape));
    }
  };

  const createCircle = ({ x, y }) => {
    let shape = {
      id: nanoid(),
      type: SHAPE_TYPES.CIRCLE, // circle
      height: DEFAULTS.CIRCLE.HEIGHT,
      width: DEFAULTS.CIRCLE.WIDTH,
      radius: DEFAULTS.CIRCLE.RADIUS, // 50
      fill: DEFAULTS.CIRCLE.FILL, // white
      stroke: DEFAULTS.CIRCLE.STROKE, // black
      color: '#7b7b7b',
      rotation: 0,
      x,
      y,
      floor: shapes._id,
    };
    if (shapes.shapes) {
      dispatch(createShapeSuccess(shape));
    }
  };

  const createEllipse = ({ x, y }) => {
    const shape = {
      id: nanoid(),
      type: SHAPE_TYPES.ELLIPSE, // circle,
      height: DEFAULTS.ELLIPSE.HEIGHT,
      width: DEFAULTS.ELLIPSE.WIDTH,
      radiusX: DEFAULTS.ELLIPSE.RADIUSY, // 50
      radiusY: DEFAULTS.ELLIPSE.RADIUSX, //100
      fill: DEFAULTS.ELLIPSE.FILL, // white
      stroke: DEFAULTS.ELLIPSE.STROKE, // black
      color: '#7b7b7b',
      x,
      y,
      floor: shapes._id,
    };

    if (shapes.shapes) {
      dispatch(createShapeSuccess(shape));
    }
  };

  const createStar = ({ x, y }) => {
    const shape = {
      id: nanoid(),
      type: SHAPE_TYPES.STAR, // circle
      fill: DEFAULTS.STAR.FILL, // white
      stroke: DEFAULTS.STAR.STROKE, // black
      numPoints: 5,
      innerRadius: 10,
      outerRadius: 20,
      width: 50,
      height: 50,
      x,
      y,
      floor: shapes._id,
    };

    if (shapes.shapes) {
      dispatch(createShapeSuccess(shape));
    }
  };

  const createImage = ({ x, y, width, height, src }) => {
    const shape = {
      id: nanoid(),
      type: SHAPE_TYPES.IMG,
      height,
      width,
      src,
      x,
      y,
      floor: shapes._id,
    };

    dispatch(createImageSuccess(shape));
  };

  const selectShape = (id) => {
    if (selected.indexOf(id) === -1) {
      setSelected((prevState) => [...prevState, id]);
    }
  };

  const selectShapes = (arr) => {
    setSelected(arr);
  };

  const clearSelection = () => {
    setSelected([]);
  };

  const deleteShape = (id) => {
    if (!user.act.includes('delete_shape')) {
      userDispatch({
        type: 'CHANGE_ACT_OBJ',
        payload: {
          act: [...user.act, 'delete_shape'],
          obj: 'shape',
        },
      });
    }
    dispatch(deleteShapeState(id));
  };

  const moveShape = (id, event) => {
    if (!user.act.includes('add_shape')) {
      if (!user.act.includes('edit_shape')) {
        userDispatch({
          type: 'CHANGE_ACT_OBJ',
          payload: {
            act: [...user.act, 'edit_shape'],
            obj: 'shape',
          },
        });
      }
    }
    let shape = shapes.shapes.find((s) => s.id === id);
    if (shape) {
      shape.x = event.target.x();
      shape.y = event.target.y();
    }

    dispatch(updateShapeState(shape));
  };

  const transformRectangleShape = (node, id, event) => {
    if (!user.act.includes('add_shape')) {
      if (!user.act.includes('edit_shape')) {
        userDispatch({
          type: 'CHANGE_ACT_OBJ',
          payload: {
            act: [...user.act, 'edit_shape'],
            obj: 'shape',
          },
        });
      }
    }
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    let shape = shapes.shapes.find((s) => s.id === id);

    if (shape) {
      shape.x = node.x();
      shape.y = node.y();

      shape.rotation = node.rotation();

      shape.width = clamp(
        node.width() * scaleX,
        LIMITS.RECT.MIN,
        LIMITS.RECT.MAX
      );
      shape.height = clamp(
        node.height() * scaleY,
        LIMITS.RECT.MIN,
        LIMITS.RECT.MAX
      );

      dispatch(updateShapeState(shape));
    }
  };

  const transformCircleShape = (node, id, event) => {
    if (!user.act.includes('add_shape')) {
      if (!user.act.includes('edit_shape')) {
        userDispatch({
          type: 'CHANGE_ACT_OBJ',
          payload: {
            act: [...user.act, 'edit_shape'],
            obj: 'shape',
          },
        });
      }
    }
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    let shape = shapes.shapes.find((s) => s.id === id);

    if (shape) {
      shape.x = node.x();
      shape.y = node.y();

      shape.rotation = node.rotation();

      shape.width = clamp(
        node.width() * scaleX,
        LIMITS.RECT.MIN,
        LIMITS.RECT.MAX
      );
      shape.height = clamp(
        node.height() * scaleY,
        LIMITS.RECT.MIN,
        LIMITS.RECT.MAX
      );

      shape.radius = clamp(
        (node.width() * scaleX) / 2,
        LIMITS.CIRCLE.MIN,
        LIMITS.CIRCLE.MAX
      );

      dispatch(updateShapeState(shape));
    }
  };

  const transformEllipseShape = (node, id, event) => {
    if (!user.act.includes('add_shape')) {
      if (!user.act.includes('edit_shape')) {
        userDispatch({
          type: 'CHANGE_ACT_OBJ',
          payload: {
            act: [...user.act, 'edit_shape'],
            obj: 'shape',
          },
        });
      }
    }
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    let shape = shapes.shapes.find((s) => s.id === id);

    if (shape) {
      shape.x = node.x();
      shape.y = node.y();

      shape.rotation = node.rotation();

      shape.skewX = node.attrs.skewX;

      shape.width = clamp(
        node.width() * scaleX,
        LIMITS.RECT.MIN,
        LIMITS.RECT.MAX
      );
      shape.height = clamp(
        node.height() * scaleY,
        LIMITS.RECT.MIN,
        LIMITS.RECT.MAX
      );

      shape.radiusX = clamp(
        node.width() * scaleX,
        LIMITS.RECT.MIN,
        LIMITS.RECT.MAX
      );
      shape.radiusY = clamp(
        node.height() * scaleY,
        LIMITS.RECT.MIN,
        LIMITS.RECT.MAX
      );

      dispatch(updateShapeState(shape));
    }
  };

  const transformImage = (node, id) => {
    if (!user.act.includes('add_shape')) {
      if (!user.act.includes('edit_shape')) {
        userDispatch({
          type: 'CHANGE_ACT_OBJ',
          payload: {
            act: [...user.act, 'edit_shape'],
            obj: 'shape',
          },
        });
      }
    }
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    let shape = shapes.shapes.find((s) => s.id === id);

    if (shape) {
      shape.x = node.attrs.x;
      shape.y = node.attrs.y;

      shape.rotation = node.rotation();

      shape.width = clamp(
        node.width() * scaleX,
        LIMITS.RECT.MIN,
        LIMITS.RECT.MAX
      );
      shape.height = clamp(
        node.height() * scaleY,
        LIMITS.RECT.MIN,
        LIMITS.RECT.MAX
      );

      dispatch(updateShapeState(shape));
    }
  };

  const transformStarShape = (node, id, event) => {
    if (!user.act.includes('add_shape')) {
      if (!user.act.includes('edit_shape')) {
        userDispatch({
          type: 'CHANGE_ACT_OBJ',
          payload: {
            act: [...user.act, 'edit_shape'],
            obj: 'shape',
          },
        });
      }
    }
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    let shape = shapes.shapes.find((s) => s.id === id);

    if (shape) {
      shape.x = node.x();
      shape.y = node.y();

      shape.rotation = node.rotation();

      shape.width = clamp(
        node.width() * scaleX,
        LIMITS.RECT.MIN,
        LIMITS.RECT.MAX
      );
      shape.height = clamp(
        node.height() * scaleY,
        LIMITS.RECT.MIN,
        LIMITS.RECT.MAX
      );
      shape.outerRadius = clamp(
        node.outerRadius() * scaleX,
        LIMITS.RECT.MIN,
        LIMITS.RECT.MAX
      );
      shape.innerRadius = clamp(
        node.innerRadius() * scaleY,
        LIMITS.RECT.MIN,
        LIMITS.RECT.MAX
      );

      dispatch(updateShapeState(shape));
    }
  };

  const updateAttribute = (attr, value) => {
    if (!user.act.includes('add_shape')) {
      if (!user.act.includes('edit_shape')) {
        userDispatch({
          type: 'CHANGE_ACT_OBJ',
          payload: {
            act: [...user.act, 'edit_shape'],
            obj: 'shape',
          },
        });
      }
    }
    let shape = shapes.shapes.find((s) => s.id === selected[0]);
    if (shape) {
      shape[attr] = value;
    }

    dispatch(updateShapeState(shape));
  };

  const updateGroups = (arr, group) => {
    console.log(arr);
    if (!user.act.includes('add_shape')) {
      if (!user.act.includes('edit_shape')) {
        userDispatch({
          type: 'CHANGE_ACT_OBJ',
          payload: {
            act: [...user.act, 'edit_shape'],
            obj: 'shape',
          },
        });
      }
    }
    let shapeArr = shapes.shapes.filter((s1) =>
      arr.some((s2) => s1.id === s2.id)
    );
    shapeArr.forEach((s) => (s.group = group));
    shapeArr.forEach((s) => dispatch(updateShapeState(s)));
  };

  const updateProjects = (arr, project) => {
    if (!user.act.includes('add_shape')) {
      if (!user.act.includes('edit_shape')) {
        userDispatch({
          type: 'CHANGE_ACT_OBJ',
          payload: {
            act: [...user.act, 'edit_shape'],
            obj: 'shape',
          },
        });
      }
    }
    let shapeArr = shapes.shapes.filter((s1) =>
      arr.some((s2) => s1.id === s2.id)
    );
    shapeArr.forEach((s) => (s.project = project));
    shapeArr.forEach((s) => dispatch(updateShapeState(s)));
  };

  const saveDiagram = (data = shapes, notDispatch) => {
    if (data.shapes) {
      let submitData = data;
      submitData.users.forEach((u) => {
        if (u.userId._id) {
          u.userId = u.userId._id;
        }
      });
      if (notDispatch) {
        updateShapes(submitData, data._id, user);
      } else updateShapes(submitData, data._id, user, dispatch);
    }
  };

  const createDiagram = async (building) => {
    const s = await createShapes(user.token, building);
    if (s.shapes) {
      dispatch(getShapesSuccess(s));
      return true;
    }
    return false;
  };

  const getFloors = (building) => {
    getShapes(dispatch, user, building);
  };
  const reset = () => {
    getShapesSpecified(shapes._id, user, dispatch);
  };
  const shapeContextDynamicData = {
    shapes,
    lockBackground,
    updateGroups,
    updateProjects,
    setLockBackground,
    selected,
    dispatch,
    createRectangle,
    createCircle,
    createEllipse,
    createStar,
    createImage,
    selectShape,
    selectShapes,
    clearSelection,
    moveShape,
    transformRectangleShape,
    transformCircleShape,
    transformEllipseShape,
    transformStarShape,
    transformImage,
    updateAttribute,
    saveDiagram,
    createDiagram,
    deleteShape,
    getFloors,
    reset,
    groups,
    setGroups,
    projects,
    setProjects,
  };
  return (
    <ShapeContext.Provider value={shapeContextDynamicData}>
      {children}
    </ShapeContext.Provider>
  );
};

export default ShapeContextProvider;

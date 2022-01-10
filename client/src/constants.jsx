export const SHAPE_TYPES = {
  RECT: "rect",
  CIRCLE: "circle",
  ELLIPSE: "ellipse",
  STAR: "star",
  IMG: "image",
};

export const DEFAULTS = {
  RECT: {
    STROKE: "#000000",
    FILL: "#ffffff",
    WIDTH: 100,
    HEIGHT: 50,
    ROTATION: 0,
  },
  CIRCLE: {
    STROKE: "#000000",
    FILL: "#ffffff",
    WIDTH: 50,
    HEIGHT: 50,
    RADIUS: 25,
  },
  ELLIPSE: {
    STROKE: "#000000",
    FILL: "#ffffff",
    WIDTH: 100,
    HEIGHT: 50,
    RADIUSX: 25,
    RADIUSY: 50,
  },
  STAR: {
    STROKE: "#000000",
    FILL: "transparent",
    RADIUSX: 50,
    RADIUSY: 100,
  },
};

export const LIMITS = {
  RECT: {
    MAX: 1000,
    MIN: 10,
  },
  CIRCLE: {
    MAX: 500,
    MIN: 5,
  },
  STAR: {
    MAX: 500,
    MIN: 5,
  },
  ELLIPSE: {
    MAX: 500,
    MIN: 5,
  },
};

export const DRAG_DATA_KEY = "__drag_data_payload__";

export const GET_SHAPES_START = "GET_SHAPE_START";
export const GET_SHAPES_SUCCESS = "GET_SHAPES_SUCCESS";
export const GET_SHAPES_FAIL = "GET_SHAPES_SUCCESS";

export const CREATE_SHAPE_START = "GET_SHAPE_START";
export const CREATE_SHAPE_SUCCESS = "CREATE_SHAPE_SUCCESS";
export const CREATE_SHAPE_FAIL = "CREATE_SHAPE_SUCCESS";

export const CREATE_IMAGE_SUCCESS = "CREATE_IMAGE_SUCCESS";

export const UPDATE_SHAPE = "UPDATE_SHAPE";
export const DELETE_SHAPE = "DELETE_SHAPE";

export const UPDATE_SHAPES_START = "UPDATE_SHAPES_START";
export const UPDATE_SHAPES_SUCCESS = "UPDATE_SHAPES_SUCCESS";
export const UPDATE_SHAPES_FAIL = "UPDATE_SHAPES_FAIL";

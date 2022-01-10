import {
  CREATE_IMAGE_SUCCESS,
  CREATE_SHAPE_SUCCESS,
  DELETE_SHAPE,
  GET_SHAPES_FAIL,
  GET_SHAPES_START,
  GET_SHAPES_SUCCESS,
  UPDATE_SHAPE,
  UPDATE_SHAPES_SUCCESS,
} from "../constants";

export const getShapesStart = () => ({
  type: GET_SHAPES_START,
});

export const getShapesSuccess = (shapes) => ({
  type: GET_SHAPES_SUCCESS,
  payload: shapes,
});

export const getShapesFail = (error) => ({
  type: GET_SHAPES_FAIL,
  payload: error,
});

export const createShapeSuccess = (shape) => ({
  type: CREATE_SHAPE_SUCCESS,
  payload: shape,
});

export const createImageSuccess = (shape) => ({
  type: CREATE_IMAGE_SUCCESS,
  payload: shape,
});

export const updateShapeState = (shape) => ({
  type: UPDATE_SHAPE,
  payload: shape,
});

export const updateShapesSuccess = (shapes) => ({
  type: UPDATE_SHAPES_SUCCESS,
  payload: shapes,
});

export const deleteShapeState = (id) => ({
  type: DELETE_SHAPE,
  payload: id,
});

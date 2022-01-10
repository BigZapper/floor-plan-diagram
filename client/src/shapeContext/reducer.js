import {
  CREATE_IMAGE_SUCCESS,
  CREATE_SHAPE_SUCCESS,
  DELETE_SHAPE,
  GET_SHAPES_FAIL,
  GET_SHAPES_START,
  GET_SHAPES_SUCCESS,
  UPDATE_SHAPE,
  UPDATE_SHAPES_SUCCESS,
} from '../constants';

const shapeReducer = (state, action) => {
  switch (action.type) {
    case CREATE_SHAPE_SUCCESS:
      return { ...state, shapes: [...state.shapes, action.payload] };

    case CREATE_IMAGE_SUCCESS:
      return {
        ...state,
        shapes: [
          action.payload,
          ...state.shapes.filter((s) => s.type !== 'image'),
        ],
      };

    case GET_SHAPES_START:
      return { isLoading: true, shapes: [] };

    case GET_SHAPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        shapes: action.payload.shapes || [],
        _id: action.payload._id || '',
        title: action.payload.title || '',
        users: action.payload.users || [],
        building: action.payload.building || '',
      };

    case GET_SHAPES_FAIL:
      return {
        isLoading: false,
        error: action.payload,
        shapes: [],
        title: '',
        users: [],
      };

    case UPDATE_SHAPE:
      return {
        ...state,
        shapes: state.shapes.map((x) =>
          x.id === action.payload.id ? action.payload : x
        ),
      };

    case DELETE_SHAPE:
      return {
        ...state,
        shapes: state.shapes.filter((s) => !action.payload.includes(s.id)),
      };

    case UPDATE_SHAPES_SUCCESS:
      return {
        ...state,
        shapes: action.payload,
      };

    case 'RESET':
      return {
        shapes: [],
      };

    default:
      return state;
  }
};

export default shapeReducer;

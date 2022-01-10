const BuildingReducer = (state, action) => {
  switch (action.type) {
    case 'GET_BUILDING_START':
      return {
        ...state,
        building: null,
        isFetching: true,
        error: false,
      };
    case 'GET_BUILDING_SUCCESS':
      return {
        ...state,
        building: action.payload,
        isFetching: false,
        error: false,
      };
    case 'GET_BUILDING_FAILURE':
      return {
        ...state,
        building: null,
        isFetching: false,
        error: action.payload,
      };
    case 'GET_LIST_BUILDING_START':
      return {
        ...state,
        isFetching: true,
        listBuilding: [],
      };
    case 'GET_LIST_BUILDING_SUCCESS':
      return {
        ...state,
        isFetching: false,
        listBuilding: action.payload,
      };
    case 'GET_LIST_BUILDING_ERROR':
      return {
        ...state,
        isFetching: false,
        listBuilding: [],
        error: action.payload,
      };
    case 'DELETE':
      return {
        ...state,
        listBuilding: state.listBuilding.filter(
          (b) => b._id !== action.payload
        ),
      };
    case 'RESET':
      return {};

    default:
      return state;
  }
};

export default BuildingReducer;

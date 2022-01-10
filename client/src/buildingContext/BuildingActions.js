export const GetBuildingStart = () => ({
  type: 'GET_BUILDING_START',
});

export const GetBuildingSuccess = (building) => ({
  type: 'GET_BUILDING_SUCCESS',
  payload: building,
});

export const GetBuildingFailure = (error) => ({
  type: 'GET_BUILDING_FAILURE',
  payload: error,
});

export const GetListBuildingStart = () => ({
  type: 'GET_LIST_BUILDING_START',
});
export const GetListBuildingSuccess = (list) => ({
  type: 'GET_LIST_BUILDING_SUCCESS',
  payload: list,
});

export const GetListBuildingFail = (error) => ({
  type: 'GET_LIST_BUILDING_FAIL',
  payload: error,
});

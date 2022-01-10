import {
  getShapesFail,
  getShapesStart,
  getShapesSuccess,
} from './shapeContext/actions';
import {
  LoginStart,
  LoginSuccess,
  LoginFailure,
} from './authContext/AuthActions';
import axios from 'axios';
import {
  GetBuildingFailure,
  GetBuildingStart,
  GetBuildingSuccess,
  GetListBuildingFail,
  GetListBuildingStart,
  GetListBuildingSuccess,
} from './buildingContext/BuildingActions';

export const getShapes = async (dispatch, user, building) => {
  dispatch(getShapesStart());
  try {
    const { data } = await axios.get(
      'http://localhost:5000/api/floors/lastest/' + building,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    dispatch(getShapesSuccess(data));
  } catch (error) {
    dispatch(getShapesFail(error.message));
    alert(error);
  }
};

export const getShapesSpecified = async (id, user, dispatch) => {
  dispatch(getShapesStart());
  try {
    const { data } = await axios.get('http://localhost:5000/api/floors/' + id, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        sub: user.sub,
      },
    });
    dispatch(getShapesSuccess(data));
  } catch (error) {
    dispatch(getShapesFail(error.message));
  }
};

export const createShape = async (shape) => {
  try {
    const { data } = await axios.post(
      'http://localhost:5000/api/floors/',
      shape
    );
    return data.shape;
  } catch (error) {
    alert(error.message);
  }
};

export const createShapes = async (token, building) => {
  try {
    const { data } = await axios.post(
      'http://localhost:5000/api/floors/',
      {
        building: building._id,
        admin: building.admin,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    alert(error.response.data.message);
    return error.response.data.message;
  }
};

export const updateShapes = async (shapes, id, user, dispatch) => {
  dispatch && dispatch(getShapesStart());
  try {
    const { data } = await axios.put(
      'http://localhost:5000/api/floors/' + id,
      shapes,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          sub: user.sub,
          act: user.act,
          obj: user.obj,
        },
      }
    );
    dispatch && dispatch(getShapesSuccess(data));
  } catch (error) {
    alert(error.response.data.message);
    dispatch && dispatch(getShapesFail(error.response.data.message));
  }
};

export const loginCall = async (userCredential, dispatch) => {
  dispatch(LoginStart());
  try {
    const res = await axios.post(
      `http://localhost:5000/api/users/signin`,
      userCredential
    );
    dispatch(LoginSuccess({ ...res.data, sub: '', obj: '', act: [] }));
  } catch (error) {
    dispatch(LoginFailure(error));
  }
};

export const registerCall = async (userCredential, dispatch) => {
  dispatch(LoginStart);
  try {
    const res = await axios.post(
      `http://localhost:5000/api/users/register`,
      userCredential
    );
    dispatch(LoginSuccess(res.data));
  } catch (error) {
    dispatch(LoginFailure(error));
  }
};

export const updateBuilding = async (building, dispatch, user) => {
  try {
    await axios.put(
      `http://localhost:5000/api/buildings/${building._id}`,
      building,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const getBuilding = async (id, user, dispatch) => {
  dispatch(GetBuildingStart());
  try {
    const { data } = await axios.get(
      'http://localhost:5000/api/buildings/' + id,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    dispatch(GetBuildingSuccess(data));
  } catch (error) {
    dispatch(GetBuildingFailure(error));
  }
};

export const createBuilding = async (title, user, dispatch) => {
  try {
    const { data } = await axios.post(
      'http://localhost:5000/api/buildings/',
      { title },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    return data;
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const getBuildingList = async (user, dispatch) => {
  dispatch(GetListBuildingStart());
  try {
    const { data } = await axios.get('http://localhost:5000/api/buildings/', {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    dispatch(GetListBuildingSuccess(data));
  } catch (error) {
    alert(error.response.message);
    GetListBuildingFail(error.response.message);
  }
};

export const deleteBuilding = async (id, user, dispatch) => {
  try {
    dispatch({ type: 'DELETE', payload: id });
    await axios.delete('http://localhost:5000/api/buildings/' + id, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const getAllUsers = async (user) => {
  try {
    const { data } = await axios.get('http://localhost:5000/api/users/', {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    return data;
  } catch (error) {
    alert(error.response.data.message);
    return null;
  }
};

export const addGroup = async (id, shape, user) => {
  try {
    await axios.put(
      `http://localhost:5000/api/groups/${id}/add_shape`,
      {
        shape,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          sub: user.sub,
        },
      }
    );
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const addProject = async (id, shape, user) => {
  try {
    await axios.put(
      `http://localhost:5000/api/projects/${id}/add_shape`,
      {
        shape,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          sub: user.sub,
        },
      }
    );
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const addShape = async (id, shape, user) => {
  try {
    const { data } = await axios.put(
      `http://localhost:5000/api/shapes/${id}`,
      {
        shape,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          sub: user.sub,
        },
      }
    );
    return data;
  } catch (error) {
    alert(error.response.data.message);
    return null;
  }
};

export const addShapestoGroup = async (id, shapes, user) => {
  try {
    await axios.put(
      `http://localhost:5000/api/groups/${id}/add_shapes`,
      {
        shapes,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          sub: user.sub,
        },
      }
    );
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const removeShapeFromGroup = async (id, shape, user) => {
  try {
    const { data } = await axios.put(
      `http://localhost:5000/api/groups/${id}/remove_shape`,
      {
        shape,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          sub: user.sub,
        },
      }
    );
    console.log(data);
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const removeShapesFromGroup = async (groups, shapes, user) => {
  try {
    const { data } = await axios.put(
      `http://localhost:5000/api/groups/remove_shapes`,
      {
        groups,
        shapes,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          sub: user.sub,
        },
      }
    );
    console.log(data);
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const removeShapesFromProject = async (projects, shapes, user) => {
  try {
    const { data } = await axios.put(
      `http://localhost:5000/api/projects/remove_shapes`,
      {
        projects,
        shapes,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          sub: user.sub,
        },
      }
    );
    console.log(data);
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const addShapestoProject = async (id, shapes, user) => {
  try {
    await axios.put(
      `http://localhost:5000/api/projects/${id}/add_shapes`,
      {
        shapes,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          sub: user.sub,
        },
      }
    );
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const removeShapeFromProject = async (id, shape, user) => {
  try {
    const { data } = await axios.put(
      `http://localhost:5000/api/projects/${id}/remove_shape`,
      {
        shape,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          sub: user.sub,
        },
      }
    );
    console.log(data);
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const getAllGroups = async (user) => {
  try {
    const { data } = await axios.get(`http://localhost:5000/api/groups/`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        sub: user.sub,
      },
    });
    return data;
  } catch (error) {
    alert(error);
    return null;
  }
};

export const createGroup = async (group, user) => {
  try {
    const { data } = await axios.post(
      'http://localhost:5000/api/groups/',
      { title: group },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          sub: user.sub,
        },
      }
    );
    return data;
  } catch (error) {
    alert(error);
    return null;
  }
};

export const createProject = async (project, user) => {
  try {
    const { data } = await axios.post(
      'http://localhost:5000/api/projects/',
      { project },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          sub: user.sub,
        },
      }
    );
    return data;
  } catch (error) {
    alert(error);
    return null;
  }
};

export const search = async (keyword, user) => {
  try {
    const { data } = await axios.get(
      'http://localhost:5000/api/groups/search/' + keyword,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          sub: user.sub,
        },
      }
    );
    return data;
  } catch (error) {
    alert(error);
    return null;
  }
};

export const findShapesByUser = async (userId, user) => {
  try {
    const { data } = await axios.get(
      'http://localhost:5000/api/shapes/user/' + userId,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          sub: user.sub,
        },
      }
    );
    return data;
  } catch (error) {
    alert(error);
    return null;
  }
};

const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        user: null,
        isFetching: true,
        error: false,
      };
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case 'LOGIN_FAILURE':
      return {
        user: null,
        isFetching: false,
        error: action.payload,
      };
    case 'CHANGE_ROLE':
      return {
        ...state,
        user: {
          ...state.user,
          sub: action.payload,
          act: [],
          obj: '',
        },
      };
    case 'CHANGE_ACT_OBJ':
      return {
        ...state,
        user: {
          ...state.user,
          act: action.payload.act,
          obj: action.payload.obj,
        },
      };
    case 'RESET_OBJ_ACT':
      return {
        ...state,
        user: {
          ...state.user,
          act: [],
          obj: '',
        },
      };
    case 'LOGOUT':
      return {
        user: null,
      };

    default:
      return state;
  }
};

export default AuthReducer;

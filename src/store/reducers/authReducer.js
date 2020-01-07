const initState = {};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case "LOGIN_ERROR":
      return {
        ...state,
        authError: action.error.message
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        authError: null
      };
    case "LOGOUT_ERROR":
      return {
        ...state,
        authError: action.error.message
      };
    case "LOGOUT_SUCCESS":
      return {
        ...state,
        authError: null
      };
    case "SIGNUP_ERROR":
      return {
        ...state,
        authError: action.error.message
      };
    case "SIGNUP_SUCCESS":
      return {
        ...state,
        authError: null
      };
    case "EDIT_PROFILE_SUCCESS":
      return {
        ...state,
        authError: null
      };
    default:
      return state;
  }
};

export default authReducer;

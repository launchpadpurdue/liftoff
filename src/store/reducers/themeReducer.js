import { blue, red } from "@material-ui/core/colors";

const initState = {
  palette: {
    primary: blue,
    secondary: red,
    type: "light"
  }
};

const themeReducer = (state = initState, action) => {
  switch (action.type) {
    case "SET_THEME":
      const new_state = { ...state };
      new_state.palette.type = action.theme;
      return new_state;
    default:
      return state;
  }
};

export default themeReducer;

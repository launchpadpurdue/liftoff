import { blue, red } from "@material-ui/core/colors";

const initState = {
  theme: {
    palette: {
      primary: blue,
      secondary: red,
      type: "light"
    }
  }
};

const preferenceReducer = (state = initState, action) => {
  switch (action.type) {
    case "SET_THEME":
      const new_state = { ...state };
      new_state.theme.palette.type = action.theme;
      return new_state;
    default:
      return state;
  }
};

export default preferenceReducer;

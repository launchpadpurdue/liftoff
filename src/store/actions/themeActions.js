export const toggleTheme = () => {
  return (dispatch, getState, { getFirebase }) => {
    // TODO: Do async code
    dispatch({ type: "TOGGLE_THEME" });
  };
};

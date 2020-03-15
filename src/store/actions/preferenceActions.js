export const setTheme = theme => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const uid = getFirebase().auth().currentUser.uid;
    const firestore = getFirestore();
    firestore
      .collection("users")
      .doc(uid)
      .update({ "preferences.theme": theme })
      .then(() => dispatch({ type: "SET_THEME", theme }));
  };
};

import { SnackbarVariants } from "../../constants";
import { enqueueSnackbar } from "./notificationActions";

export const setTheme = theme => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const uid = getFirebase().auth().currentUser.uid;
    const firestore = getFirestore();
    firestore
      .collection("users")
      .doc(uid)
      .update({ "preferences.theme": theme })
      .then(() => {
        dispatch({ type: "SET_THEME", theme });
        dispatch(
          enqueueSnackbar({
            message: "Successfully Updated Theme",
            options: SnackbarVariants.SUCCESS
          })
        );
      })
      .catch(error => {
        dispatch(
          enqueueSnackbar({
            message: "Failed to Update Theme",
            options: SnackbarVariants.ERROR
          })
        );
      });
  };
};

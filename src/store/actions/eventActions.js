import { enqueueSnackbar } from "./notificationActions";
import { SnackbarVariants } from "../../constants";

export const createEvent = eventDetails => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    firestore
      .collection("events")
      .add(eventDetails)
      .then(() => {
        dispatch({ type: "EVENT_CREATION_SUCCESS" });
        dispatch(
          enqueueSnackbar({
            message: "Successfully created event",
            options: SnackbarVariants.SUCCESS
          })
        );
      })
      .catch(error => {
        dispatch({ type: "EVENT_CREATION_ERROR", error });
        dispatch(
          enqueueSnackbar({
            message: "Failed to Create Event",
            options: SnackbarVariants.ERROR
          })
        );
      });
  };
};

export const editEvent = (eventDetails, eventID) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    firestore
      .collection("events")
      .doc(eventID)
      .set(eventDetails, { merge: true })
      .then(() => {
        dispatch({ type: "EVENT_EDIT_SUCCESS" });
        dispatch(
          enqueueSnackbar({
            message: "Successfully Updated Event",
            options: SnackbarVariants.SUCCESS
          })
        );
      })
      .catch(error => {
        dispatch({ type: "EVENT_EDIT_ERROR", error });
        dispatch(
          enqueueSnackbar({
            message: "Failed to Update Event",
            options: SnackbarVariants.ERROR
          })
        );
      });
  };
};

export const deleteEvent = eventID => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    firestore
      .collection("events")
      .doc(eventID)
      .delete()
      .then(() => {
        dispatch({ type: "EVENT_DELETION_SUCCESS" });
        dispatch(
          enqueueSnackbar({
            message: "Successfully Deleted Event",
            options: SnackbarVariants.SUCCESS
          })
        );
      })
      .catch(error => {
        dispatch({ type: "EVENT_DELETION_ERROR", error });
        dispatch(
          enqueueSnackbar({
            message: "Failed to Delete Event",
            options: SnackbarVariants.ERROR
          })
        );
      });
  };
};

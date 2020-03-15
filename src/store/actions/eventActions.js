export const createEvent = eventDetails => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    firestore
      .collection("events")
      .add(eventDetails)
      .then(() => dispatch({ type: "EVENT_CREATION_SUCCESS" }))
      .catch(error => dispatch({ type: "EVENT_CREATION_ERROR", error }));
  };
};

export const deleteEvent = eventID => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    firestore
      .collection("events")
      .doc(eventID)
      .delete()
      .then(() => dispatch({ type: "EVENT_DELETION_SUCCESS" }))
      .catch(error => dispatch({ type: "EVENT_DELETEION_ERROR", error }));
  };
};

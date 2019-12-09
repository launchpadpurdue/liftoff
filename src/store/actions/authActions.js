export const signIn = credentials => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    firebase
      .auth()
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(() => dispatch({ type: "LOGIN_SUCCESS" }))
      .catch(error => dispatch({ type: "LOGIN_ERROR", error }));
  };
};

export const signOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    firebase
      .logout()
      .then(() => dispatch({ type: "LOGOUT_SUCCESS" }))
      .catch(error => dispatch({ type: "LOGOUT_ERROR", error }));
  };
};

export const signUp = accountDetails => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    let credentials = {
      email: accountDetails.email,
      password: accountDetails.password
    };

    let profile = {
      firstName: accountDetails.firstName,
      lastName: accountDetails.lastName,
      initials:
        accountDetails.firstName[0].toUpperCase() +
        accountDetails.lastName[0].toUpperCase(),
      profilePicture: ""
    };

    let userImage = accountDetails.image;

    firebase
      .createUser(credentials, profile)
      .then(() => {
        let uid = firebase.auth().currentUser.uid;
        if (userImage)
          return firebase
            .uploadFile(`/userImages/${uid}`, userImage, null, {
              name: "profilePicture"
            })
            .then(() =>
              firebase
                .storage()
                .ref()
                .child(`/userImages/${uid}/profilePicture`)
                .getDownloadURL()
                .then(downloadURL =>
                  firestore
                    .collection("users")
                    .doc(uid)
                    .update({ profilePicture: downloadURL })
                )
            );
      })
      .then(() => dispatch({ type: "SIGNUP_SUCCESS" }))
      .catch(error => dispatch({ type: "SIGNUP_ERROR", error }));
  };
};

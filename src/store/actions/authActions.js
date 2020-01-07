export const signIn = credentials => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    firebase
      .login(credentials)
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
    const functions = firebase.functions();

    const getRole = functions.httpsCallable("getRole");

    let credentials = {
      email: accountDetails.email,
      password: accountDetails.password
    };

    // accountDetails.role = "Mentor";

    let profile = {
      firstName: accountDetails.firstName,
      lastName: accountDetails.lastName,
      initials:
        accountDetails.firstName[0].toUpperCase() +
        accountDetails.lastName[0].toUpperCase(),
      profilePicture: "",
      skills: accountDetails.skills,
      description: accountDetails.description,
      preferences: { theme: "light" }
    };

    let userImage = accountDetails.image;

    getRole({ signUpCode: accountDetails.signUpCode })
      .then(result => {
        profile.role = result.data.role;
        return firebase.createUser(credentials, profile).then(() => {
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
        });
      })
      .then(() => dispatch({ type: "SIGNUP_SUCCESS" }))
      .catch(error => dispatch({ type: "SIGNUP_ERROR", error }));
  };
};

export const updateProfile = newProfile => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const uid = firebase.auth().currentUser.uid;
    const firestore = getFirestore();
    const storage = firebase.storage().ref();

    const updateInfo = {
      firstName: newProfile.firstName,
      lastName: newProfile.lastName,
      initials:
        newProfile.firstName[0].toUpperCase() +
        newProfile.lastName[0].toUpperCase(),
      description: newProfile.description,
      skills: newProfile.skills
    };

    let newImage = newProfile.image;

    firestore
      .collection("users")
      .doc(uid)
      .update(updateInfo)
      .then(() => {
        if (newImage) {
          return firebase
            .uploadFile(`/userImages/${uid}`, newProfile.image, null, {
              name: "profilePicture"
            })
            .then(() =>
              storage
                .child(`/userImages/${uid}/profilePicture`)
                .getDownloadURL()
                .then(downloadURL =>
                  firestore
                    .collection("users")
                    .doc(uid)
                    .update({ profilePicture: downloadURL })
                )
            );
        }
      })
      .then(() => dispatch({ type: "EDIT_PROFILE_SUCCESS" }));
  };
};

export const deleteAccount = () => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    const storage = firebase.storage().ref();
    const user = firebase.auth().currentUser;

    const promises = [
      storage.child(`/userImages/${user.uid}/profilePicture`).delete(),
      firestore
        .collection("users")
        .doc(user.uid)
        .delete()
    ];
    Promise.allSettled(promises).then(() => {
      user.delete();
    });
  };
};

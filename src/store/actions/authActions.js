import { enqueueSnackbar } from "./notificationActions";
import { SnackbarVariants } from "../../constants";

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

export const updateProfile = (uid, newProfile) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase(),
      firestore = getFirestore(),
      storage = firebase.storage().ref();

    const profileUpdate = {
      firstName: newProfile.firstName,
      lastName: newProfile.lastName,
      initials:
        newProfile.firstName[0].toUpperCase() +
        newProfile.lastName[0].toUpperCase(),
      description: newProfile.description,
      skills: newProfile.skills
    };

    if (!newProfile.profilePicture) profileUpdate.profilePicture = "";

    firestore
      .collection("users")
      .doc(uid)
      .update(profileUpdate)
      .then(() => {
        if (newProfile.image) {
          return firebase
            .uploadFile(`/userImages/${uid}`, newProfile.image, null, {
              name: "profilePicture"
            })
            .then(() =>
              storage
                .child(`/userImages/${uid}/profilePicture`)
                .getDownloadURL()
            )
            .then(downloadURL =>
              firestore
                .collection("users")
                .doc(uid)
                .update({ profilePicture: downloadURL })
            );
        }
      })
      .then(() => dispatch({ type: "EDIT_PROFILE_SUCCESS" }));
  };
};

export const deleteAccount = () => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    firebase.auth().currentUser.delete();
  };
};

export const deleteUser = uid => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const functions = firebase.functions();

    let currentUser = firebase.auth().currentUser.uid;
    if (!currentUser || uid === currentUser) {
      dispatch(
        enqueueSnackbar({
          message: "You can't delete your own account",
          options: SnackbarVariants.ERROR
        })
      );
      return;
    }

    const deleteUser = functions.httpsCallable("deleteUser");
    deleteUser({ uid })
      .then(() => {
        dispatch({ type: "DELETE_USER_SUCCESS" });
        dispatch(
          enqueueSnackbar({
            message: "Successfully Deleted User",
            options: SnackbarVariants.SUCCESS
          })
        );
      })
      .catch(err => {
        dispatch(
          enqueueSnackbar({
            message: "Could Not Delete User",
            options: SnackbarVariants.ERROR
          })
        );
      });
  };
};

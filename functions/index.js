const functions = require("firebase-functions");
const admin = require("firebase-admin");

const serviceAccount = require("./launchpadliftoff-firebase-adminsdk-oz2zu-c50c51134e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://launchpadliftoff.firebaseio.com"
});

exports.deleteUser = functions.https.onCall((data, context) => {
  if (!data || !data.uid)
    throw new functions.https.HttpsError(
      "failed-precondition",
      "No UID was provided"
    );
  return admin
    .auth()
    .deleteUser(data.uid)
    .then(() => {
      console.log(`"Successfully deleted user-${data.uid}`);
      return;
    })
    .catch(error => {
      console.log("Error deleting user :", error);
    });
});

exports.getRole = functions.https.onCall((data, context) => {
  if (!data || !data.signUpCode)
    throw new functions.https.HttpsError(
      "failed-precondition",
      "No sign up code was provided"
    );
  switch (data.signUpCode) {
    case "793230":
      return { role: "Mentor" };
    case "586092":
      return { role: "Mentee" };
    case "369367":
      return { role: "Organizer" };
    default:
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The sign up code provided is invalid"
      );
  }
});

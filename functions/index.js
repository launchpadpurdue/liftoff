const functions = require("firebase-functions");

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

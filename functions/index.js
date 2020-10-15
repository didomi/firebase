const functions = require("firebase-functions");

exports.createPreferenceCenterURL = functions.https.onCall(
  require("./create-preference-center-url")
);

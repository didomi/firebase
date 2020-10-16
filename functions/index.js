const functions = require("firebase-functions");

exports.createConsentEvent = functions.https.onCall(
  require("./create-consent-event")
);

exports.createPreferenceCenterURL = functions.https.onCall(
  require("./create-preference-center-url")
);

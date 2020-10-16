const config = require("./config");
const fetch = require("node-fetch");
const functions = require("firebase-functions");

/**
 * Create consent event in the Didomi API
 * https://developers.didomi.io/api/consents/events#create-a-consent-event
 *
 * The organization user ID passed to the API is the user email
 * by default. Update the `organization_user_id` field in the call to POST /consents/events
 * to use a different organization user ID.
 */
async function createConsentEvent(data, context) {
  if (!context.auth) {
    // The user is not authenticated, stop here
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }

  if (!data.consents || typeof data.consents !== "object") {
    throw new functions.https.HttpsError(
      "invalid-argument",
      'The function must be called with a "consents" object.'
    );
  }

  /**
   * Get an API token from the API key/secret
   * See https://developers.didomi.io/api/introduction/authentication
   */
  const auth = await (
    await fetch("https://api.didomi.io/v1/sessions", {
      method: "POST",
      body: JSON.stringify({
        type: "api-key",
        key: config.apiKey,
        secret: config.apiSecret,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json();

  /**
   * Create a consent event
   * See https://developers.didomi.io/api/consents/events#create-a-consent-event
   */
  await (
    await fetch(
      `https://api.didomi.io/v1/consents/events?organization_id=${config.organizationId}`,
      {
        method: "POST",
        body: JSON.stringify({
          organization_id: config.organizationId,
          user: {
            organization_user_id: context.auth.token.email, // Organization user ID (usually either `context.auth.token.email` or `context.auth.uid`)
          },
          consents: data.consents,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.access_token}`,
        },
      }
    )
  ).json();
}

module.exports = createConsentEvent;

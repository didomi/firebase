const config = require("./config");
const fetch = require("node-fetch");
const functions = require("firebase-functions");

/**
 * Generate an authenticated Preference Center URL with a consent token
 * by calling the Didomi API
 *
 * The organization user ID passed to the Preference Center is the user email
 * by default. Update the `organization_user_id` field in the call to POST /consents/tokens
 * to use a different organization user ID.
 */
async function createPreferenceCenterURL(data, context) {
  if (!context.auth) {
    // The user is not authenticated, stop here
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
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
   * Create a consent token
   * See https://developers.didomi.io/api/consents/tokens#create-a-token
   */
  const consentToken = await (
    await fetch(
      `https://api.didomi.io/v1/consents/tokens?organization_id=${config.organizationId}`,
      {
        method: "POST",
        body: JSON.stringify({
          organization_id: config.organizationId,
          organization_user_id: context.auth.token.email, // Organization user ID (usually either `context.auth.token.email` or `context.auth.uid`)
          lifetime: 3600,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.access_token}`,
        },
      }
    )
  ).json();

  return {
    url: `${config.preferenceCenterURL}?token=${consentToken.id_token}`,
  };
}

module.exports = createPreferenceCenterURL;

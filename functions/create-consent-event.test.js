const nock = require("nock");
const createConsentEvent = require("./create-consent-event");

test("throws if the user is not authenticated", async () => {
  await expect(createConsentEvent({}, {})).rejects.toThrow(
    "The function must be called while authenticated."
  );
});

test("throws if the consents are not provided", async () => {
  await expect(createConsentEvent({}, { auth: {} })).rejects.toThrow(
    'The function must be called with a "consents" object.'
  );
});

test("creates a consent event", async () => {
  nock("https://api.didomi.io", {
    reqheaders: {
      "Content-Type": "application/json",
    },
  })
    .post(
      "/v1/sessions",
      JSON.stringify({
        type: "api-key",
        key: "<Didomi API Key>",
        secret: "<Didomi API Secret>",
      })
    )
    .reply(200, {
      access_token: "access_token",
    });

  nock("https://api.didomi.io", {
    reqheaders: {
      "Content-Type": "application/json",
      Authorization: `Bearer access_token`,
    },
  })
    .post(
      "/v1/consents/events?organization_id=%3CDidomi%20Organization%20ID%3E",
      JSON.stringify({
        organization_id: "<Didomi Organization ID>",
        user: {
          organization_user_id: "user@domain.com",
        },
        consents: {
          purposes: [
            {
              id: "purpose_id",
              enabled: true,
            },
          ],
        },
      })
    )
    .reply(200, {
      id_token: "consent_token",
    });

  await expect(
    createConsentEvent(
      {
        consents: {
          purposes: [
            {
              id: "purpose_id",
              enabled: true,
            },
          ],
        },
      },
      {
        auth: {
          token: {
            email: "user@domain.com",
          },
        },
      }
    )
  ).resolves.toEqual(undefined);
});

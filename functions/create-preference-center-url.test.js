const nock = require("nock");
const createPreferenceCenterURL = require("./create-preference-center-url");

test("throws if the user is not authenticated", async () => {
  await expect(createPreferenceCenterURL({}, {})).rejects.toThrow(
    "The function must be called while authenticated."
  );
});

test("returns a Preference Center URL with a token", async () => {
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
      "/v1/consents/tokens?organization_id=%3CDidomi%20Organization%20ID%3E",
      JSON.stringify({
        organization_id: "<Didomi Organization ID>",
        organization_user_id: "user@domain.com",
        lifetime: 3600,
      })
    )
    .reply(200, {
      id_token: "consent_token",
    });

  await expect(
    createPreferenceCenterURL(
      {},
      {
        auth: {
          token: {
            email: "user@domain.com",
          },
        },
      }
    )
  ).resolves.toEqual("<https://privacy.company.com/>?token=consent_token");
});

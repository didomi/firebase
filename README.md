# Firebase Cloud Functions for Didomi

This project provides Firebase Cloud Functions to interact with the Didomi API from your Firebase project and apps.

We assume that you are familiar with configuring and deploying Firebase Cloud Functions. If not, read the [dedicated Google guide](https://firebase.google.com/docs/functions) first.

## Functions

### Create a Preference Center URL

The `createPreferenceCenterURL`([functions/create-preference-center-url.js](functions/create-preference-center-url.js)>) function uses the Didomi API to create an authenticated Preference Center URL.  
That URL can then be used to launch a Preference Center for an authenticated user.

The function uses the user email from Firebase Authentication by default as the organization user ID to pass to the Preference Center.  
Update the function code to use another identifier.

## Configuration

### Configure your Didomi credentials

Open the `functions/config.js` file and update the configuration values to match your project:

- `apiKey`: The Didomi private API key to use (created from the Didomi Console)
- `apiSecret`: The secret for the Didomi private API key
- `organizationId`: Your Didomi organization ID
- `preferenceCenterURL`: The URL to your Preference Center (if you are using the `createPreferenceCenterURL` function to create an authenticated Preference Center URL)

### Configure your Firebase project

These functions need to be deployed in a Firebase project in your account.

If you want to deploy from this repository, update the `.firebaserc` file with the ID of your Firebase project.  
Alternatively, you can copy the functions into your own project to deploy them alongside your own functions.

## Deployment

Once your project is configured, you can deploy functions by running `firebase deploy --only functions` in the project directory.

Follow the [Firebase Cloud Functions guide](https://firebase.google.com/docs/functions/get-started#deploy-functions-to-a-production-environment) to deploy these functions to your environment:

## Support

We provide support via the issue tracker on this repository for bugs or improvement requests.

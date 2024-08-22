import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

export let oauth2Client: OAuth2Client;

export const initOauth2Google = () => {
  oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CID,
    clientSecret: process.env.GOOGLE_CSE,
  });

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
};

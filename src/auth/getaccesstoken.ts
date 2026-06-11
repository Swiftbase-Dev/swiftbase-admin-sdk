import { app, isLoggedIn } from "../common/app";
import { login } from "./login";

/**
 * Get a valid access token. 
 * If the current token is missing or expired, it will attempt to login again
 * using the stored serviceId and serviceKey.
 * 
 * @returns {Promise<string | null>} The access token
 */
export const getAccessToken = async (): Promise<string | null> => {
  if (isLoggedIn() && app.accessToken) {
    return app.accessToken.value();
  }

  // Attempt to login if credentials are available
  if (app.serviceId && app.serviceKey) {
    await login(app.serviceId, app.serviceKey);
    if (app.accessToken) {
      return app.accessToken.value();
    }
  }

  return null;
};

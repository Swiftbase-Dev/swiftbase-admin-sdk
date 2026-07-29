import { app, setAccessToken } from "../common/app";
import { makeRequest, HTTPMethod } from "../common/makerequest";

/**
 * Login as a service
 *
 * @param {string} serviceId The service ID
 * @param {string} secretKey The service secret key
 *
 * @returns {Promise<void>}
 */
export const login = async (serviceId: string, secretKey: string): Promise<void> => {
  // Use OAuth2 client_credentials grant
  const body = new URLSearchParams();
  body.append("grant_type", "client_credentials");
  body.append("client_id", serviceId);
  body.append("client_secret", secretKey);
  body.append("scope", "openid profile email");

  let base = app.baseUrl || "https://api.swiftbase.io";
  const url = `${base}/oauth2/token`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`Login failed with status: ${response.status}`);
  }

  const data = await response.json();
  const { access_token, expires_in } = data;

  const expiresAt = expires_in ? Date.now() + (expires_in * 1000) : undefined;
  setAccessToken(access_token, expiresAt);
};

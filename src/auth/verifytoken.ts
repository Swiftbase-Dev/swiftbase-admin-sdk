import { app } from "../common/app";
import { makeRequest, HTTPMethod } from "../common/makerequest";
import { User } from "./types";

/**
 * Verify a user's access token
 *
 * @param {string} token The access token to verify
 *
 * @returns {Promise<User>} The user associated with the token
 */
export const verifyToken = async (token: string): Promise<User> => {
  // Use the /api/me endpoint which is authorized by the token
  // We need to temporarily set the token in the app state if it's not there, 
  // or just pass it to makeRequest if I update makeRequest.
  
  // Actually, verifyToken is often called by other services receiving a token.
  // The app.accessToken might already be set if this is the client, 
  // but if it's a backend service, it might be verifying an incoming token.
  
  const headers = {
    "Authorization": `Bearer ${token}`
  };

  let base = app.baseUrl || "https://api.swiftbase.io";
  if (!base.includes("localhost") && !base.includes("127.0.0.1")) {
    base = base.replace("api.swiftbase", "identity.swiftbase");
  }
  const response = await fetch(`${base}/api/me`, { headers });
  if (!response.ok) {
    throw new Error(`Token verification failed: ${response.status}`);
  }

  return await response.json();
};

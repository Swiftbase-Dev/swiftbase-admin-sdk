import { app } from "../common/app";
import { User } from "./types";

/**
 * Verify a user's access token
 *
 * @param {string} token The access token to verify
 *
 * @returns {Promise<User>} The user associated with the token
 */
export const verifyToken = async (token: string): Promise<User> => {
  const headers = {
    "Authorization": `Bearer ${token}`
  };

  let base = app.baseUrl || "https://api.swiftbase.io";
  const response = await fetch(`${base}/api/me`, { headers });
  if (!response.ok) {
    throw new Error(`Token verification failed: ${response.status}`);
  }

  return await response.json();
};

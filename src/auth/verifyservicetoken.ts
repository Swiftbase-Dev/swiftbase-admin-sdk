import { app } from "../common/app";
import { makeRequest, HTTPMethod } from "../common/makerequest";
import { Service } from "../identity/types";

/**
 * Verify a service's access token
 *
 * @param {string} token The access token to verify
 * @param {string} [scope] Optional scope to verify
 *
 * @returns {Promise<Service>} The service associated with the token
 */
export const verifyServiceToken = async (token: string, scope?: string): Promise<Service> => {
  // Use the internal verify-service-token endpoint
  const url = `${app.baseUrl}/api/verify-service-token`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ token, scope })
  });

  if (!response.ok) {
    throw new Error(`Service token verification failed: ${response.status}`);
  }

  return await response.json();
};

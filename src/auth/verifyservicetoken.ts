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
  return await makeRequest(HTTPMethod.POST, "/api/verify-service-token", undefined, {
    token,
    scope
  });
};

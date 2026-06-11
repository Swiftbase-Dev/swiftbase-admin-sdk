import { makeRequest, HTTPMethod } from "../common/makerequest";
import type { ChangePasswordInput } from "./types";

/**
 * Change the current user password
 * 
 * @param {ChangePasswordInput} input The password data
 * @returns {Promise<void>}
 */
export const changePassword = async (input: ChangePasswordInput): Promise<void> => {
  return await makeRequest(HTTPMethod.POST, "/api/users/change-password", undefined, input);
};

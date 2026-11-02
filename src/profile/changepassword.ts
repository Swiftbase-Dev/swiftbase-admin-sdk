import { makeRequest, HTTPMethod } from "../common/makerequest";
import type { ChangePasswordInput } from "./types";

/**
 * Change the current user password
 * 
 * @param {ChangePasswordInput} input The password data
 * @returns {Promise<any>}
 */
export const changePassword = async (input: ChangePasswordInput): Promise<any> => {
  const me = await makeRequest(HTTPMethod.GET, "/api/me");
  return await makeRequest(HTTPMethod.PUT, `/api/users/${me.id}`, undefined, {
    password: input.newPassword,
    currentPassword: input.currentPassword,
  });
};

import { makeRequest, HTTPMethod } from "../common/makerequest";
import type { Profile, ProfileInput } from "./types";

/**
 * Update a user by ID
 * 
 * @param {string} id The user ID
 * @param {ProfileInput} input The user data to update
 * @returns {Promise<Profile>} The updated user
 */
export const updateUser = async (id: string, input: ProfileInput): Promise<Profile> => {
  return await makeRequest(HTTPMethod.PUT, `/api/users/${id}`, undefined, input);
};

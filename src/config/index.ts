import { makeRequest, HTTPMethod } from "../common/makerequest";
import { Configuration, ConfigurationInput } from "./types";

export const getConfiguration = async (projectId: string): Promise<Configuration> => {
  return await makeRequest(HTTPMethod.GET, `/api/configurations/${projectId}`);
};

export const updateConfiguration = async (projectId: string, data: ConfigurationInput): Promise<Configuration> => {
  return await makeRequest(HTTPMethod.PUT, `/api/configurations/${projectId}`, undefined, data);
};

import { app } from "../common/app";
import { makeRequest, HTTPMethod } from "../common/makerequest";
import type {
  VaultSecret,
  VaultVersion,
  VaultLog,
  CreateSecretInput,
  UpdateSecretInput,
} from "./types";

/**
 * Get all secrets for a project
 */
export async function getSecrets(projectId?: string): Promise<VaultSecret[]> {
  const targetProject = projectId || app.projectId;
  const res = await makeRequest(HTTPMethod.GET, "/api/vault/secrets", {
    projectId: targetProject,
  });
  return res || [];
}

/**
 * Get a specific secret by ID or Key
 */
export async function getSecret(
  idOrKey: string,
  projectId?: string
): Promise<VaultSecret | null> {
  const secrets = await getSecrets(projectId);
  const found = secrets.find((s) => s.id === idOrKey || s.key === idOrKey);
  return found || null;
}

/**
 * Create a new encrypted vault secret
 */
export async function createSecret(
  input: CreateSecretInput
): Promise<VaultSecret> {
  const targetProject = input.projectId || app.projectId;
  return await makeRequest(HTTPMethod.POST, "/api/vault/secrets", undefined, {
    projectId: targetProject,
    key: input.key,
    name: input.name || input.key,
    description: input.description || "",
    value: input.value,
  });
}

/**
 * Update a secret's value (creates a new version)
 */
export async function updateSecretValue(
  id: string,
  value: string
): Promise<VaultSecret> {
  return await makeRequest(
    HTTPMethod.PUT,
    `/api/vault/secrets/${encodeURIComponent(id)}`,
    undefined,
    { value }
  );
}

/**
 * Delete a secret and its version history
 */
export async function deleteSecret(id: string): Promise<void> {
  await makeRequest(
    HTTPMethod.DELETE,
    `/api/vault/secrets/${encodeURIComponent(id)}`
  );
}

/**
 * Get decrypted versions history for a secret
 */
export async function getSecretVersions(
  secretId: string
): Promise<VaultVersion[]> {
  const res = await makeRequest(
    HTTPMethod.GET,
    `/api/vault/secrets/${encodeURIComponent(secretId)}/versions`
  );
  return res || [];
}

/**
 * Get audit logs for vault operations
 */
export async function getLogs(options?: {
  projectId?: string;
  secretId?: string;
}): Promise<VaultLog[]> {
  const targetProject = options?.projectId || app.projectId;
  const params: Record<string, any> = { projectId: targetProject };
  if (options?.secretId) {
    params.secretId = options.secretId;
  }
  const res = await makeRequest(HTTPMethod.GET, "/api/vault/logs", params);
  return res || [];
}

export const vault = {
  getSecrets,
  getSecret,
  createSecret,
  updateSecretValue,
  deleteSecret,
  getSecretVersions,
  getLogs,
};

export type {
  VaultSecret,
  VaultVersion,
  VaultLog,
  CreateSecretInput,
  UpdateSecretInput,
};

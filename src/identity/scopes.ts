import { makeRequest, HTTPMethod } from "../common/makerequest";

export interface CustomScope {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScopeCatalogResponse {
  categories: Array<{
    id: string;
    label: string;
    scopes: Array<{ key: string; description: string; sensitive?: boolean }>;
  }>;
  customScopes: CustomScope[];
}

/**
 * Helper to format a custom scope name with the reserved `custom:` prefix.
 */
export function customScope(name: string): string {
  const clean = String(name || "").trim().toLowerCase();
  return clean.startsWith("custom:") ? clean : `custom:${clean}`;
}

/**
 * Fetch built-in Swiftbase scopes and custom project scopes.
 */
export async function getScopes(projectId?: string): Promise<ScopeCatalogResponse> {
  return await makeRequest(HTTPMethod.GET, "/api/identity/scopes", { projectId });
}

/**
 * Create a project-scoped custom scope (automatically prefixed with `custom:`).
 */
export async function createCustomScope(input: {
  projectId?: string;
  name: string;
  description?: string;
}): Promise<CustomScope> {
  return await makeRequest(HTTPMethod.POST, "/api/identity/scopes", undefined, {
    ...input,
    name: customScope(input.name)
  });
}

/**
 * Delete a project-scoped custom scope.
 */
export async function deleteCustomScope(id: string): Promise<void> {
  await makeRequest(HTTPMethod.DELETE, `/api/identity/scopes/${id}`);
}

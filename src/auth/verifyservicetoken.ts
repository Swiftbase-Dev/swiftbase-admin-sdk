import { makeRequest, HTTPMethod } from "../common/makerequest";

export interface VerifiedServiceToken {
  valid: boolean;
  service: {
    id: string;
    name: string;
    projectId: string;
    scopes: string[];
  };
}

export interface VerifyServiceTokenOptions {
  scope?: string;
  scopes?: string[];
  match?: "all" | "any";
}

/**
 * Verify a service's access token (JWT) against Swiftbase.
 * Enforces same-project isolation and optional built-in or `custom:*` scope requirements.
 */
export const verifyServiceToken = async (
  token: string,
  scopeOrOptions?: string | VerifyServiceTokenOptions
): Promise<VerifiedServiceToken> => {
  const body: Record<string, any> = { token };
  if (typeof scopeOrOptions === "string") {
    body.scope = scopeOrOptions;
  } else if (scopeOrOptions && typeof scopeOrOptions === "object") {
    if (scopeOrOptions.scope) body.scope = scopeOrOptions.scope;
    if (scopeOrOptions.scopes) body.scopes = scopeOrOptions.scopes;
    if (scopeOrOptions.match) body.match = scopeOrOptions.match;
  }
  return await makeRequest(HTTPMethod.POST, "/api/verify-service-token", undefined, body);
};

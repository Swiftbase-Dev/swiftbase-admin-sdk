import { describe, it, expect, vi, beforeEach } from "vitest";
import { vault } from "../src/vault";
import * as makerequest from "../src/common/makerequest";

vi.mock("../src/common/makerequest", () => ({
  makeRequest: vi.fn(),
  HTTPMethod: {
    GET: "get",
    POST: "post",
    PUT: "put",
    PATCH: "patch",
    DELETE: "delete",
  },
}));

describe("Vault Module in admin-sdk", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get secrets with project id parameter", async () => {
    const mockSecrets = [
      { id: "sec-1", key: "API_KEY", name: "API Key", currentVersion: 1 },
    ];
    vi.mocked(makerequest.makeRequest).mockResolvedValueOnce(mockSecrets);

    const res = await vault.getSecrets("test-project");
    expect(res).toEqual(mockSecrets);
    expect(makerequest.makeRequest).toHaveBeenCalledWith(
      makerequest.HTTPMethod.GET,
      "/api/vault/secrets",
      { projectId: "test-project" }
    );
  });

  it("should find secret by key or id", async () => {
    const mockSecrets = [
      { id: "sec-1", key: "STRIPE_KEY", name: "Stripe", currentVersion: 1 },
      { id: "sec-2", key: "AWS_SECRET", name: "AWS", currentVersion: 2 },
    ];
    vi.mocked(makerequest.makeRequest).mockResolvedValueOnce(mockSecrets);

    const foundByKey = await vault.getSecret("AWS_SECRET", "test-project");
    expect(foundByKey).toEqual(mockSecrets[1]);

    vi.mocked(makerequest.makeRequest).mockResolvedValueOnce(mockSecrets);
    const notFound = await vault.getSecret("NON_EXISTENT", "test-project");
    expect(notFound).toBeNull();
  });

  it("should create secret via POST", async () => {
    const mockCreated = {
      id: "sec-3",
      key: "GITHUB_TOKEN",
      name: "GitHub Token",
      currentVersion: 1,
    };
    vi.mocked(makerequest.makeRequest).mockResolvedValueOnce(mockCreated);

    const res = await vault.createSecret({
      projectId: "test-project",
      key: "GITHUB_TOKEN",
      value: "ghp_12345",
    });

    expect(res).toEqual(mockCreated);
    expect(makerequest.makeRequest).toHaveBeenCalledWith(
      makerequest.HTTPMethod.POST,
      "/api/vault/secrets",
      undefined,
      {
        projectId: "test-project",
        key: "GITHUB_TOKEN",
        name: "GITHUB_TOKEN",
        description: "",
        value: "ghp_12345",
      }
    );
  });

  it("should update secret value via PUT", async () => {
    const mockUpdated = { id: "sec-1", currentVersion: 2 };
    vi.mocked(makerequest.makeRequest).mockResolvedValueOnce(mockUpdated);

    const res = await vault.updateSecretValue("sec-1", "new_secret_val");
    expect(res).toEqual(mockUpdated);
    expect(makerequest.makeRequest).toHaveBeenCalledWith(
      makerequest.HTTPMethod.PUT,
      "/api/vault/secrets/sec-1",
      undefined,
      { value: "new_secret_val" }
    );
  });

  it("should delete secret via DELETE", async () => {
    vi.mocked(makerequest.makeRequest).mockResolvedValueOnce(undefined);

    await vault.deleteSecret("sec-1");
    expect(makerequest.makeRequest).toHaveBeenCalledWith(
      makerequest.HTTPMethod.DELETE,
      "/api/vault/secrets/sec-1"
    );
  });

  it("should get decrypted versions for secret", async () => {
    const mockVersions = [
      { id: "v-2", version: 2, value: "latest-val" },
      { id: "v-1", version: 1, value: "old-val" },
    ];
    vi.mocked(makerequest.makeRequest).mockResolvedValueOnce(mockVersions);

    const res = await vault.getSecretVersions("sec-1");
    expect(res).toEqual(mockVersions);
    expect(makerequest.makeRequest).toHaveBeenCalledWith(
      makerequest.HTTPMethod.GET,
      "/api/vault/secrets/sec-1/versions"
    );
  });
});

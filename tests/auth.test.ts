import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { login } from "../src/auth/login";
import { verifyToken } from "../src/auth/verifytoken";
import { verifyServiceToken } from "../src/auth/verifyservicetoken";
import { initializeSdk, isLoggedIn, logout } from "../src/common/app";

describe("Auth", () => {
  const projectId = "test-project";
  const serviceId = "test-service";
  const secretKey = "test-secret";
  const token = "mock-token";

  beforeEach(() => {
    initializeSdk(projectId, { baseUrl: "http://localhost:3000" });
    // Mock global fetch
    globalThis.fetch = vi.fn().mockImplementation((url: string, options: any) => {
      if (url.endsWith("/oauth2/token")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ access_token: token, expires_in: 3600 }),
        } as Response);
      }
      if (url.endsWith("/api/me")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ _id: "user-1", email: "test@example.com" }),
        } as Response);
      }
      if (url.endsWith("/api/verify-service-token")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ _id: "service-1", name: "Test Service", scope: ["admin"] }),
        } as Response);
      }
      return Promise.reject(new Error("Unknown URL: " + url));
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    logout();
  });

  it("should login successfully and store the token", async () => {
    await login(serviceId, secretKey);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/oauth2/token",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
    );

    expect(isLoggedIn()).toBe(true);
  });

  it("should clear the token on logout", async () => {
    await login(serviceId, secretKey);
    expect(isLoggedIn()).toBe(true);

    logout();
    expect(isLoggedIn()).toBe(false);
  });

  it("should verify a token and return the user", async () => {
    const user = await verifyToken(token);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/me",
      expect.objectContaining({
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
    );
    expect(user).toEqual({ _id: "user-1", email: "test@example.com" });
  });

  it("should verify a service token and return the service", async () => {
    const service = await verifyServiceToken(token, "admin");

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/verify-service-token",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, scope: "admin" }),
      })
    );
    expect(service).toEqual({ _id: "service-1", name: "Test Service", scope: ["admin"] });
  });
});

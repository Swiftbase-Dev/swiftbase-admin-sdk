import { describe, it, expect, beforeEach } from "vitest";
import { app, initializeSdk, setAccessToken, isLoggedIn, logout } from "../src/common/app";

describe("App Configurations", () => {
  beforeEach(() => {
    logout();
  });

  it("should initialize default application values", () => {
    expect(app.baseUrl).toBe("https://api.swiftbase.io");
    expect(isLoggedIn()).toBe(false);
  });

  it("should initialize with custom options", () => {
    initializeSdk("proj-123", {
      baseUrl: "https://custom.api.io/",
      serviceId: "srv-1",
      serviceKey: "key-1"
    });

    expect(app.projectId).toBe("proj-123");
    expect(app.baseUrl).toBe("https://custom.api.io"); // Trailing slash removed
    expect(app.serviceId).toBe("srv-1");
    expect(app.serviceKey).toBe("key-1");
  });

  it("should handle login and logout statuses properly", () => {
    const validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDAwMDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    setAccessToken(validToken);
    expect(isLoggedIn()).toBe(true);

    logout();
    expect(isLoggedIn()).toBe(false);
  });
});

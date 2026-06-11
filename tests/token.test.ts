import { expect, test, describe } from "vitest";
import Token from "../src/common/token";

describe("Token", () => {
  test("should be valid with access token type", () => {
    const key = new Token(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDAwMDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      "access",
    );
    expect(key.isValid()).toBe(true);
    expect(key.isAccessToken()).toBe(true);
    expect(key.isRefreshToken()).toBe(false);
  });

  test("should be valid with refresh token type", () => {
    const key = new Token(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDAwMDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      "refresh",
    );
    expect(key.isValid()).toBe(true);
    expect(key.isAccessToken()).toBe(false);
    expect(key.isRefreshToken()).toBe(true);
  });

  test("should be invalid with wrong token", () => {
    const key = new Token("this is a test", "refresh");
    expect(key.isValid()).toBe(false);
  });
});

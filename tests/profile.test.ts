import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getProfile, updateProfile, updateUser, changePassword } from "../src/profile";
import * as makeRequestModule from "../src/common/makerequest";
import { ProfileInput, ChangePasswordInput } from "../src/profile/types";

describe("Profile", () => {
  beforeEach(() => {
    vi.mock("../src/common/makerequest", async () => {
      const actual = await vi.importActual("../src/common/makerequest");
      return {
        ...actual,
        makeRequest: vi.fn(),
      };
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should get the current user profile", async () => {
    const mockProfile = { id: "user-1", email: "me@example.com" };
    vi.spyOn(makeRequestModule, "makeRequest").mockResolvedValue(mockProfile);

    const profile = await getProfile();
    expect(profile).toEqual(mockProfile);
    expect(makeRequestModule.makeRequest).toHaveBeenCalledWith(
      makeRequestModule.HTTPMethod.GET,
      "/api/me"
    );
  });

  it("should update the current user profile", async () => {
    const mockUser = { id: "user-1", email: "me@example.com" };
    const mockUpdatedProfile = { id: "user-1", email: "me@example.com", firstName: "Jane" };
    const input: ProfileInput = { firstName: "Jane" };

    vi.spyOn(makeRequestModule, "makeRequest")
      .mockResolvedValueOnce(mockUser)
      .mockResolvedValueOnce(mockUpdatedProfile);

    const profile = await updateProfile(input);
    expect(profile).toEqual(mockUpdatedProfile);
    expect(makeRequestModule.makeRequest).toHaveBeenNthCalledWith(
      1,
      makeRequestModule.HTTPMethod.GET,
      "/api/me"
    );
    expect(makeRequestModule.makeRequest).toHaveBeenNthCalledWith(
      2,
      makeRequestModule.HTTPMethod.PUT,
      "/api/users/user-1",
      undefined,
      input
    );
  });

  it("should update user by ID", async () => {
    const mockUpdatedUser = { id: "user-2", lastName: "Smith" };
    const input: ProfileInput = { lastName: "Smith" };
    vi.spyOn(makeRequestModule, "makeRequest").mockResolvedValue(mockUpdatedUser);

    const user = await updateUser("user-2", input);
    expect(user).toEqual(mockUpdatedUser);
    expect(makeRequestModule.makeRequest).toHaveBeenCalledWith(
      makeRequestModule.HTTPMethod.PUT,
      "/api/users/user-2",
      undefined,
      input
    );
  });

  it("should change user password", async () => {
    vi.spyOn(makeRequestModule, "makeRequest").mockResolvedValue({ success: true });
    const input: ChangePasswordInput = { currentPassword: "old", newPassword: "new" };

    const result = await changePassword(input);
    expect(result).toEqual({ success: true });
    expect(makeRequestModule.makeRequest).toHaveBeenCalledWith(
      makeRequestModule.HTTPMethod.POST,
      "/api/users/change-password",
      undefined,
      input
    );
  });
});

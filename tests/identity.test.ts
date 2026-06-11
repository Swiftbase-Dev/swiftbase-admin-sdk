import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getServices,
  createService,
  updateService,
  deleteService,
  getUsers,
  assignRole,
  unassignRole,
} from "../src/identity";
import * as makeRequestModule from "../src/common/makerequest";

describe("Identity", () => {
  const projectId = "test-project";

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

  it("should get roles", async () => {
    const mockRoles = [{ id: "role-1", name: "Admin" }];
    vi.spyOn(makeRequestModule, "makeRequest").mockResolvedValue(mockRoles);

    const roles = await getRoles(projectId);
    expect(roles).toEqual(mockRoles);
    expect(makeRequestModule.makeRequest).toHaveBeenCalledWith(
      makeRequestModule.HTTPMethod.GET,
      "/api/roles",
      { projectId }
    );
  });

  it("should create a role", async () => {
    const roleInput = { name: "Editor", permissions: ["read", "write"], projectId: "test-project" };
    const mockRole = { id: "role-2", ...roleInput };
    vi.spyOn(makeRequestModule, "makeRequest").mockResolvedValue(mockRole);

    const role = await createRole(roleInput);
    expect(role).toEqual(mockRole);
    expect(makeRequestModule.makeRequest).toHaveBeenCalledWith(
      makeRequestModule.HTTPMethod.POST,
      "/api/roles",
      undefined,
      roleInput
    );
  });

  it("should update a role", async () => {
    const roleUpdate = { id: "role-2", name: "Super Editor" };
    const mockRole = { id: "role-2", name: "Super Editor", permissions: ["read"] };
    vi.spyOn(makeRequestModule, "makeRequest").mockResolvedValue(mockRole);

    const role = await updateRole(roleUpdate);
    expect(role).toEqual(mockRole);
    expect(makeRequestModule.makeRequest).toHaveBeenCalledWith(
      makeRequestModule.HTTPMethod.PUT,
      "/api/roles/role-2",
      undefined,
      { name: "Super Editor" }
    );
  });

  it("should delete a role", async () => {
    vi.spyOn(makeRequestModule, "makeRequest").mockResolvedValue({});

    const id = await deleteRole("role-2");
    expect(id).toBe("role-2");
    expect(makeRequestModule.makeRequest).toHaveBeenCalledWith(
      makeRequestModule.HTTPMethod.DELETE,
      "/api/roles/role-2"
    );
  });

  it("should get services", async () => {
    const mockServices = [{ id: "service-1", name: "Payment Service" }];
    vi.spyOn(makeRequestModule, "makeRequest").mockResolvedValue(mockServices);

    const services = await getServices(projectId);
    expect(services).toEqual(mockServices);
    expect(makeRequestModule.makeRequest).toHaveBeenCalledWith(
      makeRequestModule.HTTPMethod.GET,
      "/api/services",
      { projectId }
    );
  });

  it("should create a service", async () => {
    const serviceInput = { name: "Emailer", scope: ["send"], projectId: "test-project", secretKey: "secret" };
    const mockService = { id: "service-2", ...serviceInput };
    vi.spyOn(makeRequestModule, "makeRequest").mockResolvedValue(mockService);

    const service = await createService(serviceInput);
    expect(service).toEqual(mockService);
    expect(makeRequestModule.makeRequest).toHaveBeenCalledWith(
      makeRequestModule.HTTPMethod.POST,
      "/api/services",
      undefined,
      serviceInput
    );
  });

  it("should update a service", async () => {
    const serviceUpdate = { id: "service-2", name: "Super Emailer" };
    const mockService = { id: "service-2", name: "Super Emailer", scope: ["send"] };
    vi.spyOn(makeRequestModule, "makeRequest").mockResolvedValue(mockService);

    const service = await updateService(serviceUpdate);
    expect(service).toEqual(mockService);
    expect(makeRequestModule.makeRequest).toHaveBeenCalledWith(
      makeRequestModule.HTTPMethod.PUT,
      "/api/services/service-2",
      undefined,
      { name: "Super Emailer" }
    );
  });

  it("should delete a service", async () => {
    vi.spyOn(makeRequestModule, "makeRequest").mockResolvedValue({});

    const id = await deleteService("service-2");
    expect(id).toBe("service-2");
    expect(makeRequestModule.makeRequest).toHaveBeenCalledWith(
      makeRequestModule.HTTPMethod.DELETE,
      "/api/services/service-2"
    );
  });

  it("should get users", async () => {
    const mockUsers = [{ id: "user-1", email: "user1@example.com" }];
    vi.spyOn(makeRequestModule, "makeRequest").mockResolvedValue(mockUsers);

    const users = await getUsers(projectId);
    expect(users).toEqual(mockUsers);
    expect(makeRequestModule.makeRequest).toHaveBeenCalledWith(
      makeRequestModule.HTTPMethod.GET,
      "/api/users",
      { projectId }
    );
  });

  it("should assign a role to a user", async () => {
    const mockUser = { id: "user-1", email: "user@example.com", roles: ["Viewer"] };
    const updatedUser = { id: "user-1", email: "user@example.com", roles: ["Viewer", "Editor"] };
    
    vi.spyOn(makeRequestModule, "makeRequest")
      .mockResolvedValueOnce(mockUser)
      .mockResolvedValueOnce(updatedUser);

    const user = await assignRole("user-1", "Editor");
    expect(user).toEqual(updatedUser);
    expect(makeRequestModule.makeRequest).toHaveBeenNthCalledWith(
      1,
      makeRequestModule.HTTPMethod.GET,
      "/api/users/user-1"
    );
    expect(makeRequestModule.makeRequest).toHaveBeenNthCalledWith(
      2,
      makeRequestModule.HTTPMethod.PUT,
      "/api/users/user-1",
      undefined,
      { roles: ["Viewer", "Editor"] }
    );
  });

  it("should unassign a role from a user", async () => {
    const mockUser = { id: "user-1", email: "user@example.com", roles: ["Viewer", "Editor"] };
    const updatedUser = { id: "user-1", email: "user@example.com", roles: ["Viewer"] };
    
    vi.spyOn(makeRequestModule, "makeRequest")
      .mockResolvedValueOnce(mockUser)
      .mockResolvedValueOnce(updatedUser);

    const user = await unassignRole("user-1", "Editor");
    expect(user).toEqual(updatedUser);
    expect(makeRequestModule.makeRequest).toHaveBeenNthCalledWith(
      1,
      makeRequestModule.HTTPMethod.GET,
      "/api/users/user-1"
    );
    expect(makeRequestModule.makeRequest).toHaveBeenNthCalledWith(
      2,
      makeRequestModule.HTTPMethod.PUT,
      "/api/users/user-1",
      undefined,
      { roles: ["Viewer"] }
    );
  });
});

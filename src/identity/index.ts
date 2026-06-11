import { makeRequest, HTTPMethod, PaginatedResponse } from "../common/makerequest";
import type { 
  Role, RoleInput, RoleUpdateInput,
  Service, ServiceInput, ServiceUpdateInput,
  User
} from "./types";

/**
 * Roles Management
 */

// Fetch all roles for a project
export const getRoles = async (projectId: string): Promise<Role[]> => {
  const response = await makeRequest(HTTPMethod.GET, "/api/roles", { projectId });
  // If paginated, return the data array
  if (response instanceof PaginatedResponse) {
    return response.items as Role[];
  }
  return response;
};

// Create a new role
export const createRole = async (input: RoleInput): Promise<Role> => {
  return await makeRequest(HTTPMethod.POST, "/api/roles", undefined, input);
};

export const updateRole = async (input: RoleUpdateInput): Promise<Role> => {
  const { id, ...data } = input;
  return await makeRequest(HTTPMethod.PUT, `/api/roles/${id}`, undefined, data);
};

// Delete a role
export const deleteRole = async (id: string): Promise<string> => {
  await makeRequest(HTTPMethod.DELETE, `/api/roles/${id}`);
  return id;
};

/**
 * Services Management
 */

// Fetch all services for a project
export const getServices = async (projectId: string): Promise<Service[]> => {
  const response = await makeRequest(HTTPMethod.GET, "/api/services", { projectId });
  if (response instanceof PaginatedResponse) {
    return response.items as Service[];
  }
  return response;
};

export const createService = async (input: ServiceInput): Promise<Service> => {
  return await makeRequest(HTTPMethod.POST, "/api/services", undefined, input);
};

export const updateService = async (input: ServiceUpdateInput): Promise<Service> => {
  const { id, ...data } = input;
  return await makeRequest(HTTPMethod.PUT, `/api/services/${id}`, undefined, data);
};

export const deleteService = async (id: string): Promise<string> => {
  await makeRequest(HTTPMethod.DELETE, `/api/services/${id}`);
  return id;
};

/**
 * User Management
 */

// Fetch all users for a project
export const getUsers = async (projectId: string): Promise<User[]> => {
  const response = await makeRequest(HTTPMethod.GET, "/api/users", { projectId });
  if (response instanceof PaginatedResponse) {
    return response.items as User[];
  }
  return response;
};

// Assign a role to a user
export const assignRole = async (userId: string, roleName: string): Promise<User> => {
  // We use the standard PUT update for now, fetching current roles first if needed, 
  // but simpler is to have the backend handle it.
  // For now, I'll assume PUT /api/users/:id handles partial updates or I'll add the specific logic.
  
  // Actually, I'll check if I should add /api/users/:id/roles in auth service.
  // Given the request, I'll just use the standard update for now.
  const user = await makeRequest(HTTPMethod.GET, `/api/users/${userId}`);
  const roles = [...(user.roles || [])];
  if (!roles.includes(roleName)) {
    roles.push(roleName);
  }
  return await makeRequest(HTTPMethod.PUT, `/api/users/${userId}`, undefined, { roles });
};

// Unassign a role from a user
export const unassignRole = async (userId: string, roleName: string): Promise<User> => {
  const user = await makeRequest(HTTPMethod.GET, `/api/users/${userId}`);
  const roles = (user.roles || []).filter((r: string) => r !== roleName);
  return await makeRequest(HTTPMethod.PUT, `/api/users/${userId}`, undefined, { roles });
};

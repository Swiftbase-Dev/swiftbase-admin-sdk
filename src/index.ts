import { app, initializeSdk, isLoggedIn, logout, setAccessToken } from "./common/app";
import { PaginatedResponse } from "./common/makerequest";
import { login, verifyToken, verifyServiceToken, getAccessToken } from "./auth";
import type { User } from "./auth";

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
} from "./identity";
import type {
  Role,
  RoleInput,
  RoleUpdateInput,
  Service,
  ServiceInput,
  ServiceUpdateInput,
  User as IdentityUser,
} from "./identity/types";
import { getProfile, updateProfile, updateUser, changePassword } from "./profile";
import type { Profile, ProfileInput, ChangePasswordInput } from "./profile";
import { getConfiguration, updateConfiguration } from "./config";
import type { Configuration, ConfigurationInput } from "./config/types";
import { db } from "./database";
import { Storage } from "./storage/storage";
import type { StorageOptions, BucketInfo, S3Object, ListObjectsResult } from "./storage/storage";

export {
  app,
  initializeSdk,
  setAccessToken,
  isLoggedIn,
  logout,
  login,
  verifyToken,
  verifyServiceToken,
  PaginatedResponse,
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
  getAccessToken,
  getProfile,
  updateProfile,
  updateUser,
  changePassword,
  getConfiguration,
  updateConfiguration,
  db,
  Storage,
};
export type {
  User,
  Role,
  RoleInput,
  RoleUpdateInput,
  Service,
  ServiceInput,
  ServiceUpdateInput,
  IdentityUser,
  Profile,
  ProfileInput,
  ChangePasswordInput,
  Configuration,
  ConfigurationInput,
  StorageOptions,
  BucketInfo,
  S3Object,
  ListObjectsResult,
};

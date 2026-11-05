export interface VaultSecret {
  id: string;
  projectId: string;
  key: string;
  name: string;
  description?: string;
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
}

export interface VaultVersion {
  id: string;
  secretId: string;
  projectId: string;
  version: number;
  value: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface VaultLog {
  id: string;
  secretId?: string;
  projectId: string;
  action: string;
  performedBy: string;
  details?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSecretInput {
  projectId?: string;
  key: string;
  name?: string;
  description?: string;
  value: string;
}

export interface UpdateSecretInput {
  value: string;
}

import { makeRequest, HTTPMethod } from "../common/makerequest";
import { app } from "../common/app";

export interface StackServiceSpec {
  image: string;
  port?: number;
  replicas?: number;
  resources?: { cpu?: number; memory?: string };
  domain?: string;
  domains?: string[];
  env?: Record<string, string>;
  volumes?: Array<{ sizeGB?: number; mountPath?: string }>;
  restrict_inbound?: boolean;
  force_https?: boolean;
  depends_on?: string[];
}

export interface StackManifest {
  version?: string;
  stack: string;
  services: Record<string, StackServiceSpec>;
}

export interface StackPlanResult {
  stack: string;
  order: string[];
  toCreate: string[];
  toUpdate: string[];
  toDelete: string[];
  unchanged: string[];
}

export const stacks = {
  async list(projectId?: string) {
    const pid = projectId || app.projectId;
    return makeRequest<any[]>(`/api/stacks?projectId=${encodeURIComponent(pid || "")}`, HTTPMethod.GET);
  },

  async plan(manifest: StackManifest | string, options: { projectId?: string; prune?: boolean } = {}) {
    const pid = options.projectId || app.projectId;
    return makeRequest<StackPlanResult>("/api/stacks/plan", HTTPMethod.POST, {
      projectId: pid,
      manifest,
      prune: Boolean(options.prune),
    });
  },

  async apply(manifest: StackManifest | string, options: { projectId?: string; prune?: boolean } = {}) {
    const pid = options.projectId || app.projectId;
    return makeRequest<{ stackId: string; stack: string; deployed: any[] }>("/api/stacks/apply", HTTPMethod.POST, {
      projectId: pid,
      manifest,
      prune: Boolean(options.prune),
    });
  },

  async down(stackId: string) {
    return makeRequest<{ success: boolean; removedContainers: number }>(`/api/stacks/${stackId}/down`, HTTPMethod.POST, {});
  },
};

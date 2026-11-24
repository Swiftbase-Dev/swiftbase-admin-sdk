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
  async list(projectId?: string): Promise<any[]> {
    const pid = projectId || app.projectId;
    return makeRequest(HTTPMethod.GET, "/api/stacks", { projectId: pid || "" });
  },

  async plan(manifest: StackManifest | string, options: { projectId?: string; prune?: boolean } = {}): Promise<StackPlanResult> {
    const pid = options.projectId || app.projectId;
    return makeRequest(HTTPMethod.POST, "/api/stacks/plan", undefined, {
      projectId: pid,
      manifest,
      prune: Boolean(options.prune),
    });
  },

  async apply(manifest: StackManifest | string, options: { projectId?: string; prune?: boolean } = {}): Promise<{ stackId: string; stack: string; deployed: any[] }> {
    const pid = options.projectId || app.projectId;
    return makeRequest(HTTPMethod.POST, "/api/stacks/apply", undefined, {
      projectId: pid,
      manifest,
      prune: Boolean(options.prune),
    });
  },

  async down(stackId: string): Promise<{ success: boolean; removedContainers: number }> {
    return makeRequest(HTTPMethod.POST, `/api/stacks/${stackId}/down`, undefined, {});
  },
};

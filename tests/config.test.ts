import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getConfiguration, updateConfiguration } from "../src/config";
import * as makeRequestModule from "../src/common/makerequest";
import { Configuration, ConfigurationInput } from "../src/config/types";

describe("Config", () => {
  const projectId = "proj-123";

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

  it("should get configuration for project", async () => {
    const mockConfig: Partial<Configuration> = { id: "conf-1", project_id: projectId, brand_name: "Swiftbase" };
    vi.spyOn(makeRequestModule, "makeRequest").mockResolvedValue(mockConfig);

    const config = await getConfiguration(projectId);
    expect(config).toEqual(mockConfig);
    expect(makeRequestModule.makeRequest).toHaveBeenCalledWith(
      makeRequestModule.HTTPMethod.GET,
      `/api/configurations/${projectId}`
    );
  });

  it("should update configuration for project", async () => {
    const input: ConfigurationInput = { brand_name: "Updated Swiftbase", primary_color: "#111111" };
    const mockUpdatedConfig: Partial<Configuration> = { id: "conf-1", project_id: projectId, brand_name: "Updated Swiftbase", primary_color: "#111111" };
    vi.spyOn(makeRequestModule, "makeRequest").mockResolvedValue(mockUpdatedConfig);

    const config = await updateConfiguration(projectId, input);
    expect(config).toEqual(mockUpdatedConfig);
    expect(makeRequestModule.makeRequest).toHaveBeenCalledWith(
      makeRequestModule.HTTPMethod.PUT,
      `/api/configurations/${projectId}`,
      undefined,
      input
    );
  });
});

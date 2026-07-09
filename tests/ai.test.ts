import { describe, it, expect, vi } from "vitest";
import { ai } from "../src/ai";
import { makeRequest, HTTPMethod } from "../src/common/makerequest";

vi.mock("../src/common/makerequest", () => ({
  HTTPMethod: {
    POST: "post"
  },
  makeRequest: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          role: "assistant",
          content: "Hello from AI"
        }
      }
    ]
  })
}));

describe("AI Module", () => {
  it("should successfully trigger a completions endpoint request with correct body options", async () => {
    const res = await ai.chat.completions.create({
      messages: [{ role: "user", content: "hi" }]
    });

    expect(makeRequest).toHaveBeenCalledWith(
      HTTPMethod.POST,
      "/api/ai/chat/completions",
      undefined,
      {
        model: "gemini-3.5-flash",
        messages: [{ role: "user", content: "hi" }]
      }
    );
    expect(res.choices[0].message.content).toBe("Hello from AI");
  });
});

import { makeRequest, HTTPMethod } from "../common/makerequest";

export interface AIChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIChatCompletionOptions {
  model?: string;
  messages: AIChatMessage[];
}

export interface AIChatCompletionResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

/**
 * Generate completion using the AI service.
 */
export const ai = {
  chat: {
    completions: {
      create: async (options: AIChatCompletionOptions): Promise<AIChatCompletionResponse> => {
        return await makeRequest(HTTPMethod.POST, "/api/ai/chat/completions", undefined, {
          model: options.model || "gemini-3.5-flash",
          messages: options.messages,
        });
      }
    }
  }
};

import Token from "./token";

interface SwiftbaseApp {
  projectId: string;
  baseUrl: string;
  accessToken: Token | null;
  serviceId?: string;
  serviceKey?: string;
}

interface initializeSdkOptions {
  baseUrl?: string;
  serviceId?: string;
  serviceKey?: string;
}

export const app: SwiftbaseApp = {
  projectId: "",
  baseUrl: "https://api.swiftbase.io",
  accessToken: null,
};

export const initializeSdk = (projectId: string, options?: initializeSdkOptions) => {
  app.projectId = projectId;
  // Override the default baseUrl if provided
  if (options?.baseUrl) {
    // Remove trailing slash if present
    app.baseUrl = options.baseUrl.endsWith("/") ? options.baseUrl.slice(0, -1) : options.baseUrl;
  }
  if (options?.serviceId) {
    app.serviceId = options.serviceId;
  }
  if (options?.serviceKey) {
    app.serviceKey = options.serviceKey;
  }
};

export const setAccessToken = (token: string, expiration?: number) => {
  if (!token || token === "null" || token === "undefined") {
    app.accessToken = null;
    return;
  }
  app.accessToken = new Token(token, "access", expiration);
};

export const isLoggedIn = () => {
  return !!(app.accessToken && app.accessToken.isValid());
};

export const logout = () => {
  app.accessToken = null;
};


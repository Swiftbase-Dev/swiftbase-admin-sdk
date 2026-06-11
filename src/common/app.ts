import Token from "./token";

interface SwiftbaseApp {
  projectId: string;
  baseUrl: string;
  accessToken: Token | null;
  serviceId?: string;
  serviceKey?: string;
  debounceTimeout: number;

  cacheArticles: boolean;
  searchCacheEnabled: boolean;
  searchCacheCapacity: number;
}

interface initializeSdkOptions {
  baseUrl: string;
  serviceId?: string;
  serviceKey?: string;
  debounceTimeout?: number;

  cacheArticles?: boolean;
  searchCacheEnabled?: boolean;
  searchCacheCapacity?: number;
}

export const app: SwiftbaseApp = {
  projectId: "",
  baseUrl: "https://api.swiftbase.io",
  accessToken: null,
  debounceTimeout: 300,
  cacheArticles: true,
  searchCacheEnabled: true,
  searchCacheCapacity: 50,
};

export const initializeSdk = (projectId: string, options: initializeSdkOptions) => {
  app.projectId = projectId;
  // Override the default baseUrl if provided
  if (options?.baseUrl) {
    // Remove trailing slash if present
    app.baseUrl = options.baseUrl.endsWith("/") ? options.baseUrl.slice(0, -1) : options.baseUrl;
  }
  // Set the debounce timeout if provided
  if (options?.debounceTimeout !== undefined) {
    app.debounceTimeout = options.debounceTimeout;
  }
  // Set the cacheArticles flag if provided
  if (options?.cacheArticles !== undefined) {
    app.cacheArticles = options.cacheArticles;
  }
  // Set the search cache options if provided
  if (options?.searchCacheEnabled !== undefined) {
    app.searchCacheEnabled = options.searchCacheEnabled;
  }
  if (options?.searchCacheCapacity !== undefined) {
    app.searchCacheCapacity = options.searchCacheCapacity;
  }
  if (options?.serviceId) {
    app.serviceId = options.serviceId;
  }
  if (options?.serviceKey) {
    app.serviceKey = options.serviceKey;
  }
};

export const setAccessToken = (token: string, expiration?: number) => {
  app.accessToken = new Token(token, "access", expiration);
};

export const isLoggedIn = () => {
  return !!(app.accessToken && app.accessToken.isValid());
};

export const logout = () => {
  app.accessToken = null;
};


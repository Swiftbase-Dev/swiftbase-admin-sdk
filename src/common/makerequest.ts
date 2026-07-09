import { app } from "./app";

export enum HTTPMethod {
  GET = "get",
  POST = "post",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
}

export class Unauthorized extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, Unauthorized.prototype);
  }
}

export class Forbidden extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, Forbidden.prototype);
  }
}

export class BadRequest extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, BadRequest.prototype);
  }
}

export class TooManyRequests extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, TooManyRequests.prototype);
  }
}

const handleRequestError = (status: number) => {
  if (status === 401) {
    throw new Unauthorized("Unauthorized");
  } else if (status === 403) {
    throw new Forbidden("Forbidden");
  } else if (status === 400) {
    throw new BadRequest("Bad Request");
  } else if (status === 429) {
    throw new TooManyRequests("Too Many Requests");
  } else {
    throw new Error("Unexpected error");
  }
};

interface RESTPaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    next: string | null;
    back: string | null;
  };
}

export class PaginatedResponse<T> {
  #data: T[] = [];
  #meta: RESTPaginatedResponse<T>["meta"];

  constructor(response: RESTPaginatedResponse<T>) {
    this.#data = response.data;
    this.#meta = response.meta;
  }

  get items() {
    return this.#data;
  }

  get total() {
    return this.#meta.total;
  }

  get page() {
    return this.#meta.page;
  }

  get limit() {
    return this.#meta.limit;
  }

  get hasNext() {
    return !!this.#meta.next;
  }

  get hasBack() {
    return !!this.#meta.back;
  }

  async next(): Promise<PaginatedResponse<T> | null> {
    if (!this.#meta.next) return null;
    return await makeRequest(HTTPMethod.GET, this.#meta.next);
  }

  async back(): Promise<PaginatedResponse<T> | null> {
    if (!this.#meta.back) return null;
    return await makeRequest(HTTPMethod.GET, this.#meta.back);
  }
}

export const makeRequest = async (
  method: HTTPMethod,
  path: string,
  params?: object | undefined,
  body?: object | undefined,
) => {
  // Check for valid access token if needed (some routes might be public)
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Automatically get token if missing/expired
  if (path !== "/oauth2/token" && !path.includes("/login")) {
    const { getAccessToken } = await import("../auth/getaccesstoken");
    const token = await getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  } else if (app.accessToken && app.accessToken.isValid()) {
    headers["Authorization"] = `Bearer ${app.accessToken.value()}`;
  }

  // Construct url
  let base = app.baseUrl || "https://api.swiftbase.io";
  if (!base.includes("localhost") && !base.includes("127.0.0.1")) {
    if (path.includes("/db/") || path.includes("/database") || path.includes("/tables") || path.includes("/sql") || path.includes("/queries")) {
      base = base.replace("api.swiftbase", "database.swiftbase");
    } else if (path.includes("/oauth2") || path.includes("/login") || path.includes("/api/roles") || path.includes("/api/services") || path.includes("/api/users") || path.includes("/api/me")) {
      base = base.replace("api.swiftbase", "identity.swiftbase");
    } else {
      base = base.replace("api.swiftbase", "app.swiftbase");
    }
  }
  let url = path.startsWith("http") ? path : `${base}${!path.startsWith("/") ? "/" : ""}${path}`;
  
  // Append query params if provided
  if (params) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) query.append(key, String(value));
    }
    const queryString = query.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      let message = "";
      try {
        const bodyText = await response.text();
        try {
          const parsed = JSON.parse(bodyText);
          message = parsed.message || parsed.error || bodyText;
        } catch {
          message = bodyText;
        }
      } catch (_) {}
      
      const errorMsg = message ? `HTTP ${response.status}: ${message}` : `HTTP error ${response.status}`;
      console.error(errorMsg);
      if (response.status === 401) {
        throw new Unauthorized(errorMsg);
      } else if (response.status === 403) {
        throw new Forbidden(errorMsg);
      } else if (response.status === 400) {
        throw new BadRequest(errorMsg);
      } else if (response.status === 429) {
        throw new TooManyRequests(errorMsg);
      } else {
        throw new Error(errorMsg);
      }
    }
    const data = await response.json();
    
    // Check if response is paginated (new REST format)
    if (data.data !== undefined && data.meta !== undefined) {
      return new PaginatedResponse(data);
    } else {
      return data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

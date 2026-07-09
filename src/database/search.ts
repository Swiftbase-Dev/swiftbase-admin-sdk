import { app } from "../common/app";

export async function search(indexId: string, query: string): Promise<any[]> {
  if (!indexId || !query) {
    throw new Error("indexId and query are required to perform a search");
  }

  // Use fetch direct logic in sbcms/admin-sdk context
  const baseUrl = app.baseUrl || "https://api.swiftbase.io";
  const token = app.accessToken || "";
  const res = await fetch(`${baseUrl}/api/search/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : ""
    },
    body: JSON.stringify({ indexId, query })
  });

  if (!res.ok) {
    throw new Error("Failed to execute search query against Swiftbase indexes");
  }

  const data = await res.json();
  return data || [];
}

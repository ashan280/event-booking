import { getAuth } from "./auth";

const API_BASE_URL = "http://localhost:8080";

export async function apiRequest(path, options = {}) {
  const auth = getAuth();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.auth ? { Authorization: `Bearer ${auth?.token || ""}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

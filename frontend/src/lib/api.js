import { getAuth } from "./auth";

const runtimeApiUrl = typeof window !== "undefined" ? window.__APP_CONFIG__?.apiUrl : "";
const API_BASE_URL = (runtimeApiUrl || import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "");

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

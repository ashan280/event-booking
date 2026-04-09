const AUTH_KEY = "eventhub_auth";

export function saveAuth(authData) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
}

export function getAuth() {
  const raw = localStorage.getItem(AUTH_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

export function isLoggedIn(authData = getAuth()) {
  return Boolean(authData?.token);
}

export function isAdmin(authData = getAuth()) {
  return authData?.role === "ADMIN";
}

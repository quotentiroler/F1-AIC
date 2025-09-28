export function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T) {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function readString(key: string, fallback = "") {
  if (!isBrowser()) return fallback;
  return localStorage.getItem(key) ?? fallback;
}

export function writeString(key: string, value: string) {
  if (!isBrowser()) return;
  localStorage.setItem(key, value);
}

export function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function safeLocalStorageGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    return safeParse(window.localStorage.getItem(key), fallback);
  } catch {
    return fallback;
  }
}

export function safeLocalStorageSet(key: string, value: unknown): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage may be unavailable or full; ignore and continue in-memory.
  }
}

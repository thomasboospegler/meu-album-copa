const storagePrefix = "meu-album-copa";

function getStorageKey(key: string) {
  return `${storagePrefix}:${key}`;
}

export function readFromLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  const rawValue = window.localStorage.getItem(getStorageKey(key));

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

export function writeToLocalStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getStorageKey(key), JSON.stringify(value));
}

export function removeFromLocalStorage(key: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getStorageKey(key));
}

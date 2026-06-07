import { useState, useEffect } from "react";

const API = "https://functions.poehali.dev/ee0c9d49-3da0-4e2e-a2ab-1f68f29a1405";
const CACHE_TTL = 30_000; // 30 секунд

let cache: Record<string, unknown> | null = null;
let cacheTime = 0;
let fetchPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

function loadSiteData(force = false): Promise<void> {
  const now = Date.now();
  if (!force && cache && now - cacheTime < CACHE_TTL) return Promise.resolve();
  if (fetchPromise) return fetchPromise;
  fetchPromise = fetch(`${API}?action=site_data`, {
    headers: { "X-Authorization": "Bearer " },
    cache: "no-store",
  })
    .then(r => r.json())
    .then(d => {
      const data = d.data ?? d;
      if (data && typeof data === "object") { cache = data as Record<string, unknown>; cacheTime = Date.now(); }
    })
    .catch(() => {})
    .finally(() => { fetchPromise = null; });
  return fetchPromise;
}

export function invalidateSiteCache() {
  cache = null;
  cacheTime = 0;
  fetchPromise = null;
  listeners.forEach(fn => fn());
}

// Слушаем postMessage от iframe-родителя (из AdminPanel)
if (typeof window !== "undefined") {
  window.addEventListener("message", (e) => {
    if (e.data === "site_data_updated") {
      invalidateSiteCache();
    }
  });
}

export function useSiteData<T>(key: string, defaultValue: T): T {
  const [data, setData] = useState<T>(() => {
    if (cache && cache[key] !== undefined) return cache[key] as T;
    return defaultValue;
  });

  useEffect(() => {
    const reload = (force = false) => {
      loadSiteData(force).then(() => {
        if (cache && cache[key] !== undefined) {
          setData(cache[key] as T);
        }
      });
    };

    reload();
    listeners.add(reload);
    return () => { listeners.delete(reload); };
     
  }, [key]);

  return data;
}
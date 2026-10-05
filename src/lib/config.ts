/**
 * Central runtime configuration.
 *
 * INTEGRATION POINT: set these in a `.env` file:
 *   VITE_API_BASE_URL=http://localhost:8000   # FastAPI ML backend
 *   VITE_MOCK_MODE=false                       # true = demo data, NEVER for production
 *   VITE_MAX_UPLOAD_MB=25
 *   VITE_ANALYZE_TIMEOUT_MS=180000
 */
const env = import.meta.env;

export const API_BASE_URL: string = (env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "http://localhost:8000";
export const MAX_UPLOAD_MB = Number(env.VITE_MAX_UPLOAD_MB ?? 25);
export const ANALYZE_TIMEOUT_MS = Number(env.VITE_ANALYZE_TIMEOUT_MS ?? 180_000);
export const REQUEST_TIMEOUT_MS = 20_000;

const ENV_MOCK = String(env.VITE_MOCK_MODE ?? "false") === "true";
const MOCK_KEY = "researchai.mockMode";
export const MOCK_EVENT = "researchai:mock-mode";

/** MOCK_MODE: env default, can be toggled at runtime (stored locally) for demos. */
export function isMockMode(): boolean {
  if (typeof window === "undefined") return ENV_MOCK;
  const v = window.localStorage.getItem(MOCK_KEY);
  return v === null ? ENV_MOCK : v === "true";
}

export function setMockMode(on: boolean) {
  window.localStorage.setItem(MOCK_KEY, String(on));
  window.dispatchEvent(new Event(MOCK_EVENT));
}

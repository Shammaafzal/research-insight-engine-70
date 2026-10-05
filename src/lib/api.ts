/**
 * Centralized API service layer for the ResearchAI FastAPI backend.
 * INTEGRATION POINT: change endpoint paths here only — components never build URLs.
 */
import { API_BASE_URL, ANALYZE_TIMEOUT_MS, MAX_UPLOAD_MB, REQUEST_TIMEOUT_MS, isMockMode } from "./config";
import type { Conference, PaperAnalysis, PaperListItem } from "./types";
import * as mock from "./mock";

export const ENDPOINTS = {
  analyze: "/api/analyze",
  papers: "/api/papers",
  paper: (id: string) => `/api/papers/${encodeURIComponent(id)}`,
  conferences: "/api/conferences",
};

export type ApiErrorKind =
  | "unavailable"
  | "timeout"
  | "invalid_file"
  | "too_large"
  | "empty"
  | "processing"
  | "not_found"
  | "unknown";

const MESSAGES: Record<ApiErrorKind, string> = {
  unavailable: "The ML backend is unavailable. Please make sure the analysis server is running and try again.",
  timeout: "The analysis took too long to respond. Please try again.",
  invalid_file: "This file doesn't look like a valid PDF. Please upload a PDF research paper.",
  too_large: `This file is too large. The maximum size is ${MAX_UPLOAD_MB} MB.`,
  empty: "This PDF appears to be empty or contains no readable text.",
  processing: "Unable to analyze this paper right now. Please try again.",
  not_found: "We couldn't find this analysis. It may have been deleted.",
  unknown: "Something went wrong. Please try again.",
};

export class ApiError extends Error {
  kind: ApiErrorKind;
  status?: number;
  constructor(kind: ApiErrorKind, status?: number, message?: string) {
    super(message ?? MESSAGES[kind]);
    this.kind = kind;
    this.status = status;
  }
}

export function friendlyError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;
  return new ApiError("unknown");
}

export function resolveAssetUrl(url?: string | null) {
  if (!url) return null;
  if (/^(https?:|data:|blob:)/.test(url)) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function kindFromStatus(status: number, detail?: string): ApiErrorKind {
  const d = (detail ?? "").toLowerCase();
  if (status === 404) return "not_found";
  if (status === 413) return "too_large";
  if (status === 408 || status === 504) return "timeout";
  if (status === 415 || d.includes("invalid pdf")) return "invalid_file";
  if (d.includes("empty")) return "empty";
  if (status === 502 || status === 503) return "unavailable";
  if (status >= 400 && status < 500) return "invalid_file";
  return "processing";
}

async function request<T>(path: string, init: RequestInit = {}, timeoutMs = REQUEST_TIMEOUT_MS): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, { ...init, signal: ctrl.signal });
  } catch (e) {
    throw new ApiError((e as Error).name === "AbortError" ? "timeout" : "unavailable");
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    let detail: string | undefined;
    try {
      const j = await res.json();
      detail = typeof j?.detail === "string" ? j.detail : undefined;
    } catch {
      /* ignore non-JSON */
    }
    throw new ApiError(kindFromStatus(res.status, detail), res.status);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Defensive normalization so partially-filled backend responses never crash the UI. */
export function normalizeAnalysis(raw: Partial<PaperAnalysis> & { paper_id: string }): PaperAnalysis {
  if (!raw?.paper_id || !raw.prediction) throw new ApiError("processing");
  return {
    paper_id: raw.paper_id,
    title: raw.title || raw.metadata?.title || "Untitled paper",
    created_at: raw.created_at,
    status: raw.status ?? "completed",
    prediction: raw.prediction,
    top_predictions: raw.top_predictions ?? [],
    summary: raw.summary ?? {},
    metadata: raw.metadata ?? {},
    shap: raw.shap ?? {},
    figures: raw.figures ?? [],
    citations: raw.citations ?? [],
    conferences: raw.conferences ?? [],
    conferences_error: raw.conferences_error ?? null,
  };
}

/** Client-side PDF validation before upload. */
export async function validatePdf(file: File): Promise<void> {
  if (file.size === 0) throw new ApiError("empty");
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) throw new ApiError("too_large");
  const isPdfName = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdfName) throw new ApiError("invalid_file");
  const head = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  const magic = String.fromCharCode(...head);
  if (!magic.startsWith("%PDF")) throw new ApiError("invalid_file");
}

export const api = {
  /** POST /api/analyze — multipart upload with field name `file`. */
  analyzePaper(file: File, onUploadProgress?: (pct: number) => void): Promise<PaperAnalysis> {
    if (isMockMode()) return mock.mockAnalyze(file, onUploadProgress);
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_BASE_URL}${ENDPOINTS.analyze}`);
      xhr.timeout = ANALYZE_TIMEOUT_MS;
      xhr.responseType = "json";
      xhr.upload.onprogress = (e) => e.lengthComputable && onUploadProgress?.(Math.round((e.loaded / e.total) * 100));
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(normalizeAnalysis(xhr.response));
          } catch (e) {
            reject(friendlyError(e));
          }
        } else {
          reject(new ApiError(kindFromStatus(xhr.status, xhr.response?.detail), xhr.status));
        }
      };
      xhr.onerror = () => reject(new ApiError("unavailable"));
      xhr.ontimeout = () => reject(new ApiError("timeout"));
      const form = new FormData();
      form.append("file", file);
      xhr.send(form);
    });
  },

  /** GET /api/papers/{id} */
  async getPaper(id: string): Promise<PaperAnalysis> {
    if (isMockMode()) return mock.mockGetPaper(id);
    return normalizeAnalysis(await request(ENDPOINTS.paper(id)));
  },

  /** GET /api/papers */
  async listPapers(): Promise<PaperListItem[]> {
    if (isMockMode()) return mock.mockListPapers();
    const data = await request<PaperListItem[] | { items: PaperListItem[] }>(ENDPOINTS.papers);
    return Array.isArray(data) ? data : (data?.items ?? []);
  },

  /** DELETE /api/papers/{id} */
  async deletePaper(id: string): Promise<void> {
    if (isMockMode()) return mock.mockDelete(id);
    await request(ENDPOINTS.paper(id), { method: "DELETE" });
  },

  /** GET /api/conferences?field=...&paper_id=... */
  async getConferences(params: { field?: string; paper_id?: string } = {}): Promise<Conference[]> {
    if (isMockMode()) return mock.mockConferences(params.field);
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]).toString();
    const data = await request<Conference[] | { items: Conference[] }>(`${ENDPOINTS.conferences}${qs ? `?${qs}` : ""}`);
    return Array.isArray(data) ? data : (data?.items ?? []);
  },
};

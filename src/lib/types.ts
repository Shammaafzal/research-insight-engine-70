/** Shapes returned by the FastAPI ML backend. All fields beyond ids are optional-safe. */

export interface FieldPrediction {
  field: string;
  confidence: number; // 0..1
}

export interface PaperSummaryContent {
  short_summary?: string | null;
  key_contributions?: string[] | null;
  methodology?: string | null;
  main_findings?: string[] | string | null;
  research_area?: string | null;
}

export interface PaperMetadata {
  title?: string | null;
  authors?: string[] | null;
  abstract?: string | null;
  keywords?: string[] | null;
  publication?: string | null;
  year?: number | string | null;
  doi?: string | null;
  num_pages?: number | null;
  num_figures?: number | null;
  num_references?: number | null;
}

export interface ShapFeature {
  feature: string;
  value: number; // signed SHAP contribution
  modality?: "text" | "visual" | string;
}

export interface ShapExplanation {
  features?: ShapFeature[];
  explanation?: string | null;
  base_value?: number | null;
}

export interface ExtractedFigure {
  id: string;
  number?: number | string;
  caption?: string | null;
  image_url?: string | null; // absolute or relative to API_BASE_URL
  image_base64?: string | null;
  page?: number | null;
  embedding_status?: "processed" | "skipped" | "failed" | string | null;
  visual_info?: Record<string, string | number> | null;
}

export interface Citation {
  id?: string;
  authors?: string[] | string | null;
  year?: number | string | null;
  title?: string | null;
  venue?: string | null;
  raw?: string | null;
}

export interface Conference {
  name: string;
  field?: string | null;
  match_score?: number | null; // 0..1
  deadline?: string | null;
  conference_date?: string | null;
  location?: string | null;
  description?: string | null;
  url?: string | null;
}

export interface PaperAnalysis {
  paper_id: string;
  title: string;
  created_at?: string;
  status?: string;
  prediction: FieldPrediction;
  top_predictions: FieldPrediction[];
  summary: PaperSummaryContent;
  metadata: PaperMetadata;
  shap: ShapExplanation;
  figures: ExtractedFigure[];
  citations: Citation[];
  conferences: Conference[];
  conferences_error?: string | null;
}

export interface PaperListItem {
  paper_id: string;
  title: string;
  created_at: string;
  predicted_field: string | null;
  confidence: number | null;
  status: "completed" | "processing" | "failed" | string;
}

export const RESEARCH_FIELDS = [
  "Machine Learning",
  "Natural Language Processing",
  "Computer Vision",
  "Information Retrieval",
  "Artificial Intelligence",
  "Language Models / Machine Learning",
  "General AI",
] as const;

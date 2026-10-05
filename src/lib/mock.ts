/**
 * ⚠️ MOCK MODE ONLY — demo data for presentations when the ML backend is offline.
 * Never used unless MOCK_MODE is enabled. Values here are NOT model outputs.
 * Conference deadlines/dates are intentionally left null (never invented).
 */
import type { Conference, PaperAnalysis, PaperListItem } from "./types";
import { ApiError } from "./api";

const KEY = "researchai.mock.papers";
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function load(): PaperAnalysis[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}
function save(items: PaperAnalysis[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

const PROFILES: Record<string, { words: string[]; confs: Conference[] }> = {
  "Computer Vision": {
    words: ["convolutional backbone", "image segmentation", "object detection", "feature maps", "ImageNet", "patch embedding", "bounding box", "augmentation"],
    confs: [
      { name: "CVPR", field: "Computer Vision", url: "https://cvpr.thecvf.com", description: "IEEE/CVF Conference on Computer Vision and Pattern Recognition." },
      { name: "ICCV", field: "Computer Vision", url: "https://iccv.thecvf.com", description: "International Conference on Computer Vision." },
      { name: "ECCV", field: "Computer Vision", url: "https://eccv.ecva.net", description: "European Conference on Computer Vision." },
    ],
  },
  "Natural Language Processing": {
    words: ["transformer encoder", "tokenization", "language model", "named entity", "BLEU score", "attention heads", "corpus", "fine-tuning"],
    confs: [
      { name: "ACL", field: "Natural Language Processing", url: "https://www.aclweb.org", description: "Annual Meeting of the Association for Computational Linguistics." },
      { name: "EMNLP", field: "Natural Language Processing", url: "https://www.aclweb.org", description: "Conference on Empirical Methods in Natural Language Processing." },
    ],
  },
  "Machine Learning": {
    words: ["gradient descent", "generalization bound", "regularization", "stochastic", "loss landscape", "benchmark", "optimizer", "variance"],
    confs: [
      { name: "NeurIPS", field: "Machine Learning", url: "https://neurips.cc", description: "Conference on Neural Information Processing Systems." },
      { name: "ICML", field: "Machine Learning", url: "https://icml.cc", description: "International Conference on Machine Learning." },
      { name: "ICLR", field: "Machine Learning", url: "https://iclr.cc", description: "International Conference on Learning Representations." },
    ],
  },
};
const FIELDS = Object.keys(PROFILES);

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export async function mockAnalyze(file: File, onProgress?: (p: number) => void): Promise<PaperAnalysis> {
  for (let p = 0; p <= 100; p += 20) {
    onProgress?.(p);
    await wait(120);
  }
  await wait(9000);
  const h = hash(file.name + file.size);
  const field = FIELDS[h % FIELDS.length];
  const prof = PROFILES[field];
  const conf = 0.78 + ((h % 17) / 100);
  const others = ["Machine Learning", "Artificial Intelligence", "Computer Vision", "Natural Language Processing"].filter((f) => f !== field);
  const rest = 1 - conf;
  const title = file.name.replace(/\.pdf$/i, "").replace(/[_-]+/g, " ");
  const analysis: PaperAnalysis = {
    paper_id: `mock-${Date.now().toString(36)}`,
    title,
    created_at: new Date().toISOString(),
    status: "completed",
    prediction: { field, confidence: conf },
    top_predictions: [
      { field, confidence: conf },
      { field: others[0], confidence: rest * 0.6 },
      { field: others[1], confidence: rest * 0.25 },
      { field: "Other", confidence: rest * 0.15 },
    ],
    summary: {
      short_summary: `[Mock] This paper proposes a method in ${field.toLowerCase()} and evaluates it on standard benchmarks.`,
      key_contributions: ["[Mock] A new architecture for the target task", "[Mock] An extensive ablation study", "[Mock] Public release of code"],
      methodology: "[Mock] The authors train a deep model end-to-end and compare against strong baselines.",
      main_findings: ["[Mock] Improves over baselines on two benchmarks", "[Mock] Ablations confirm each component's contribution"],
      research_area: field,
    },
    metadata: { title, authors: null, abstract: null, keywords: prof.words.slice(0, 4), publication: null, year: null, num_pages: 8 + (h % 6), num_figures: 3, num_references: 5 },
    shap: {
      features: prof.words.map((w, i) => ({ feature: w, value: +(0.32 - i * 0.035).toFixed(3) * (i === 7 ? -0.4 : 1), modality: i === 5 ? "visual" : "text" })),
      explanation: `[Mock] Terms strongly associated with ${field} pushed the prediction upward.`,
      base_value: 0.14,
    },
    figures: [1, 2, 3].map((n) => ({ id: `f${n}`, number: n, caption: `[Mock] Figure ${n} caption`, image_url: null, page: n + 1, embedding_status: "processed" })),
    citations: [
      { authors: ["A. Vaswani", "N. Shazeer"], year: 2017, title: "Attention Is All You Need", venue: "NeurIPS" },
      { authors: ["K. He", "X. Zhang"], year: 2016, title: "Deep Residual Learning for Image Recognition", venue: "CVPR" },
      { authors: ["I. Beltagy", "K. Lo", "A. Cohan"], year: 2019, title: "SciBERT: A Pretrained Language Model for Scientific Text", venue: "EMNLP" },
      { authors: ["A. Dosovitskiy"], year: 2021, title: "An Image is Worth 16x16 Words", venue: "ICLR" },
      { authors: ["S. Lundberg", "S.-I. Lee"], year: 2017, title: "A Unified Approach to Interpreting Model Predictions", venue: "NeurIPS" },
    ],
    conferences: prof.confs.map((c, i) => ({ ...c, match_score: 0.94 - i * 0.07, deadline: null, conference_date: null, location: null })),
  };
  save([analysis, ...load()]);
  return analysis;
}

export async function mockGetPaper(id: string) {
  await wait(300);
  const p = load().find((x) => x.paper_id === id);
  if (!p) throw new ApiError("not_found", 404);
  return p;
}

export async function mockListPapers(): Promise<PaperListItem[]> {
  await wait(300);
  return load().map((p) => ({
    paper_id: p.paper_id,
    title: p.title,
    created_at: p.created_at ?? new Date().toISOString(),
    predicted_field: p.prediction.field,
    confidence: p.prediction.confidence,
    status: p.status ?? "completed",
  }));
}

export async function mockDelete(id: string) {
  await wait(200);
  save(load().filter((p) => p.paper_id !== id));
}

export async function mockConferences(field?: string): Promise<Conference[]> {
  await wait(300);
  const list = field && PROFILES[field] ? PROFILES[field].confs : Object.values(PROFILES).flatMap((p) => p.confs);
  return list.map((c) => ({ ...c, match_score: null, deadline: null, conference_date: null, location: null }));
}

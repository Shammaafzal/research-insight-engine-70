import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import { SectionHeader } from "@/components/research/states";

export const Route = createFileRoute("/_app/about")({
  head: () => ({
    meta: [
      { title: "About the Project – ResearchAI" },
      { name: "description", content: "Architecture, problem statement and objectives of the ResearchAI multimodal classifier." },
      { property: "og:title", content: "About the Project – ResearchAI" },
      { property: "og:description", content: "SciBERT + ViT + multimodal fusion + SHAP explainability." },
    ],
  }),
  component: About,
});

const PIPELINE = [
  "PDF Research Paper",
  "Text Extraction + Figure Extraction",
  "SciBERT + Vision Transformer",
  "Multimodal Feature Fusion",
  "Dense + Softmax Classifier",
  "Research Field Prediction",
  "SHAP Explainability",
  "Conference Recommendation",
];

function About() {
  return (
    <div className="mx-auto max-w-5xl">
      <SectionHeader eyebrow="Final-year project" title="About ResearchAI" description="An intelligent research paper classification system — From Chaos to Knowledge." />
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {[
            ["Problem Statement", "Digital libraries contain huge collections of research papers. Keyword-based searching can produce irrelevant results because terminology overlaps across different domains and authors use different writing styles."],
            ["Project Objective", "Build an AI-driven system that intelligently classifies research papers into research fields and assists researchers in discovering and organizing scientific literature."],
            ["Research Gap", "Existing approaches often rely primarily on text or metadata and may not fully utilize visual information such as figures, tables, charts and equations."],
          ].map(([t, d]) => (
            <section key={t} className="surface p-6">
              <h2 className="font-display text-2xl">{t}</h2>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </section>
          ))}
          <section className="surface p-6">
            <h2 className="font-display text-2xl">Our Approach</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["SciBERT", "Domain-specific language model producing contextual embeddings of scientific text."],
                ["Vision Transformer", "Encodes extracted figures, charts and tables into visual embeddings."],
                ["Multimodal Fusion", "Combines text and visual embeddings into a joint representation."],
                ["SHAP Explainability", "Attributes the prediction to individual words and features."],
              ].map(([t, d]) => (
                <div key={t} className="rounded-xl bg-muted p-4">
                  <p className="font-medium">{t}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <aside className="surface h-fit p-6">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">Architecture</p>
          <ol className="flex flex-col items-center">
            {PIPELINE.map((s, i) => (
              <li key={s} className="flex w-full flex-col items-center">
                <div className="w-full rounded-lg border bg-background px-4 py-2.5 text-center text-sm font-medium">{s}</div>
                {i < PIPELINE.length - 1 && <ArrowDown className="my-1 h-4 w-4 text-muted-foreground" />}
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, FileText, Images, Layers, Lightbulb, Quote, ScrollText, Sparkles, Trophy, Microscope, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/research/AppShell";
import { MockBanner } from "@/components/research/states";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ResearchAI – From Research Papers to Knowledge" },
      { name: "description", content: "AI-powered research paper classification using SciBERT, Vision Transformer, multimodal fusion and SHAP explainability." },
      { property: "og:title", content: "ResearchAI – From Research Papers to Knowledge" },
      { property: "og:description", content: "Multimodal research paper classification with explainable AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FLOW = [
  { label: "PDF", icon: FileText },
  { label: "Text + Figures", icon: Images },
  { label: "SciBERT + ViT", icon: Brain },
  { label: "Feature Fusion", icon: Layers },
  { label: "Classification", icon: Sparkles },
  { label: "Explanation", icon: Lightbulb },
];

const FEATURES = [
  { icon: Microscope, title: "AI Research Classification", text: "Predicts the research field of a paper with calibrated confidence scores." },
  { icon: Layers, title: "Multimodal Analysis", text: "Combines SciBERT text embeddings with ViT embeddings of figures and charts." },
  { icon: Lightbulb, title: "Explainable AI", text: "SHAP values reveal which words and features drove each prediction." },
  { icon: ScrollText, title: "Paper Summarization", text: "Concise summaries of contributions, methodology and findings." },
  { icon: Quote, title: "Citation Extraction", text: "Searchable reference lists parsed directly from the PDF." },
  { icon: Trophy, title: "Conference Recommendations", text: "Suggests venues that match the paper's field and content." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <MockBanner />
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex"><Link to="/about">About</Link></Button>
          <Button asChild variant="ghost" className="hidden sm:inline-flex"><Link to="/dashboard">Dashboard</Link></Button>
          <Button asChild><Link to="/analyze">Analyze a Paper</Link></Button>
        </nav>
      </header>

      <section className="relative overflow-hidden">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-6 pb-20 pt-16 text-center md:pt-24">
          <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 font-mono text-xs text-muted-foreground animate-fade-up">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> SciBERT · ViT · Multimodal Fusion · SHAP
          </p>
          <h1 className="font-display text-5xl leading-[1.05] md:text-7xl animate-fade-up">
            From Research Papers <br className="hidden sm:block" /> to <em className="text-accent-ink">Knowledge</em>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground animate-fade-up">
            AI-powered research paper classification using multimodal scientific understanding.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3 animate-fade-up">
            <Button asChild size="lg"><Link to="/analyze">Analyze a Paper <ArrowRight /></Link></Button>
            <Button asChild size="lg" variant="outline"><a href="#features">Explore Features</a></Button>
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pb-24">
          <div className="surface flex flex-col items-stretch gap-2 p-4 md:flex-row md:items-center md:p-6">
            {FLOW.map(({ label, icon: Icon }, i) => (
              <div key={label} className="flex flex-1 items-center gap-2 md:flex-col md:gap-0">
                <div className="flex flex-1 items-center gap-3 rounded-xl bg-muted/60 p-3 md:w-full md:flex-col md:gap-2 md:py-5">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-card text-primary shadow-card"><Icon className="h-5 w-5" /></span>
                  <span className="text-sm font-medium md:text-center">{label}</span>
                </div>
                {i < FLOW.length - 1 && <ChevronRight className="hidden h-4 w-4 shrink-0 text-muted-foreground md:absolute md:hidden" />}
              </div>
            ))}
          </div>
          <p className="mt-3 text-center font-mono text-xs text-muted-foreground">PDF → Text + Figures → SciBERT + ViT → Feature Fusion → Classification → Explanation</p>
        </div>
      </section>

      <section id="features" className="border-t bg-card/50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Capabilities</p>
          <h2 className="mt-2 max-w-xl font-display text-4xl">Everything you need to understand a paper.</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="surface p-6 transition-shadow hover:shadow-lift">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-primary"><Icon className="h-5 w-5" /></span>
                <h3 className="mt-5 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary">Why it matters</p>
            <h2 className="mt-2 font-display text-4xl">Keyword search isn't enough for science.</h2>
          </div>
          <div className="space-y-4 text-muted-foreground">
            <p>Digital libraries hold millions of papers. Terminology overlaps across domains and writing styles vary, so keyword search returns noisy, irrelevant results.</p>
            <p>ResearchAI reads both the text <em>and</em> the figures of a paper, classifies it into a research field, and explains its reasoning — helping researchers organize literature and find the right venue faster.</p>
            <Button asChild variant="link" className="px-0"><Link to="/about">Read about the architecture <ArrowRight /></Link></Button>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-xs text-muted-foreground">ResearchAI — From Chaos to Knowledge · Final-year project</footer>
    </div>
  );
}

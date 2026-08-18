import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Sparkles,
  Rocket,
  BookOpen,
  Cpu,
  Database,
  Bot,
  Workflow,
  Server,
  Trophy,
  Presentation,
  Clock,
  Users,
  GraduationCap,
  Check,
  Target,
} from "lucide-react";

export const Route = createFileRoute("/curriculum")({
  head: () => ({
    meta: [
      { title: "Become an AI Engineer — 10-Week Curriculum | Hooria AI" },
      {
        name: "description",
        content:
          "Week-by-week curriculum for the Become an AI Engineer Bootcamp: Generative AI, RAG, AI Agents, Automation, MLOps and a live capstone demo day.",
      },
      { property: "og:title", content: "Become an AI Engineer — 10-Week Curriculum | Hooria AI" },
      {
        property: "og:description",
        content:
          "10 weeks. 8 modules. 6 portfolio projects. See the full week-by-week bootcamp curriculum.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CurriculumPage,
});

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const [visible, setVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.12 },
    );
    io.observe(ref);
    return () => io.disconnect();
  }, [ref]);
  return (
    <div
      ref={setRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

type Session = { title: string; points: string[] };
type Module = {
  n: string;
  weeks: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  intro?: string;
  sessions: Session[];
  deliverable?: string;
};

const modules: Module[] = [
  {
    n: "00",
    weeks: "Pre-Week · Async",
    title: "Orientation & Environment Setup",
    icon: Sparkles,
    sessions: [
      {
        title: "Welcome & Setup",
        points: [
          "Welcome kit: Discord/WhatsApp community, GitHub setup, dev environment (VS Code + Python + API keys)",
          "\"Meet your cohort\"\u00a0 icebreaker: one AI tool you've used, one you're scared of",
          "Diagnostic quiz to segment skill levels for breakout grouping",
        ],
      },
    ],
  },
  {
    n: "01",
    weeks: "Week 1",
    title: "Foundations of Generative AI",
    icon: BookOpen,
    sessions: [
      {
        title: "Session 1 — How LLMs Actually Work (Without the Math Overload)",
        points: [
          "Tokens, embeddings, transformers explained via live visual demo, not equations",
          "Live build: call your first LLM API (OpenAI/Claude) in Python, in real time",
          "Engagement: \"Guess the next token\" live game using an actual tokenizer",
        ],
      },
      {
        title: "Session 2 — Prompt Engineering as an Engineering Discipline",
        points: [
          "Zero-shot vs few-shot vs chain-of-thought prompting",
          "Structured outputs (JSON mode), system prompts, prompt templates",
          "Live build: prompt-engineer a resume screener bot together as a class",
        ],
      },
    ],
    deliverable: "Prompt library (10 reusable, tested prompts) first portfolio piece",
  },
  {
    n: "02",
    weeks: "Week 2",
    title: "Working with LLM APIs Like an Engineer",
    icon: Cpu,
    sessions: [
      {
        title: "Session 1 — Beyond the Playground: Production API Patterns",
        points: [
          "Streaming responses, token limits, cost management, error handling, retries",
          "Function calling / tool use fundamentals",
          "Live build: a CLI tool that summarizes any PDF a student uploads",
        ],
      },
      {
        title: "Session 2 — Structuring LLM Apps with FastAPI",
        points: [
          "Wrapping an LLM call in a real backend endpoint",
          "Environment variables, API key security (no leaked keys on GitHub)",
          "Live build: deploy a working /summarize endpoint",
        ],
      },
    ],
    deliverable: "\"PDF Summarizer API\" — first deployed project, shareable link",
  },
  {
    n: "03",
    weeks: "Weeks 3–4",
    title: "Retrieval-Augmented Generation (RAG)",
    icon: Database,
    sessions: [
      {
        title: "Session 1 — Why RAG? The \"My Chatbot Doesn't Know My Data\" Problem",
        points: [
          "Embeddings, vector similarity, chunking strategy",
          "Live build: embed a set of PDFs and query them semantically",
        ],
      },
      {
        title: "Session 2 — Vector Databases in Practice",
        points: [
          "Qdrant / Pinecone / ChromaDB\u00a0\u00a0",
          "Chunk size trade-offs, metadata filtering, hybrid search",
          "Live build: RAG pipeline over university course notes",
        ],
      },
      {
        title: "Session 3 — RAG Failure Modes & Fixes",
        points: [
          "Hallucination under RAG, re-ranking, citation grounding",
          "Breakout rooms: teams debug a deliberately broken RAG pipeline\u00a0",
        ],
      },
      {
        title: "Session 4 — Building a Full RAG Chatbot",
        points: ["Combine everything into a chat UI (Streamlit or simple Next.js frontend)"],
      },
    ],
    deliverable: "\"Chat With Your Documents\" app\u00a0 the most in-demand freelance gig type on Upwork/Fiverr",
  },
  {
    n: "04",
    weeks: "Weeks 5–6",
    title: "AI Agents",
    icon: Bot,
    sessions: [
      {
        title: "Session 1 — What Makes Something an \"Agent\"?",
        points: [
          "Agents vs chains vs simple LLM calls\u00a0 clear mental model",
          "ReAct pattern, planning, tool use loops",
          "Live build: an agent that can search the web and do math with visible reasoning trace",
        ],
      },
      {
        title: "Session 2 — Building Agents with a Framework",
        points: [
          "LangChain / LangGraph or CrewAI\u00a0 chosen by current market demand",
          "Multi-tool agents, memory, guardrails",
          "Live build: a research agent that compiles a mini report from 3 sources",
        ],
      },
      {
        title: "Session 3 — Multi-Agent Systems",
        points: [
          "Agent-to-agent handoff, orchestrator patterns",
          "Team challenge: each group builds one agent role (researcher, writer, critic) and combines into one pipeline",
        ],
      },
      {
        title: "Session 4 — Agent Reliability & Guardrails",
        points: ["Rate limiting, cost control, human-in-the-loop checkpoints, evaluation"],
      },
    ],
    deliverable: "\"Autonomous Research Assistant\"\u00a0 flagship portfolio piece #3",
  },
  {
    n: "05",
    weeks: "Week 7",
    title: "Automation & Workflow Engineering",
    icon: Workflow,
    sessions: [
      {
        title: "Session 1 — No-Code Meets AI: n8n / Make Fundamentals",
        points: [
          "Why automation is the \"glue\" that makes AI engineers hireable",
          "Triggers, nodes, error handling (Error Trigger, Stop and Error, Continue on Fail)",
          "Live build: an automation that watches a Gmail inbox and auto-categorizes emails with an LLM node",
        ],
      },
      {
        title: "Session 2 — Connecting AI to Real Business Systems",
        points: [
          "Webhooks, APIs, Google Sheets/Drive integration, Slack/WhatsApp notifications",
          "Live build: end-to-end workflow\u00a0 form submission → LLM processing → CRM update → notification",
        ],
      },
    ],
    deliverable: "\"Business Process Automation\"\u00a0 a project you can literally sell to a local business as a freelance gig",
  },
  {
    n: "06",
    weeks: "Week 8",
    title: "Fine-Tuning, MLOps & Deployment Basics",
    icon: Server,
    sessions: [
      {
        title: "Session 1 — When (and When Not) to Fine-Tune",
        points: [
          "Fine-tuning vs RAG vs prompt engineering\u00a0 decision framework",
          "Light hands-on: fine-tune a small open-source model on a toy dataset",
        ],
      },
      {
        title: "Session 2 — Shipping AI Products",
        points: [
          "Deployment basics (Docker intro, hosting an API, environment configs)",
          "Monitoring, logging, cost tracking for LLM apps in production",
          "Live build: containerize and deploy one of your earlier projects",
        ],
      },
    ],
  },
  {
    n: "07",
    weeks: "Week 9",
    title: "Capstone Sprint",
    icon: Trophy,
    sessions: [
      {
        title: "Session 1 — Capstone Kickoff",
        points: [
          "Choose from 3 tracks: Chatbot Product, AI Automation for a Business, or Autonomous Agent Tool",
          "Team formation (2–3 students), scoping session with instructor feedback live on-screen",
        ],
      },
      {
        title: "Session 2 — Build Day + Office Hours",
        points: [
          "Structured working session with instructor circulating breakout rooms",
          "Mid-build checkpoint presentations (2 min each, peer feedback)",
        ],
      },
    ],
  },
  {
    n: "08",
    weeks: "Week 10",
    title: "Demo Day & Career Activation",
    icon: Presentation,
    sessions: [
      {
        title: "Session 1 — Capstone Demo Day",
        points: [
          "Each team presents live (5 min demo + 2 min Q&A)",
          "Guest judges: industry practitioners invited when possible",
          "Awards: \"Most Practical,\" \"Most Ambitious,\" \"Best Design\"",
        ],
      },
      {
        title: "Session 2 — From Portfolio to Paycheck",
        points: [
          "Package your 4 projects into a LinkedIn profile + resume",
          "Live teardown: instructor reviews volunteer resumes on screen",
          "Bridge to the premium track: 1:1 portfolio review, mock interviews, job-search strategy",
        ],
      },
    ],
  },
];

const snapshot = [
  { icon: Clock, label: "Duration", value: "10 weeks" },
  { icon: Users, label: "Format", value: "Live online · 2 sessions/week · 90 min each + async work" },
  { icon: GraduationCap, label: "Cohort size", value: "25–40 students" },
  { icon: BookOpen, label: "Prerequisite", value: "Basic Python (covered in AI Foundations entry course)" },
  { icon: Target, label: "Outcome", value: "6 portfolio projects · LinkedIn-ready case studies · freelance-ready skillset" },
];

const portfolioOut = [
  "Prompt Engineering Library",
  "Deployed PDF Summarizer API",
  "\"Chat With Your Documents\" RAG App",
  "Autonomous Research Agent",
  "Business Process Automation Workflow",
  "Capstone Project (team-built, demo-recorded)",
];

function CurriculumPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-hero-glow opacity-70" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <Reveal>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/60 px-3.5 py-1.5 text-xs sm:text-sm text-muted-foreground backdrop-blur">
              <Rocket className="h-3.5 w-3.5 text-brand-blue" />
              Flagship Cohort Program
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 text-4xl sm:text-6xl font-bold tracking-tight">
              Become an <span className="text-gradient-brand">AI Engineer</span>
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-3 text-lg sm:text-xl text-muted-foreground">
              Generative AI + AI Agents + Automation Bootcamp
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              A 10-week live cohort for university students and fresh graduates. Every week ships something
              real — a working artifact for your portfolio, not just concepts on a slide.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Snapshot */}
      <section className="py-16 sm:py-20 border-b border-border/40 bg-surface/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">Program Snapshot</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold">Everything you need to know</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {snapshot.map((s, i) => (
              <Reveal key={s.label} delay={i * 60}>
                <div className="h-full rounded-2xl border border-border/60 bg-background/60 p-5 flex gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {s.label}
                    </div>
                    <div className="mt-1 text-sm sm:text-base text-foreground leading-snug">{s.value}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Curriculum */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">Curriculum Map</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold">Week by week, session by session</h2>
            <p className="mt-4 text-muted-foreground">
              9 modules across 10 weeks. Every session is a live build. Every module ends with a shippable
              artifact.
            </p>
          </Reveal>

          <div className="mt-16 space-y-6">
            {modules.map((m, i) => (
              <Reveal key={m.n} delay={i * 40}>
                <article className="relative rounded-2xl border border-border/60 bg-surface/60 p-6 sm:p-8 hover:border-brand-violet/50 transition">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                    <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-3 sm:w-40 shrink-0">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand shadow-brand">
                        <m.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="font-display text-2xl font-bold text-gradient-brand">Module {m.n}</div>
                        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-0.5">
                          {m.weeks}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl sm:text-2xl font-bold">{m.title}</h3>
                      <div className="mt-5 space-y-5">
                        {m.sessions.map((s) => (
                          <div key={s.title}>
                            <h4 className="text-sm sm:text-base font-semibold text-foreground">{s.title}</h4>
                            <ul className="mt-2 space-y-1.5">
                              {s.points.map((p) => (
                                <li key={p} className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed">
                                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
                                  <span>{p}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      {m.deliverable && (
                        <div className="mt-5 rounded-xl border border-brand-violet/40 bg-brand-violet/10 px-4 py-3 text-sm">
                          <span className="font-semibold text-brand-glow">Deliverable · </span>
                          <span className="text-foreground/90">{m.deliverable}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio outcome */}
      <section className="py-20 sm:py-24 border-t border-border/40 bg-surface/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">Portfolio</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold">What you'll walk away with</h2>
            <p className="mt-4 text-muted-foreground">
              By the end of 10 weeks, you will have a production-grade portfolio that proves you can build
              modern AI applications.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {portfolioOut.map((p, i) => (
              <Reveal key={p} delay={i * 50}>
                <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-violet/10 text-brand-violet">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{p}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              Ready to build the <span className="text-gradient-brand">future?</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Don't just prompt — engineer. Join the next cohort of AI engineers and master the technical
              skills that matter.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-foreground px-8 py-4 text-sm font-semibold text-background transition hover:bg-foreground/90 hover:scale-105 active:scale-95"
              >
                Apply for Next Cohort
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-border bg-background px-8 py-4 text-sm font-semibold text-foreground transition hover:bg-surface hover:border-border/80"
              >
                Talk to an Advisor
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Bottom Nav Spacer */}
      <div className="h-20 sm:h-0" />
    </div>
  );
}

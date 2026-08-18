import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  Sparkles,
  Rocket,
  BookOpen,
  Zap,
  Users,
  Cpu,
  Boxes,
  Bot,
  Workflow,
  GraduationCap,
  Trophy,
  ArrowRight,
  Check,
  Instagram,
  Linkedin,
  Mail,
  ChevronDown,
  Code2,
  Database,
  MessagesSquare,
  Wand2,
  Server,
  Presentation,
  BrainCircuit,
  Sun,
  Moon,
  Leaf,
  Github,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import hooriaLogo from "@/assets/hooria-logo.png.asset.json";
import heroBgVideo from "@/assets/hero-bg-ai.mp4.asset.json";

export const Route = createFileRoute("/")({
  component: HomePage,
});

// ---------- Icon registry (values editable in the DB) ----------
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles, Rocket, BookOpen, Zap, Users, Cpu, Boxes, Bot, Workflow,
  GraduationCap, Trophy, BrainCircuit, Code2, Database, MessagesSquare,
};

// ---------- Types ----------
type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  price_label: string;
  is_highlighted: boolean;
  sort_order: number;
};

type Faq = { id: string; question: string; answer: string; sort_order: number };

// ---------- Fetchers ----------
async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

async function fetchFaqs(): Promise<Faq[]> {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// ---------- Reveal-on-scroll wrapper ----------
function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const [visible, setVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.15 },
    );
    io.observe(ref);
    return () => io.disconnect();
  }, [ref]);
  return (
    <div
      ref={setRef}
      className={cn(
        "transition-all duration-700 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ---------- Sections ----------
function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <img
            src={hooriaLogo.url}
            alt="Hooria AI logo"
            className="h-9 w-9 rounded-lg"
          />
          <span className="font-display text-lg font-bold tracking-tight">Hooria AI</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#programs" className="hover:text-foreground transition">Programs</a>
          <a href="#curriculum" className="hover:text-foreground transition">Curriculum</a>
          <a href="#instructor" className="hover:text-foreground transition">Instructor</a>
          <a href="#portfolio" className="hover:text-foreground transition">Portfolio</a>

          <a href="#faq" className="hover:text-foreground transition">FAQ</a>
        </nav>
        <a
          href="#signup"
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground shadow-brand hover:opacity-95 transition"
        >
          Join Webinar <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={heroBgVideo.url}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />
      <div className="absolute inset-0 bg-background/70" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" aria-hidden />


      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/60 px-3.5 py-1.5 text-xs sm:text-sm text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue animate-pulse" />
            Applications open · Worldwide
          </div>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="mt-6 text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight">
            Become an <span className="text-gradient-brand">AI Engineer</span>
          </h1>
        </Reveal>
        <Reveal delay={200}>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground">
            Learn the AI skills companies are hiring for — build a real portfolio while you do it.
          </p>
        </Reveal>
        <Reveal delay={300}>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#signup"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-brand hover:scale-[1.02] transition"
            >
              Join the Free Webinar <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/curriculum"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-border bg-surface/60 px-6 py-3 text-sm font-semibold text-foreground hover:bg-surface transition"
            >
              Explore the Bootcamp
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    { icon: Zap, text: "10-Week Live Cohort" },
    { icon: Boxes, text: "6 Portfolio Projects" },
    { icon: GraduationCap, text: "Built for BSCS, BSSE, BSAI, BSIT" },
    { icon: Users, text: "Small Group Mentoring" },
  ];
  return (
    <section className="border-y border-border/40 bg-surface/40">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 sm:px-6 py-6 text-sm text-muted-foreground">
        {items.map((i) => (
          <div key={i.text} className="flex items-center gap-2">
            <i.icon className="h-4 w-4 text-brand-blue shrink-0" />
            <span>{i.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function RealityCheck() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 bg-hero-glow opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/60 px-4 py-1.5 text-xs sm:text-sm font-semibold text-brand-glow backdrop-blur">
            <Rocket className="h-4 w-4" />
            The hype is temporary. The skill is permanent.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mt-6 text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Vibe coding won't last. <br />
            <span className="text-gradient-brand">Real engineering will.</span>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Anyone can prompt an AI and ship a demo. Few can understand the models, build systems that scale,
            and solve problems that actually matter. The future belongs to people who know the fundamentals —
            <span className="text-foreground font-medium"> Python, machine learning, and how AI really works.</span>
          </p>
        </Reveal>
        <Reveal delay={300}>
          <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base text-muted-foreground">
            Don't just ride the wave. Learn to build the wave.
          </p>
        </Reveal>
        <Reveal delay={400}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#signup"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-brand hover:scale-[1.02] transition"
            >
              Start building real skills <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/curriculum"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-border bg-surface/60 px-6 py-3 text-sm font-semibold text-foreground hover:bg-surface transition"
            >
              See the curriculum
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Programs() {
  const { data: services = [], isLoading } = useQuery({ queryKey: ["services"], queryFn: fetchServices });
  return (
    <section id="programs" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">Programs</p>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold">Pick your path into AI</h2>
          <p className="mt-4 text-muted-foreground">
            From a free webinar to the full engineering bootcamp — start where it makes sense for you.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 rounded-2xl border border-border/60 bg-surface/50 animate-pulse" />
            ))}
          {services.map((s, i) => {
            const Icon = iconMap[s.icon] ?? Sparkles;
            return (
              <Reveal key={s.id} delay={i * 80}>
                {(() => {
                  const cardInner = (
                    <div
                      className={cn(
                        "group relative h-full rounded-2xl border p-6 transition-all duration-300",
                        s.is_highlighted
                          ? "border-transparent bg-gradient-brand shadow-brand-violet hover:scale-[1.02]"
                          : "border-border/60 bg-surface/60 hover:border-brand-blue/50 hover:bg-surface",
                      )}
                    >
                      {s.is_highlighted && (
                        <div className="absolute -top-3 left-6 rounded-full bg-background px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-brand-glow border border-brand-violet/50">
                          Flagship
                        </div>
                      )}
                      <div
                        className={cn(
                          "grid h-11 w-11 place-items-center rounded-xl",
                          s.is_highlighted
                            ? "bg-white/15 text-primary-foreground"
                            : "bg-brand-blue/10 text-brand-blue",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className={cn("mt-5 text-lg font-semibold", s.is_highlighted && "text-primary-foreground")}>
                        {s.title}
                      </h3>
                      <p
                        className={cn(
                          "mt-2 text-sm leading-relaxed",
                          s.is_highlighted ? "text-primary-foreground/85" : "text-muted-foreground",
                        )}
                      >
                        {s.description}
                      </p>
                      <div
                        className={cn(
                          "mt-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                          s.is_highlighted
                            ? "bg-white/20 text-primary-foreground"
                            : "bg-brand-violet/10 text-brand-glow",
                        )}
                      >
                        {s.price_label || "Contact us"}
                        {s.is_highlighted && <ArrowRight className="h-3.5 w-3.5" />}
                      </div>
                    </div>
                  );
                  return s.is_highlighted ? (
                    <Link to="/curriculum" className="block h-full">
                      {cardInner}
                    </Link>
                  ) : (
                    cardInner
                  );
                })()}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const items = [
    { icon: Boxes, title: "Real Projects, Not Just Theory", desc: "Every module ends with something shippable. You leave with a GitHub, not a certificate PDF." },
    { icon: Users, title: "Live Cohort-Based Learning", desc: "Two live sessions per week, small groups, direct instructor access. No dead Slack channels." },
    { icon: Trophy, title: "Freelance-Ready Portfolio", desc: "By demo day you can charge for RAG, agents, and automations. We show you how to land the first client." },
  ];
  return (
    <section className="py-24 sm:py-32 bg-surface/30 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">Why Hooria AI</p>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold">The bootcamp we wish we had</h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 100}>
              <div className="h-full rounded-2xl border border-border/60 bg-background/50 p-7">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand shadow-brand">
                  <it.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Instructor() {
  const highlights = [
    { icon: Cpu, title: "AI Engineering", desc: "Production-grade ML, deep learning and generative AI systems built for real-world use cases." },
    { icon: Bot, title: "AI Agents", desc: "Autonomous agents and workflow automation using OpenAI, LangChain, LangGraph and n8n." },
    { icon: Boxes, title: "Computer Vision", desc: "Object detection, recognition and image processing pipelines deployed at scale." },
    { icon: GraduationCap, title: "Academia", desc: "Former AI lab instructor and teaching assistant at FAST NUCES; national AI trainer at NAVTTC." },
  ];
  const experience = [
    { role: "Founder & Lead Instructor", org: "Hooria AI", note: "Building the next generation of AI engineers through live, hands-on education." },
    { role: "AI Lab Instructor & Teaching Assistant", org: "FAST NUCES", note: "Designed and delivered undergraduate AI labs and mentored student projects." },
    { role: "AI Instructor", org: "NAVTTC", note: "Trained national cohorts in generative AI, Python and AI agents." },
    { role: "AI Engineer", org: "Malind Tech", note: "Shipped AI agents and business automation for international clients." },
    { role: "AI Engineer", org: "Knowa Tech", note: "Led research-driven ML and AI work on a global bioinformatics project." },
    { role: "AI Engineer", org: "Vaival Technologies", note: "Built generative AI products from prototype to production." },
  ];
  const stack = ["Python", "OpenAI / GPT", "LangChain", "RAG", "FastAPI", "TensorFlow", "PyTorch", "OpenCV", "YOLO", "n8n", "Make.com", "Docker"];

  return (
    <section id="instructor" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">Leadership</p>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold">
            Built by an AI engineer, <span className="text-gradient-brand">for AI engineers</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[380px_1fr] items-start">
          <Reveal>
            <div className="rounded-3xl border border-border/60 bg-surface/40 p-7">
              <img
                src="https://hn-portfolio-nine.vercel.app/assets/hooria-hero-portrait-ZRD_SZf5.png"
                alt="Hooria Najeeb, Founder and Lead Instructor at Hooria AI"
                loading="lazy"
                className="w-full rounded-2xl object-cover"
              />
              <h3 className="mt-6 text-2xl font-bold">Hooria Najeeb</h3>
              <p className="mt-1 text-sm text-brand-blue font-medium">Founder & Lead Instructor, Hooria AI</p>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Hooria leads Hooria AI with a simple premise: the best way to learn AI engineering is to build real AI systems. She combines years of hands-on industry work with classroom experience to teach students how to ship, not just follow tutorials.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <a
                  href="https://www.linkedin.com/in/hooria-najeeb-631b411ba"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3.5 py-1.5 text-xs hover:border-brand-blue transition"
                >
                  <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                </a>
              </div>
            </div>
          </Reveal>

          <div className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {highlights.map((h, i) => (
                <Reveal key={h.title} delay={i * 80}>
                  <div className="h-full rounded-2xl border border-border/60 bg-background/50 p-6">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand shadow-brand">
                      <h.icon className="h-4.5 w-4.5 text-primary-foreground" />
                    </div>
                    <h4 className="mt-4 font-semibold">{h.title}</h4>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{h.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={100}>
              <div className="rounded-2xl border border-border/60 bg-surface/30 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Experience</p>
                <ul className="mt-4 space-y-3.5">
                  {experience.map((e) => (
                    <li key={e.org + e.role} className="flex gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
                      <span className="text-sm">
                        <span className="font-semibold">{e.role}</span>
                        <span className="text-muted-foreground"> · {e.org} — {e.note}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="flex flex-wrap gap-2">
                {stack.map((s) => (
                  <span key={s} className="rounded-full border border-border/60 bg-background/50 px-3 py-1 text-xs text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Curriculum() {
  const modules = [
    { n: "01", title: "Foundations", desc: "Python for AI, LLM primitives, tokens, embeddings." },
    { n: "02", title: "APIs & Prompt Engineering", desc: "OpenAI, Anthropic, function calling, structured outputs." },
    { n: "03", title: "RAG Systems", desc: "Vector DBs, chunking, retrieval, hybrid search." },
    { n: "04", title: "AI Agents", desc: "Tool use, planning, LangGraph, multi-agent orchestration." },
    { n: "05", title: "Automation", desc: "n8n, Make, custom workflows, real business use-cases." },
    { n: "06", title: "MLOps & Deployment", desc: "Docker, serverless, monitoring, cost control." },
    { n: "07", title: "Capstone", desc: "Ship a full product end-to-end with a real user." },
    { n: "08", title: "Demo Day", desc: "Present to hiring partners and the Hooria alumni network." },
  ];
  return (
    <section id="curriculum" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">Curriculum</p>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold">8 modules. 10 weeks. Zero fluff.</h2>
        </Reveal>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m, i) => (
            <Reveal key={m.n} delay={i * 60}>
              <div className="group relative h-full rounded-2xl border border-border/60 bg-surface/60 p-6 hover:border-brand-violet/50 transition">
                <div className="font-display text-3xl font-bold text-gradient-brand">{m.n}</div>
                <h3 className="mt-3 text-base font-semibold">{m.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{m.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  const outcomes = [
    { icon: Wand2, title: "Prompt Library", tag: "Week 2" },
    { icon: Server, title: "Deployed LLM API", tag: "Week 4" },
    { icon: MessagesSquare, title: "RAG Chatbot", tag: "Week 5" },
    { icon: Bot, title: "Autonomous Agent", tag: "Week 7" },
    { icon: Workflow, title: "Business Automation", tag: "Week 8" },
    { icon: Presentation, title: "Capstone Project", tag: "Week 10" },
  ];
  return (
    <section id="portfolio" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-96 bg-hero-glow opacity-70" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">What You'll Ship</p>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold">
            <span className="text-gradient-brand">6 portfolio projects</span> that get you hired
          </h2>
          <p className="mt-4 text-muted-foreground">
            These aren't tutorials. You'll deploy real code, on real infrastructure, with your name on it.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {outcomes.map((o, i) => (
            <Reveal key={o.title} delay={i * 80}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-surface/70 p-7 transition hover:shadow-brand">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-violet/20 blur-2xl transition group-hover:bg-brand-blue/30" aria-hidden />
                <div className="relative flex items-start justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand shadow-brand">
                    <o.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{o.tag}</span>
                </div>
                <h3 className="relative mt-5 text-lg font-semibold">{o.title}</h3>
                <div className="relative mt-3 flex items-center gap-1.5 text-xs text-brand-glow">
                  <Check className="h-3.5 w-3.5" /> Deployed · Public · Yours
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { name: "Ayesha K.", uni: "FAST NUCES", quote: "I built a RAG chatbot in week 5 that I now use at my internship. The projects are that real." },
    { name: "Hamza R.", uni: "LUMS", quote: "Landed an AI engineer role before graduation. My capstone was literally my interview." },
    { name: "Sara M.", uni: "UET Lahore", quote: "The live sessions and small group made it feel like a team, not a course." },
  ];
  return (
    <section className="py-24 sm:py-32 bg-surface/30 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">Students</p>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold">From students, for students</h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <figure className="h-full rounded-2xl border border-border/60 bg-background/50 p-7">
                <blockquote className="text-base leading-relaxed text-foreground/90">"{t.quote}"</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-brand text-sm font-bold text-primary-foreground">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.uni}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border/60 bg-surface/50 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-foreground">{q}</span>
        <ChevronDown className={cn("h-5 w-5 shrink-0 text-brand-blue transition-transform", open && "rotate-180")} />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

function Faqs() {
  const { data: faqs = [], isLoading } = useQuery({ queryKey: ["faqs"], queryFn: fetchFaqs });
  return (
    <section id="faq" className="py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">FAQ</p>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold">Questions, Answered</h2>
        </Reveal>
        <div className="mt-12 space-y-3">
          {isLoading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl border border-border/60 bg-surface/50 animate-pulse" />
          ))}
          {faqs.map((f, i) => (
            <Reveal key={f.id} delay={i * 50}>
              <FaqItem q={f.question} a={f.answer} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Signup form ----------
const signupSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(120),
  email: z.string().trim().email("Invalid email").max(200),
  whatsapp: z.string().trim().min(5, "Enter your WhatsApp number").max(40),
  university: z.string().trim().min(1, "University required").max(200),
});

function SignupForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signupSchema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      whatsapp: fd.get("whatsapp"),
      university: fd.get("university"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("webinar_signups").insert(parsed.data);
    setLoading(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
    toast.success("You're in! Check your email for the webinar link.");
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-brand-blue/40 bg-surface/60 p-10 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-brand shadow-brand">
          <Check className="h-7 w-7 text-primary-foreground" />
        </div>
        <h3 className="mt-5 text-2xl font-bold">You're on the list</h3>
        <p className="mt-2 text-muted-foreground">
          We'll send the webinar link and a short intro to your WhatsApp and email in the next 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border/60 bg-surface/60 p-6 sm:p-8 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" placeholder="Ayesha Khan" required maxLength={120} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required maxLength={200} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="whatsapp">WhatsApp number</Label>
          <Input id="whatsapp" name="whatsapp" placeholder="+92 300 1234567" required maxLength={40} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="university">University</Label>
          <Input id="university" name="university" placeholder="FAST NUCES, LUMS, UET..." required maxLength={200} />
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-full bg-gradient-brand text-primary-foreground font-semibold text-base shadow-brand hover:opacity-95"
      >
        {loading ? "Reserving your seat..." : "Reserve my free seat"}
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        Free · 90 minutes · Live on Zoom · Replay available
      </p>
    </form>
  );
}

function Signup() {
  return (
    <section id="signup" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow opacity-80" aria-hidden />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">Free Webinar</p>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold">
            Save your seat for the <span className="text-gradient-brand">AI Career Kickstart</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            The exact roadmap, tools, and portfolio our students use to land AI engineering roles in 2026.
          </p>
        </Reveal>
        <Reveal delay={150} className="mt-10">
          <SignupForm />
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <img src={hooriaLogo.url} alt="Hooria AI logo" className="h-9 w-9 rounded-lg" />
              <span className="font-display text-lg font-bold">Hooria AI</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              AI engineering education for the next generation of builders worldwide.
            </p>
          </div>
          <div className="md:text-center">
            <p className="text-sm font-semibold">Follow along</p>
            <div className="mt-3 flex md:justify-center gap-3">
              {[
                { icon: Instagram, href: "https://www.instagram.com/hooriaai.official/", label: "Instagram" },
                { icon: Linkedin, href: "https://www.linkedin.com/company/hooria-ai", label: "LinkedIn" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border/60 bg-background/50 text-muted-foreground hover:text-brand-blue hover:border-brand-blue/50 transition"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div className="md:text-right">
            <p className="text-sm font-semibold">Get in touch</p>
            <a
              href="mailto:queries@hooriaai.com"
              className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-blue transition"
            >
              <Mail className="h-4 w-4" /> queries@hooriaai.com
            </a>
            <p className="mt-2 text-sm text-muted-foreground">Remote · Worldwide</p>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Hooria AI. All rights reserved.</p>
          <p>Built for CS, AI, and IT students worldwide.</p>
        </div>
      </div>
    </footer>
  );
}

type ThemeMode = "dark" | "light" | "emerald";

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.classList.toggle("light", mode === "light");
  root.classList.toggle("emerald", mode === "emerald");
}

function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("theme")) as
      | ThemeMode
      | null;
    const initial: ThemeMode = stored ?? "dark";
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggle = () => {
    const order: ThemeMode[] = ["dark", "light", "emerald"];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* ignore */
    }
  };

  const label =
    theme === "dark" ? "Switch to light mode" : theme === "light" ? "Switch to emerald mode" : "Switch to dark mode";
  const Icon = theme === "dark" ? Sun : theme === "light" ? Leaf : Moon;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="fixed bottom-6 right-6 z-50 grid h-12 w-12 place-items-center rounded-full border border-border/70 bg-surface/80 text-foreground shadow-brand backdrop-blur-xl transition hover:scale-105 hover:border-brand-blue/60"
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

function HomePage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const read = () =>
      setTheme(document.documentElement.classList.contains("light") ? "light" : "dark");
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    read();
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster theme={theme} position="top-center" />
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <RealityCheck />
        <Programs />
        <WhyUs />
        <Instructor />
        <Curriculum />
        <Portfolio />
        <Testimonials />
        <Faqs />
        <Signup />
      </main>
      <Footer />
      <ThemeToggle />
    </div>
  );
}

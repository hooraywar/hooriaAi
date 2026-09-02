export type ProgramModuleFallback = {
  id: string;
  n: string;
  weeks: string;
  title: string;
  icon: string;
  intro: string;
  sessions: Array<{ title: string; points: string[] }>;
  deliverable: string;
};

export type ProgramDetailFallback = {
  curriculum: {
    title: string;
    subtitle: string;
    description: string;
    duration: string;
    prerequisites: string;
    class_duration: string;
    qa_session: string;
  };
  modules: ProgramModuleFallback[];
  portfolio: string[];
};

export const programDetails: Record<string, ProgramDetailFallback> = {
  foundation: {
    curriculum: {
      title: "AI Foundations + Prompt Engineering",
      subtitle: "Build a strong foundation before you build with agents.",
      description:
        "Learn how modern language models work, write reliable prompts, connect to LLM APIs, and turn small Python scripts into useful AI-powered applications.",
      duration: "6 weeks",
      prerequisites: "Basic Python; no prior AI experience required",
      class_duration: "Two 90-minute live sessions per week",
      qa_session: "Weekly live Q&A and project feedback",
    },
    modules: [
      {
        id: "foundation-01",
        n: "01",
        weeks: "Week 1",
        title: "How Generative AI Works",
        icon: "BrainCircuit",
        intro:
          "Understand tokens, context windows, embeddings, and next-token prediction without getting lost in unnecessary theory.",
        sessions: [
          {
            title: "LLM fundamentals",
            points: [
              "How transformer-based language models generate responses",
              "Tokens, context windows, temperature, and model limits",
              "Choosing the right model for cost, speed, and quality",
            ],
          },
        ],
        deliverable: "An illustrated LLM concepts guide and model comparison.",
      },
      {
        id: "foundation-02",
        n: "02",
        weeks: "Weeks 2–3",
        title: "Prompt Engineering That Works",
        icon: "Sparkles",
        intro:
          "Move from trial-and-error prompts to repeatable prompt systems with clear inputs, constraints, and evaluation criteria.",
        sessions: [
          {
            title: "Reliable prompt patterns",
            points: [
              "Role, context, task, constraints, and output schemas",
              "Few-shot examples, decomposition, and prompt chaining",
              "Testing prompts against edge cases and hallucinations",
            ],
          },
        ],
        deliverable: "A reusable, tested prompt engineering library.",
      },
      {
        id: "foundation-03",
        n: "03",
        weeks: "Weeks 4–5",
        title: "Working with LLM APIs",
        icon: "Code2",
        intro:
          "Call language models from Python and build the error handling, structured outputs, and streaming expected in real applications.",
        sessions: [
          {
            title: "From API call to application",
            points: [
              "Secure API-key configuration and request lifecycle",
              "Structured JSON output, validation, retries, and logging",
              "Streaming responses and basic tool/function calling",
            ],
          },
        ],
        deliverable: "A deployed text analysis and summarization API.",
      },
      {
        id: "foundation-04",
        n: "04",
        weeks: "Week 6",
        title: "Foundation Capstone",
        icon: "Rocket",
        intro:
          "Combine prompting, APIs, and a simple interface into a small AI product you can confidently demonstrate.",
        sessions: [
          {
            title: "Build and ship",
            points: [
              "Plan a focused user problem and success criteria",
              "Add guardrails, error states, and basic evaluations",
              "Deploy the app and present a concise technical demo",
            ],
          },
        ],
        deliverable: "A live AI mini-app with source code and demo video.",
      },
    ],
    portfolio: [
      "Prompt Engineering Library",
      "Structured Output Demo",
      "LLM Model Comparison",
      "Deployed Summarization API",
      "AI Mini-App",
      "Technical Demo Video",
    ],
  },

  "ai-app-development-with-rag-agents": {
    curriculum: {
      title: "AI App Development with RAG & Agents",
      subtitle: "Go from calling an LLM to shipping an intelligent product.",
      description:
        "Build production-minded AI applications that retrieve trusted knowledge, use tools, remember context, and complete multi-step tasks through practical RAG and agent workflows.",
      duration: "6 weeks",
      prerequisites: "Python fundamentals and basic experience with LLM APIs",
      class_duration: "Two 90-minute live build sessions per week",
      qa_session: "Weekly architecture review and debugging clinic",
    },
    modules: [
      {
        id: "rag-01",
        n: "01",
        weeks: "Week 1",
        title: "Embeddings and Semantic Search",
        icon: "Database",
        intro:
          "Learn how applications represent meaning, compare documents, and retrieve relevant information beyond keyword matching.",
        sessions: [
          {
            title: "Build a semantic search pipeline",
            points: [
              "Embeddings, similarity metrics, and vector indexes",
              "Document loading, cleaning, chunking, and metadata",
              "Measure retrieval quality with realistic test questions",
            ],
          },
        ],
        deliverable: "A searchable knowledge-base API with citations.",
      },
      {
        id: "rag-02",
        n: "02",
        weeks: "Weeks 2–3",
        title: "Retrieval-Augmented Generation",
        icon: "BookOpen",
        intro:
          "Ground LLM answers in your own documents and design a RAG pipeline that is accurate, traceable, and useful.",
        sessions: [
          {
            title: "Engineer a complete RAG system",
            points: [
              "Retrieval, reranking, context assembly, and answer generation",
              "Source citations, refusal behavior, and hallucination controls",
              "RAG evaluation for retrieval relevance and answer faithfulness",
            ],
          },
        ],
        deliverable: "A deployed “Chat With Your Documents” application.",
      },
      {
        id: "rag-03",
        n: "03",
        weeks: "Weeks 4–5",
        title: "AI Agents, Tools, and Memory",
        icon: "Bot",
        intro:
          "Create an agent that can choose tools, keep useful state, and complete a task through a controlled reasoning loop.",
        sessions: [
          {
            title: "Build dependable agent workflows",
            points: [
              "Tool schemas, routing, planning, and execution loops",
              "Short-term conversation state and long-term memory",
              "Guardrails, approvals, timeouts, and failure recovery",
            ],
          },
        ],
        deliverable: "A research agent that returns a sourced report.",
      },
      {
        id: "rag-04",
        n: "04",
        weeks: "Week 6",
        title: "Production Deployment",
        icon: "Server",
        intro:
          "Package your RAG and agent workflows behind a polished interface and deploy them with observability and cost controls.",
        sessions: [
          {
            title: "Ship the final application",
            points: [
              "Authentication, rate limits, caching, and user feedback",
              "Tracing latency, token usage, failures, and answer quality",
              "Deployment checklist, portfolio write-up, and live demo",
            ],
          },
        ],
        deliverable: "A live RAG-and-agent product with a case study.",
      },
    ],
    portfolio: [
      "Semantic Search API",
      "Vector Knowledge Base",
      "RAG App with Citations",
      "RAG Evaluation Suite",
      "Tool-Using Research Agent",
      "Deployed AI Product Case Study",
    ],
  },

  "become-an-ai-engineer": {
    curriculum: {
      title: "Become an AI Engineer Bootcamp",
      subtitle:
        "A complete path from AI fundamentals to a production capstone.",
      description:
        "Master LLM APIs, RAG, agents, automation, deployment, and product thinking while building a portfolio that demonstrates real AI engineering ability.",
      duration: "10 weeks",
      prerequisites: "Basic Python and a commitment to build every week",
      class_duration: "Two live sessions per week",
      qa_session: "Weekly mentoring, code review, and open Q&A",
    },
    modules: [
      {
        id: "bootcamp-01",
        n: "01",
        weeks: "Weeks 1–2",
        title: "LLM and API Engineering",
        icon: "Code2",
        intro:
          "Build a reliable foundation in language models, prompting, structured output, streaming, and backend API design.",
        sessions: [
          {
            title: "Engineering with language models",
            points: [
              "Model behavior, prompt systems, and evaluation",
              "Typed outputs, tool calling, retries, and observability",
              "FastAPI services and production error handling",
            ],
          },
        ],
        deliverable: "A production-style LLM API service.",
      },
      {
        id: "bootcamp-02",
        n: "02",
        weeks: "Weeks 3–5",
        title: "RAG and Knowledge Systems",
        icon: "Database",
        intro:
          "Turn private documents into accurate, cited answers using retrieval pipelines and systematic evaluation.",
        sessions: [
          {
            title: "Build knowledge-aware applications",
            points: [
              "Chunking, embeddings, vector storage, and reranking",
              "Hybrid retrieval and context-quality improvements",
              "Faithfulness evaluation and production guardrails",
            ],
          },
        ],
        deliverable: "A deployed domain-specific RAG assistant.",
      },
      {
        id: "bootcamp-03",
        n: "03",
        weeks: "Weeks 6–7",
        title: "Agents and Automation",
        icon: "Workflow",
        intro:
          "Design agents that safely use tools and connect them to real business systems through observable workflows.",
        sessions: [
          {
            title: "Automate multi-step work",
            points: [
              "Planning loops, tools, memory, and human approval",
              "Workflow orchestration with external applications",
              "Retries, idempotency, logging, and failure recovery",
            ],
          },
        ],
        deliverable: "An agent-powered business automation workflow.",
      },
      {
        id: "bootcamp-04",
        n: "04",
        weeks: "Weeks 8–10",
        title: "Deployment, Capstone, and Career Launch",
        icon: "Trophy",
        intro:
          "Ship a complete AI product, defend your architecture decisions, and turn the work into a compelling portfolio story.",
        sessions: [
          {
            title: "From prototype to portfolio",
            points: [
              "Deployment, monitoring, security, and cost controls",
              "Team capstone sprint with instructor reviews",
              "Demo day, case study, resume, and interview preparation",
            ],
          },
        ],
        deliverable:
          "A team-built capstone, live demo, and technical case study.",
      },
    ],
    portfolio: [
      "Production LLM API",
      "RAG Assistant with Evaluation",
      "Autonomous Research Agent",
      "Business Automation Workflow",
      "Deployed Team Capstone",
      "Technical Portfolio Case Study",
    ],
  },
};

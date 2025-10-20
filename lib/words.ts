// Developer and tech-themed words for interactive booth game
export const devWords = [
  // Programming Languages
  "javascript", "typescript", "python", "java", "kotlin", "swift", "rust", "golang",
  "ruby", "php", "csharp", "cpp", "scala", "dart", "elixir", "clojure",

  // Framework & Libraries
  "react", "vue", "angular", "nextjs", "nuxt", "svelte", "redux", "express",
  "django", "flask", "spring", "laravel", "rails", "nodejs", "deno", "astro",

  // Cloud & DevOps
  "docker", "kubernetes", "aws", "azure", "gcp", "terraform", "ansible", "jenkins",
  "gitlab", "github", "bitbucket", "circleci", "nginx", "apache", "heroku", "vercel",

  // Database & Storage
  "mongodb", "postgresql", "mysql", "redis", "elasticsearch", "dynamodb", "firebase",
  "supabase", "prisma", "graphql", "restapi", "grpc", "kafka", "rabbitmq",

  // Programming Concepts
  "function", "class", "interface", "async", "await", "promise", "callback", "closure",
  "recursion", "algorithm", "datastructure", "api", "json", "xml", "yaml", "regex",
  "variable", "constant", "array", "object", "string", "boolean", "integer", "float",
  "loop", "iterate", "map", "filter", "reduce", "sort", "search", "binary",

  // Development Terms
  "debug", "compile", "deploy", "build", "test", "refactor", "optimize", "profile",
  "commit", "push", "pull", "merge", "branch", "fork", "clone", "fetch",
  "package", "module", "import", "export", "namespace", "component", "hook", "state",

  // Web & Mobile
  "frontend", "backend", "fullstack", "responsive", "mobile", "progressive", "native",
  "hybrid", "webpack", "vite", "babel", "eslint", "prettier", "tailwind", "sass",

  // AI & ML
  "machine", "learning", "neural", "network", "model", "training", "dataset", "tensor",
  "pytorch", "tensorflow", "keras", "huggingface", "openai", "chatgpt", "claude",

  // Security & Auth
  "security", "encryption", "jwt", "oauth", "authentication", "authorization", "token",
  "hash", "salt", "https", "ssl", "tls", "firewall", "vulnerability", "penetration",

  // Agile & PM
  "agile", "scrum", "sprint", "kanban", "jira", "backlog", "standup", "retrospective",
  "epic", "story", "ticket", "milestone", "release", "deploy", "hotfix", "bugfix",

  // Short code snippets
  "const", "let", "var", "if", "else", "for", "while", "switch", "case", "break",
  "return", "throw", "try", "catch", "finally", "new", "this", "super", "extends",
  "public", "private", "static", "void", "null", "undefined", "true", "false",
];

export const commonWords = devWords;

export function generateWords(count: number): string[] {
  const words: string[] = [];
  const usedIndexes = new Set<number>();

  // Ensure variety by not repeating words too close together
  for (let i = 0; i < count; i++) {
    let randomIndex: number;
    let attempts = 0;

    do {
      randomIndex = Math.floor(Math.random() * devWords.length);
      attempts++;
    } while (usedIndexes.has(randomIndex) && attempts < 50);

    usedIndexes.add(randomIndex);
    words.push(devWords[randomIndex]);

    // Clear set every 20 words to allow repetition but maintain variety
    if (usedIndexes.size > 20) {
      usedIndexes.clear();
    }
  }

  return words;
}

export function getDifficulty(word: string): "easy" | "medium" | "hard" {
  if (word.length <= 4) return "easy";
  if (word.length <= 8) return "medium";
  return "hard";
}

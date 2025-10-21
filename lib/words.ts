// Simple, common English words for non-developers
export const simpleWords = [
  // Common everyday words
  "the", "and", "for", "are", "but", "not", "you", "all", "can", "her",
  "was", "one", "our", "out", "day", "get", "has", "him", "his", "how",
  "man", "new", "now", "old", "see", "two", "way", "who", "boy", "did",
  "its", "let", "put", "say", "she", "too", "use", "dad", "mom", "sir",

  // Action words
  "run", "walk", "jump", "play", "work", "read", "write", "talk", "help", "move",
  "make", "take", "give", "keep", "turn", "show", "open", "close", "start", "stop",
  "look", "find", "tell", "call", "wait", "feel", "watch", "learn", "teach", "think",

  // Objects & Things
  "book", "door", "hand", "head", "home", "room", "time", "year", "name", "page",
  "tree", "road", "food", "water", "house", "place", "world", "state", "story", "fact",
  "word", "line", "part", "area", "form", "idea", "face", "city", "team", "group",

  // Descriptive words
  "good", "great", "big", "small", "long", "short", "high", "low", "fast", "slow",
  "hot", "cold", "young", "same", "best", "last", "next", "right", "left", "sure",
  "free", "full", "easy", "hard", "clean", "clear", "local", "happy", "early", "ready",

  // Numbers & Time
  "first", "second", "third", "last", "next", "today", "week", "month", "year", "hour",
  "once", "again", "never", "always", "often", "later", "soon", "until", "after", "before",

  // Question words & connectors
  "what", "when", "where", "which", "while", "still", "just", "only", "even", "also",
  "back", "both", "each", "such", "then", "than", "them", "there", "these", "those",
];

// Developer and tech-themed words for hard mode
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

export function generateWords(count: number, hardMode: boolean = false): string[] {
  const words: string[] = [];
  const usedIndexes = new Set<number>();
  const wordList = hardMode ? devWords : simpleWords;

  // Ensure variety by not repeating words too close together
  for (let i = 0; i < count; i++) {
    let randomIndex: number;
    let attempts = 0;

    do {
      randomIndex = Math.floor(Math.random() * wordList.length);
      attempts++;
    } while (usedIndexes.has(randomIndex) && attempts < 50);

    usedIndexes.add(randomIndex);
    words.push(wordList[randomIndex]);

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

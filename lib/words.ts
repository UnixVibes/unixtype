// Common English words for typing practice
export const commonWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "is", "was", "are", "been", "has", "had", "were", "said", "did", "having",
  "may", "should", "could", "would", "might", "must", "shall", "can", "will", "being",
  "very", "through", "where", "much", "before", "right", "too", "means", "old", "great",
  "man", "world", "here", "thing", "every", "own", "same", "another", "need", "three",
  "high", "small", "large", "such", "follow", "act", "why", "ask", "change", "went",
  "light", "kind", "off", "need", "house", "picture", "try", "again", "animal", "point",
  "mother", "world", "near", "build", "self", "earth", "father", "head", "stand", "own",
  "page", "should", "country", "found", "answer", "school", "grow", "study", "still", "learn",
  "plant", "cover", "food", "sun", "four", "between", "state", "keep", "eye", "never",
  "last", "let", "thought", "city", "tree", "cross", "farm", "hard", "start", "might",
];

export function generateWords(count: number): string[] {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * commonWords.length);
    words.push(commonWords[randomIndex]);
  }
  return words;
}

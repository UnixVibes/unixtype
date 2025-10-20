// Fortune cookie style quotes for developers
export const developerQuotes = [
  // Inspirational
  "Code is like humor. When you have to explain it, it's bad.",
  "First, solve the problem. Then, write the code.",
  "The best error message is the one that never shows up.",
  "Clean code always looks like it was written by someone who cares.",
  "Make it work, make it right, make it fast.",

  // Wisdom
  "A bug in production is worth two in testing.",
  "There are only two hard problems in computer science: cache invalidation and naming things.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Programming is not about typing, it's about thinking.",
  "The most important skill for a programmer is the ability to effectively do nothing.",

  // Funny
  "It works on my machine. ¯\\_(ツ)_/¯",
  "Debugging: Being the detective in a crime movie where you are also the murderer.",
  "99 little bugs in the code, 99 little bugs. Take one down, patch it around, 127 little bugs in the code.",
  "Programming is 10% writing code and 90% understanding why it doesn't work.",
  "Copy-paste is not a design pattern... or is it?",

  // Motivational
  "Every expert was once a beginner. Keep typing.",
  "Your code today is better than your code yesterday.",
  "The only way to learn a new programming language is by writing programs in it.",
  "Don't watch the clock; do what it does. Keep going.",
  "Strive for progress, not perfection.",

  // Truth Bombs
  "Code never lies, comments sometimes do.",
  "Weeks of coding can save you hours of planning.",
  "The best code is no code at all.",
  "Good code is its own best documentation.",
  "If debugging is the process of removing bugs, then programming must be the process of putting them in.",

  // Modern Dev
  "Ship fast, learn faster.",
  "Move fast and ship things.",
  "Done is better than perfect.",
  "Premature optimization is the root of all evil.",
  "Convention over configuration.",

  // Team & Collaboration
  "Code reviews are like group therapy for your commits.",
  "Pair programming: Two developers, one keyboard, infinite possibilities.",
  "The best way to predict the future is to implement it.",
  "Legacy code: Code written by someone who is smarter than you.",
  "Document your code as if the next maintainer is a violent psychopath who knows where you live.",

  // Philosophy
  "Simplicity is the ultimate sophistication.",
  "Less is more, except when it comes to RAM.",
  "Code is poetry written for machines to execute.",
  "Every line of code is a liability.",
  "Programs must be written for people to read, and only incidentally for machines to execute.",

  // Reality Check
  "It's not a bug, it's an undocumented feature.",
  "There are no solutions, only trade-offs.",
  "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.",
  "The road to wisdom? Well, it's plain and simple to express: Err and err and err again, but less and less and less.",
  "Always code as if the person who ends up maintaining your code is a violent psychopath who knows where you live.",

  // Tech Booth Special
  "The best time to start coding was yesterday. The second best time is now.",
  "You're not slow, you're just building muscle memory.",
  "Every keystroke is a step closer to mastery.",
  "Fast fingers, faster features.",
  "Type with confidence, debug with patience.",
];

// Get a random quote based on performance
export function getQuoteForPerformance(wpm: number): string {
  let filteredQuotes = [...developerQuotes];

  // For high performers (>80 WPM), give motivational/wisdom quotes
  if (wpm > 80) {
    const highPerformanceQuotes = [
      "Blazing fast! Your keyboard must be smoking.",
      "Speed typing level: Senior Developer unlocked.",
      "At this rate, you'll automate yourself out of a job!",
      "Your fingers are faster than production deployments.",
      "Impressive! Your commit velocity is through the roof.",
    ];
    filteredQuotes = [...highPerformanceQuotes, ...developerQuotes];
  }

  // For learning performers (<40 WPM), give encouraging quotes
  if (wpm < 40) {
    const encouragingQuotes = [
      "Rome wasn't built in a day, and neither were fast fingers.",
      "Every master was once a beginner. Keep practicing!",
      "Slow is smooth, smooth is fast. You're on the right path.",
      "Quality over speed. Your thoughtful typing shows care.",
      "The journey of a thousand keystrokes begins with a single key.",
    ];
    filteredQuotes = [...encouragingQuotes, ...developerQuotes];
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  return filteredQuotes[randomIndex];
}

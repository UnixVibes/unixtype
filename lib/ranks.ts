// Developer rank system based on WPM
export interface Rank {
  title: string;
  minWpm: number;
  emoji: string;
  color: string;
  message: string;
}

export const ranks: Rank[] = [
  {
    title: "Intern",
    minWpm: 0,
    emoji: "🐣",
    color: "text-gray-400",
    message: "Every master was once a beginner!"
  },
  {
    title: "Junior Dev",
    minWpm: 30,
    emoji: "💻",
    color: "text-blue-400",
    message: "You're getting the hang of it!"
  },
  {
    title: "Developer",
    minWpm: 45,
    emoji: "⚡",
    color: "text-green-400",
    message: "Solid coding speed!"
  },
  {
    title: "Senior Dev",
    minWpm: 60,
    emoji: "🚀",
    color: "text-teal-400",
    message: "Impressive keyboard skills!"
  },
  {
    title: "Tech Lead",
    minWpm: 75,
    emoji: "🔥",
    color: "text-orange-400",
    message: "You're on fire!"
  },
  {
    title: "Architect",
    minWpm: 90,
    emoji: "🏗️",
    color: "text-purple-400",
    message: "Elite level typing!"
  },
  {
    title: "CTO",
    minWpm: 110,
    emoji: "👑",
    color: "text-yellow-400",
    message: "Legendary developer!"
  },
  {
    title: "Code Wizard",
    minWpm: 130,
    emoji: "🧙",
    color: "text-pink-400",
    message: "Are you even human?!"
  }
];

export function getRank(wpm: number): Rank {
  for (let i = ranks.length - 1; i >= 0; i--) {
    if (wpm >= ranks[i].minWpm) {
      return ranks[i];
    }
  }
  return ranks[0];
}

export function getNextRank(wpm: number): Rank | null {
  const currentRank = getRank(wpm);
  const currentIndex = ranks.indexOf(currentRank);

  if (currentIndex < ranks.length - 1) {
    return ranks[currentIndex + 1];
  }

  return null;
}

export function getProgressToNextRank(wpm: number): number {
  const nextRank = getNextRank(wpm);
  if (!nextRank) return 100;

  const currentRank = getRank(wpm);
  const range = nextRank.minWpm - currentRank.minWpm;
  const progress = wpm - currentRank.minWpm;

  return Math.min(100, Math.round((progress / range) * 100));
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  rank: string;
  rankEmoji: string;
  maxStreak: number;
  timestamp: number;
  date: string;
}

const LEADERBOARD_KEY = 'devtype-leaderboard';
const MAX_ENTRIES = 100;

export function saveScore(entry: Omit<LeaderboardEntry, 'id' | 'timestamp' | 'date'>): LeaderboardEntry {
  const leaderboard = getLeaderboard();

  const newEntry: LeaderboardEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    date: new Date().toISOString().split('T')[0],
  };

  leaderboard.push(newEntry);

  // Sort by WPM descending
  leaderboard.sort((a, b) => b.wpm - a.wpm);

  // Keep only top MAX_ENTRIES
  const trimmed = leaderboard.slice(0, MAX_ENTRIES);

  if (typeof window !== 'undefined') {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed));
  }

  return newEntry;
}

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load leaderboard:', error);
    return [];
  }
}

export function getTodayLeaderboard(): LeaderboardEntry[] {
  const today = new Date().toISOString().split('T')[0];
  return getLeaderboard().filter(entry => entry.date === today);
}

export function getTopScores(limit: number = 10, filterToday: boolean = false): LeaderboardEntry[] {
  const leaderboard = filterToday ? getTodayLeaderboard() : getLeaderboard();
  return leaderboard.slice(0, limit);
}

export function getUserRank(wpm: number, filterToday: boolean = false): number {
  const leaderboard = filterToday ? getTodayLeaderboard() : getLeaderboard();
  const betterScores = leaderboard.filter(entry => entry.wpm > wpm);
  return betterScores.length + 1;
}

export function clearLeaderboard(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LEADERBOARD_KEY);
  }
}

export function getLeaderboardStats() {
  const leaderboard = getLeaderboard();
  const today = getTodayLeaderboard();

  if (leaderboard.length === 0) {
    return {
      totalPlays: 0,
      todayPlays: 0,
      averageWpm: 0,
      highestWpm: 0,
      todayHighest: 0,
    };
  }

  return {
    totalPlays: leaderboard.length,
    todayPlays: today.length,
    averageWpm: Math.round(leaderboard.reduce((sum, e) => sum + e.wpm, 0) / leaderboard.length),
    highestWpm: Math.max(...leaderboard.map(e => e.wpm)),
    todayHighest: today.length > 0 ? Math.max(...today.map(e => e.wpm)) : 0,
  };
}

import { LeaderboardScore } from "@/types";

const LEADERBOARD_KEY = "unixtype_leaderboard";
const MAX_ENTRIES = 100;

class LocalLeaderboard {
  private getScores(): LeaderboardScore[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(LEADERBOARD_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      return [];
    }
  }

  private saveScores(scores: LeaderboardScore[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(scores));
    } catch (error) {
      console.error("Error saving leaderboard:", error);
    }
  }

  addScore(score: Omit<LeaderboardScore, "id" | "timestamp">): void {
    const scores = this.getScores();

    const newScore: LeaderboardScore = {
      ...score,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    scores.push(newScore);

    // Sort by WPM descending
    scores.sort((a, b) => b.wpm - a.wpm);

    // Keep only top entries
    const limitedScores = scores.slice(0, MAX_ENTRIES);

    this.saveScores(limitedScores);
  }

  getTopScores(
    limit: number = 10,
    filters?: {
      mode?: string;
      mode2?: string;
      language?: string;
    }
  ): LeaderboardScore[] {
    let scores = this.getScores();

    // Apply filters
    if (filters) {
      if (filters.mode) {
        scores = scores.filter((s) => s.mode === filters.mode);
      }
      if (filters.mode2) {
        scores = scores.filter((s) => s.mode2 === filters.mode2);
      }
      if (filters.language) {
        scores = scores.filter((s) => s.language === filters.language);
      }
    }

    return scores.slice(0, limit);
  }

  getPersonalBest(
    name: string,
    mode?: string,
    mode2?: string
  ): LeaderboardScore | null {
    const scores = this.getScores().filter((s) => s.name === name);

    let filtered = scores;
    if (mode) {
      filtered = filtered.filter((s) => s.mode === mode);
    }
    if (mode2) {
      filtered = filtered.filter((s) => s.mode2 === mode2);
    }

    if (filtered.length === 0) return null;

    // Return best WPM
    return filtered.reduce((best, current) =>
      current.wpm > best.wpm ? current : best
    );
  }

  getUserRank(
    name: string,
    mode?: string,
    mode2?: string,
    language?: string
  ): number {
    const scores = this.getTopScores(MAX_ENTRIES, { mode, mode2, language });
    const index = scores.findIndex((s) => s.name === name);
    return index === -1 ? -1 : index + 1;
  }

  getTotalScores(): number {
    return this.getScores().length;
  }

  clearLeaderboard(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(LEADERBOARD_KEY);
  }

  exportData(): string {
    return JSON.stringify(this.getScores(), null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (Array.isArray(data)) {
        this.saveScores(data);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error importing leaderboard data:", error);
      return false;
    }
  }
}

export default new LocalLeaderboard();

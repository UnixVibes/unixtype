'use client';

import { useEffect, useState } from 'react';
import { getTopScores, getLeaderboardStats, type LeaderboardEntry } from '@/lib/leaderboard';

interface LeaderboardProps {
  onClose?: () => void;
  highlightId?: string;
}

export default function Leaderboard({ onClose, highlightId }: LeaderboardProps) {
  const [filter, setFilter] = useState<'today' | 'all-time'>('today');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof getLeaderboardStats> | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, [filter]);

  const loadLeaderboard = () => {
    const topScores = getTopScores(10, filter === 'today');
    const leaderboardStats = getLeaderboardStats();
    setEntries(topScores);
    setStats(leaderboardStats);
  };

  const getMedalEmoji = (position: number): string => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `#${position}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass-effect rounded-3xl p-8 border-2 border-unix-main/30">
        {/* Header */}
        <div className="text-center border-b border-unix-border/30 pb-6 mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-5xl">🏆</span>
            <h1 className="text-4xl font-bold text-unix-main">Leaderboard</h1>
          </div>
          <p className="text-unix-sub text-sm">Top typists at the Unixdev booth</p>
        </div>

        {/* Stats Bar */}
        {stats && stats.totalPlays > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-unix-sub-alt/50 rounded-xl p-4 border border-unix-border/20">
              <div className="text-unix-sub text-xs mb-1">Total Plays</div>
              <div className="text-2xl font-bold text-unix-text">{stats.totalPlays}</div>
            </div>
            <div className="bg-unix-sub-alt/50 rounded-xl p-4 border border-unix-border/20">
              <div className="text-unix-sub text-xs mb-1">Today</div>
              <div className="text-2xl font-bold text-unix-accent">{stats.todayPlays}</div>
            </div>
            <div className="bg-unix-sub-alt/50 rounded-xl p-4 border border-unix-border/20">
              <div className="text-unix-sub text-xs mb-1">Avg WPM</div>
              <div className="text-2xl font-bold text-unix-text">{stats.averageWpm}</div>
            </div>
            <div className="bg-unix-sub-alt/50 rounded-xl p-4 border border-unix-border/20">
              <div className="text-unix-sub text-xs mb-1">Top WPM</div>
              <div className="text-2xl font-bold text-unix-success">{stats.highestWpm}</div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('today')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              filter === 'today'
                ? 'bg-unix-main text-unix-bg shadow-lg shadow-unix-main/30'
                : 'bg-unix-sub-alt/50 text-unix-sub hover:bg-unix-sub-alt border border-unix-border/20'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setFilter('all-time')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              filter === 'all-time'
                ? 'bg-unix-main text-unix-bg shadow-lg shadow-unix-main/30'
                : 'bg-unix-sub-alt/50 text-unix-sub hover:bg-unix-sub-alt border border-unix-border/20'
            }`}
          >
            All Time
          </button>
        </div>

        {/* Leaderboard Table */}
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <div className="text-unix-sub text-lg">No scores yet!</div>
            <div className="text-unix-sub/60 text-sm mt-2">
              Be the first to set a record
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, index) => {
              const isHighlighted = entry.id === highlightId;
              const position = index + 1;

              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    isHighlighted
                      ? 'bg-unix-main/20 border-2 border-unix-main shadow-lg shadow-unix-main/20'
                      : 'bg-unix-sub-alt/30 border border-unix-border/20 hover:bg-unix-sub-alt/50'
                  }`}
                >
                  {/* Rank */}
                  <div className="w-16 text-center">
                    <div className={`text-2xl font-bold ${position <= 3 ? '' : 'text-unix-sub'}`}>
                      {getMedalEmoji(position)}
                    </div>
                  </div>

                  {/* Player Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{entry.rankEmoji}</span>
                      <span className="font-bold text-unix-text text-lg">{entry.name}</span>
                      {isHighlighted && (
                        <span className="text-xs bg-unix-main text-unix-bg px-2 py-1 rounded-full font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-unix-sub mt-1">
                      {entry.rank} • {entry.accuracy}% accuracy • {entry.maxStreak} max streak
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className="text-3xl font-bold text-unix-main">{Math.round(entry.wpm)}</div>
                    <div className="text-xs text-unix-sub">WPM</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="w-full mt-6 py-3 px-6 bg-unix-sub-alt/50 hover:bg-unix-sub-alt text-unix-text rounded-xl font-semibold transition-all border border-unix-border/20"
          >
            Close
          </button>
        )}

        {/* Footer */}
        <div className="text-center mt-6 pt-6 border-t border-unix-border/30">
          <div className="text-unix-sub/60 text-xs">
            Powered by <span className="text-unix-accent font-bold">Unixdev</span>
          </div>
        </div>
      </div>
    </div>
  );
}

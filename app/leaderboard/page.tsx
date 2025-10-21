"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, FlaskConical } from "lucide-react";
import LocalLeaderboard from "@/lib/local-leaderboard";
import { LeaderboardScore } from "@/types";

export default function LeaderboardPage() {
  const [scores, setScores] = useState<LeaderboardScore[]>([]);
  const [filter, setFilter] = useState({
    mode: "all",
    mode2: "all",
  });
  const [playerName, setPlayerName] = useState("Guest");

  useEffect(() => {
    // Load saved name from localStorage
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("unixtype_username") || "Guest";
      setPlayerName(savedName);
    }
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [filter]);

  const loadLeaderboard = () => {
    const filters = filter.mode === "all" || filter.mode2 === "all" 
      ? undefined 
      : {
          mode: filter.mode === "all" ? undefined : filter.mode,
          mode2: filter.mode2 === "all" ? undefined : filter.mode2,
          language: "english",
        };
    
    const topScores = LocalLeaderboard.getTopScores(50, filters);
    setScores(topScores);
  };

  const clearLeaderboard = () => {
    if (confirm("Are you sure you want to clear all leaderboard data? This cannot be undone.")) {
      LocalLeaderboard.clearLeaderboard();
      loadLeaderboard();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-8 border-b border-unix-sub-alt">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-unix-sub text-sm">unix</div>
            <div className="text-unix-main text-2xl font-bold">unixtype</div>
          </div>
          <div className="text-unix-sub text-sm flex items-center gap-4">
            <a href="/" className="hover:text-unix-main transition-colors flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              back to test
            </a>
            <span className="text-unix-border">|</span>
            <a href="/testing" className="hover:text-unix-main transition-colors flex items-center gap-2">
              <FlaskConical className="w-4 h-4" strokeWidth={2.5} />
              test suite
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-unix-main mb-4">Leaderboard</h1>
            <p className="text-unix-sub">Compete with others and track your typing performance</p>
          </div>

          {/* Filters */}
          <div className="bg-unix-sub-alt rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-unix-sub text-sm mb-2">Mode</label>
                <select
                  value={filter.mode}
                  onChange={(e) => setFilter({ ...filter, mode: e.target.value })}
                  className="w-full p-3 bg-unix-bg text-unix-text rounded-lg focus:outline-none focus:ring-2 focus:ring-unix-main"
                  aria-label="Filter by test mode"
                >
                  <option value="all">All Modes</option>
                  <option value="time">Time</option>
                  <option value="words">Words</option>
                </select>
              </div>
              <div>
                <label className="block text-unix-sub text-sm mb-2">Duration/Count</label>
                <select
                  value={filter.mode2}
                  onChange={(e) => setFilter({ ...filter, mode2: e.target.value })}
                  className="w-full p-3 bg-unix-bg text-unix-text rounded-lg focus:outline-none focus:ring-2 focus:ring-unix-main"
                  aria-label="Filter by duration or word count"
                >
                  <option value="all">All</option>
                  {filter.mode === "time" || filter.mode === "all" ? (
                    <>
                      <option value="15">15 seconds</option>
                      <option value="30">30 seconds</option>
                      <option value="60">60 seconds</option>
                      <option value="120">120 seconds</option>
                    </>
                  ) : null}
                  {filter.mode === "words" || filter.mode === "all" ? (
                    <>
                      <option value="10">10 words</option>
                      <option value="25">25 words</option>
                      <option value="50">50 words</option>
                      <option value="100">100 words</option>
                    </>
                  ) : null}
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-unix-sub-alt rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-unix-main">{LocalLeaderboard.getTotalScores()}</div>
              <div className="text-unix-sub text-sm">Total Scores</div>
            </div>
            <div className="bg-unix-sub-alt rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-unix-main">
                #{LocalLeaderboard.getUserRank(playerName, filter.mode, filter.mode2, "english") || "N/A"}
              </div>
              <div className="text-unix-sub text-sm">Your Rank</div>
            </div>
            <div className="bg-unix-sub-alt rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-unix-main">
                {LocalLeaderboard.getPersonalBest(playerName, filter.mode, filter.mode2)?.wpm || "N/A"}
              </div>
              <div className="text-unix-sub text-sm">Your Best WPM</div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-unix-sub-alt rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-unix-text">Top Scores</h2>
              <button
                onClick={clearLeaderboard}
                className="px-4 py-2 bg-unix-error text-unix-bg rounded-lg hover:bg-red-600 transition-colors text-sm min-h-[44px]"
                aria-label="Clear all leaderboard data"
              >
                Clear All
              </button>
            </div>

            {scores.length === 0 ? (
              <div className="text-center text-unix-sub py-12" role="status">
                <div className="text-6xl mb-4">🏆</div>
                <div className="text-xl mb-2">No scores yet</div>
                <div>Be the first to set a record!</div>
                <a 
                  href="/" 
                  className="inline-block mt-4 px-6 py-3 bg-unix-main text-unix-bg rounded-lg hover:bg-unix-sub transition-colors min-h-[44px]"
                >
                  Start Typing Test
                </a>
              </div>
            ) : (
              <div className="space-y-2" role="list" aria-label="Leaderboard entries">
                {scores.map((score, index) => {
                  const isCurrentPlayer = score.name === playerName;
                  
                  return (
                    <div
                      key={score.id}
                      className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                        isCurrentPlayer
                          ? "bg-unix-main text-unix-bg"
                          : "bg-unix-bg hover:bg-opacity-80"
                      }`}
                      role="listitem"
                      aria-label={`${score.name}: Rank ${index + 1}, ${score.wpm} WPM, ${Math.round(score.accuracy)}% accuracy${isCurrentPlayer ? ' (Your score)' : ''}`}
                    >
                      <div className={`text-2xl font-bold w-8 ${
                        isCurrentPlayer ? "text-unix-bg" : "text-unix-main"
                      }`} aria-hidden="true">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold ${
                          isCurrentPlayer ? "text-unix-bg" : "text-unix-text"
                        }`}>
                          {score.name}
                        </div>
                        <div className={`text-sm ${
                          isCurrentPlayer ? "text-unix-bg opacity-80" : "text-unix-sub"
                        }`}>
                          {score.mode} {score.mode2} • {Math.round(score.accuracy)}% acc • {Math.round(score.consistency)}% cons
                        </div>
                      </div>
                      <div className={`text-2xl font-bold ${
                        isCurrentPlayer ? "text-unix-bg" : "text-unix-main"
                      }`} aria-label={`${score.wpm} words per minute`}>
                        {score.wpm}
                      </div>
                      <div className={`text-sm ${
                        isCurrentPlayer ? "text-unix-bg opacity-80" : "text-unix-sub"
                      }`} aria-hidden="true">
                        wpm
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-8 border-t border-unix-sub-alt">
        <div className="max-w-7xl mx-auto text-center text-unix-sub text-sm">
          Engineered by the UnixType Team
        </div>
      </footer>
    </div>
  );
}
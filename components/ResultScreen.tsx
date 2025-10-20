"use client";

import { useEffect, useState } from "react";
import { TestResult, LeaderboardScore } from "@/types";
import LocalLeaderboard from "@/lib/local-leaderboard";

interface ResultScreenProps {
  result: TestResult;
  onRestart: () => void;
}

export default function ResultScreen({ result, onRestart }: ResultScreenProps) {
  const [playerName, setPlayerName] = useState("Guest");
  const [leaderboard, setLeaderboard] = useState<LeaderboardScore[]>([]);
  const [showNameInput, setShowNameInput] = useState(true);
  const [nameInputValue, setNameInputValue] = useState("");

  useEffect(() => {
    // Load saved name from localStorage
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("unixtype_username") || "Guest";
      setPlayerName(savedName);
      setNameInputValue(savedName);
    }
  }, []);

  useEffect(() => {
    if (!showNameInput) {
      // Save score to leaderboard
      LocalLeaderboard.addScore({
        name: playerName,
        wpm: Math.round(result.wpm),
        accuracy: Math.round(result.accuracy),
        consistency: Math.round(result.consistency),
        mode: result.mode,
        mode2: result.mode2,
        language: result.language,
        raw: Math.round(result.rawWpm),
        testDuration: result.testDuration,
      });

      // Load leaderboard
      const scores = LocalLeaderboard.getTopScores(10, {
        mode: result.mode,
        mode2: result.mode2,
        language: result.language,
      });
      setLeaderboard(scores);
    }
  }, [showNameInput, playerName, result]);

  const handleNameSubmit = () => {
    if (nameInputValue.trim()) {
      const name = nameInputValue.trim();
      setPlayerName(name);
      if (typeof window !== "undefined") {
        localStorage.setItem("unixtype_username", name);
      }
      setShowNameInput(false);
    }
  };

  if (showNameInput) {
    return (
      <div className="w-full max-w-md mx-auto space-y-8 text-center">
        <div className="text-4xl font-bold text-unix-main mb-8">
          Test Complete!
        </div>

        <div className="bg-unix-sub-alt rounded-lg p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-lg">
            <div>
              <div className="text-unix-sub text-sm">WPM</div>
              <div className="text-3xl font-bold text-unix-main">{Math.round(result.wpm)}</div>
            </div>
            <div>
              <div className="text-unix-sub text-sm">Accuracy</div>
              <div className="text-3xl font-bold text-unix-text">{Math.round(result.accuracy)}%</div>
            </div>
            <div>
              <div className="text-unix-sub text-sm">Raw WPM</div>
              <div className="text-2xl font-bold text-unix-text">{Math.round(result.rawWpm)}</div>
            </div>
            <div>
              <div className="text-unix-sub text-sm">Consistency</div>
              <div className="text-2xl font-bold text-unix-text">{Math.round(result.consistency)}%</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-unix-sub text-sm">
            Enter your name to save to leaderboard:
          </label>
          <input
            type="text"
            value={nameInputValue}
            onChange={(e) => setNameInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
            placeholder="Your name"
            className="w-full p-3 bg-unix-sub-alt text-unix-text rounded-lg focus:outline-none focus:ring-2 focus:ring-unix-main"
            autoFocus
          />
          <button
            onClick={handleNameSubmit}
            className="w-full px-6 py-3 bg-unix-main text-unix-bg rounded-lg hover:bg-unix-sub transition-colors font-semibold"
          >
            Save & View Leaderboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="text-4xl font-bold text-center text-unix-main mb-8">
        Test Results
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Results Panel */}
        <div className="space-y-6">
          <div className="bg-unix-sub-alt rounded-lg p-8">
            <h2 className="text-2xl font-bold text-unix-text mb-6">Your Performance</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-unix-bg rounded">
                <span className="text-unix-sub">WPM</span>
                <span className="text-3xl font-bold text-unix-main">{Math.round(result.wpm)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-unix-bg rounded">
                <span className="text-unix-sub">Raw WPM</span>
                <span className="text-2xl font-bold text-unix-text">{Math.round(result.rawWpm)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-unix-bg rounded">
                <span className="text-unix-sub">Accuracy</span>
                <span className="text-2xl font-bold text-unix-text">{Math.round(result.accuracy)}%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-unix-bg rounded">
                <span className="text-unix-sub">Consistency</span>
                <span className="text-2xl font-bold text-unix-text">{Math.round(result.consistency)}%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-unix-bg rounded">
                <span className="text-unix-sub">Characters</span>
                <span className="text-xl text-unix-text">
                  <span className="text-unix-main">{result.correctChars}</span>
                  <span className="text-unix-sub mx-1">/</span>
                  <span className="text-unix-error">{result.incorrectChars}</span>
                  <span className="text-unix-sub mx-1">/</span>
                  <span className="text-unix-text">{result.totalChars}</span>
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-unix-bg rounded">
                <span className="text-unix-sub">Time</span>
                <span className="text-xl text-unix-text">{Math.round(result.testDuration)}s</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-unix-bg rounded">
                <span className="text-unix-sub">Mode</span>
                <span className="text-xl text-unix-text">{result.mode} {result.mode2}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onRestart}
            className="w-full px-6 py-4 bg-unix-main text-unix-bg rounded-lg hover:bg-unix-sub transition-colors font-semibold text-lg"
          >
            Next Test
          </button>
        </div>

        {/* Leaderboard Panel */}
        <div className="space-y-6">
          <div className="bg-unix-sub-alt rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-unix-text">Leaderboard</h2>
              <div className="text-sm text-unix-sub">
                {result.mode} {result.mode2} • {result.language}
              </div>
            </div>

            {leaderboard.length === 0 ? (
              <div className="text-center text-unix-sub py-8">
                No scores yet. Be the first!
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((score, index) => {
                  const isCurrentPlayer = score.name === playerName &&
                    Math.abs(score.timestamp - Date.now()) < 5000; // Highlight if submitted within last 5 seconds

                  return (
                    <div
                      key={score.id}
                      className={`flex items-center gap-4 p-4 rounded transition-colors ${
                        isCurrentPlayer
                          ? "bg-unix-main text-unix-bg"
                          : "bg-unix-bg hover:bg-opacity-80"
                      }`}
                    >
                      <div className={`text-2xl font-bold w-8 ${
                        isCurrentPlayer ? "text-unix-bg" : "text-unix-main"
                      }`}>
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
                          {Math.round(score.accuracy)}% acc • {Math.round(score.consistency)}% cons
                        </div>
                      </div>
                      <div className={`text-2xl font-bold ${
                        isCurrentPlayer ? "text-unix-bg" : "text-unix-main"
                      }`}>
                        {score.wpm}
                      </div>
                      <div className={`text-sm ${
                        isCurrentPlayer ? "text-unix-bg opacity-80" : "text-unix-sub"
                      }`}>
                        wpm
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-unix-sub-alt rounded-lg p-6">
            <div className="text-sm text-unix-sub space-y-2">
              <div className="flex justify-between">
                <span>Total Scores:</span>
                <span className="text-unix-text">{LocalLeaderboard.getTotalScores()}</span>
              </div>
              <div className="flex justify-between">
                <span>Your Rank:</span>
                <span className="text-unix-main font-semibold">
                  #{LocalLeaderboard.getUserRank(playerName, result.mode, result.mode2, result.language) || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

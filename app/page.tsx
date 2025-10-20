"use client";

import { useState } from "react";
import TypingTest from "@/components/TypingTest";
import ResultScreen from "@/components/ResultScreen";
import { TestResult } from "@/types";

export default function Home() {
  const [result, setResult] = useState<TestResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleTestComplete = (testResult: TestResult) => {
    setResult(testResult);
    setShowResults(true);
  };

  const handleRestart = () => {
    setShowResults(false);
    setResult(null);
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-8 border-b border-unix-sub-alt">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-unix-sub text-sm">unix</div>
            <div className="text-unix-main text-2xl font-bold">unixtype</div>
          </div>
          <div className="text-unix-sub text-sm">
            <a
              href="/leaderboard"
              className="hover:text-unix-main transition-colors underline-offset-4 hover:underline"
              aria-label="View full leaderboard"
            >
              leaderboard
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        {!showResults ? (
          <TypingTest onComplete={handleTestComplete} />
        ) : (
          <ResultScreen result={result!} onRestart={handleRestart} />
        )}
      </div>

      {/* Footer */}
      <footer className="w-full py-4 px-8 border-t border-unix-sub-alt">
        <div className="max-w-7xl mx-auto text-center text-unix-sub text-sm">
          Engineered by the UnixType Team
        </div>
      </footer>
    </main>
  );
}

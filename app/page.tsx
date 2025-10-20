"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TypingTest from "@/components/TypingTest";
import ResultScreen from "@/components/ResultScreen";
import { TestResult } from "@/types";
import { sounds } from "@/lib/sounds";

export default function Home() {
  const [result, setResult] = useState<TestResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    // Load sound preference
    setSoundEnabled(sounds.isEnabled());
  }, []);

  const handleTestComplete = (testResult: TestResult) => {
    setResult(testResult);
    setShowResults(true);
  };

  const handleRestart = () => {
    setShowResults(false);
    setResult(null);
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    sounds.setEnabled(newState);
  };

  return (
    <main className="min-h-screen flex flex-col relative">
      {/* Header */}
      <header className="w-full py-6 px-8 border-b border-unix-border backdrop-blur-sm bg-unix-bg/30 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-unix-main to-unix-accent rounded-xl flex items-center justify-center tech-glow-strong">
              <span className="text-white font-bold text-2xl">⚡</span>
            </div>
            <div className="flex flex-col">
              <div className="text-unix-main text-2xl font-bold tracking-tight">DevType Challenge</div>
              <div className="text-unix-sub text-xs font-medium flex items-center gap-2">
                <span>⚡ Code. Type. Compete.</span>
                <span className="text-unix-border">•</span>
                <span className="text-unix-accent">Powered by Unixdev</span>
              </div>
            </div>
          </div>
          <nav className="flex items-center gap-6">
            <motion.button
              onClick={toggleSound}
              className={`relative px-4 py-2 rounded-lg font-bold flex items-center gap-2 ${
                soundEnabled
                  ? 'bg-unix-main/20 text-unix-main border border-unix-main/40'
                  : 'bg-unix-sub-alt/50 text-unix-sub border border-unix-border/30'
              }`}
              aria-label={soundEnabled ? "Disable sound effects" : "Enable sound effects"}
              title={soundEnabled ? "Click to disable sound effects" : "Click to enable sound effects"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                backgroundColor: soundEnabled
                  ? 'rgba(20, 184, 166, 0.2)'
                  : 'rgba(13, 27, 42, 0.5)'
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.span
                className="text-xl"
                animate={{
                  rotate: soundEnabled ? [0, -10, 10, -10, 0] : 0,
                  scale: soundEnabled ? 1 : 0.9
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut"
                }}
              >
                {soundEnabled ? "🔊" : "🔇"}
              </motion.span>
              <span className="text-sm">Sound</span>
              <AnimatePresence>
                {soundEnabled && (
                  <motion.span
                    className="absolute -top-1 -right-1 w-2 h-2 bg-unix-main rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1]
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.button>
            <a
              href="/leaderboard"
              className="px-4 py-2 text-unix-sub hover:text-unix-main transition-all duration-200 font-bold flex items-center gap-2"
              aria-label="View full leaderboard"
            >
              🏆 Leaderboard
            </a>
            <div className="px-5 py-2 bg-unix-main/10 text-unix-main rounded-lg font-bold border border-unix-main/30">
              💻 Live at Booth
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 relative z-10">
        {!showResults ? (
          <TypingTest onComplete={handleTestComplete} />
        ) : (
          <ResultScreen result={result!} onRestart={handleRestart} maxStreak={result?.maxStreak || 0} />
        )}
      </div>

      {/* Footer */}
      <footer className="w-full py-6 px-8 border-t border-unix-border backdrop-blur-sm bg-unix-bg/30 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <div className="text-unix-main font-bold text-lg">Unixdev</div>
              <span className="text-unix-border">|</span>
              <span className="text-unix-sub">⚡ Building tools for developers who type fast and think faster</span>
            </div>
            <div className="flex items-center gap-6 text-unix-sub font-semibold">
              <span className="text-unix-main">🎮 Play at our booth!</span>
              <span>💬 #DevTypeChallenge</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

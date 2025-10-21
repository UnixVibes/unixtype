"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Volume2, VolumeX, Trophy, Info } from "lucide-react";
import TypingTest from "@/components/TypingTest";
import ResultScreen from "@/components/ResultScreen";
import { TestResult } from "@/types";
import { sounds } from "@/lib/sounds";
import { getRank } from "@/lib/ranks";

export default function Home() {
  const [result, setResult] = useState<TestResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sharedScore, setSharedScore] = useState<any>(null);

  useEffect(() => {
    // Load sound preference
    setSoundEnabled(sounds.isEnabled());

    // Check if there's a shared score in the URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const scoreParam = params.get('score');

      if (scoreParam) {
        try {
          console.log('🔍 Decoding shared score from URL...');
          // Decode the base64 string (handling Unicode characters)
          const jsonString = decodeURIComponent(escape(atob(scoreParam)));
          const decodedScore = JSON.parse(jsonString);
          console.log('✅ Successfully decoded shared score:', decodedScore);
          setSharedScore(decodedScore);
        } catch (error) {
          console.error('❌ Failed to decode shared score:', error);
          console.error('Score param:', scoreParam);
        }
      }
    }
  }, []);

  const handleTestComplete = (testResult: TestResult) => {
    console.log("Test completed with result:", testResult);
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
      {/* Header - Terminal Style */}
      <header className="w-full py-6 px-8 border-b border-unix-border-light backdrop-blur-sm bg-unix-bg/50 relative z-10 shadow-lg">
        {/* Terminal window dots */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="w-3 h-3 rounded-full bg-unix-error opacity-60"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-60"></div>
          <div className="w-3 h-3 rounded-full bg-unix-success opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-unix-main via-unix-purple to-unix-accent rounded-xl flex items-center justify-center tech-glow-strong relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <Zap className="w-6 h-6 text-white relative z-10" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <div className="holo-text text-2xl font-bold tracking-tight flex items-center gap-2">
                <span className="text-unix-sub opacity-60">&gt;</span>
UnixType Challenge
              </div>
              <div className="text-unix-sub text-xs font-medium flex items-center gap-2">
                <span className="text-unix-purple">⚡</span>
                <span>Code. Type. Compete.</span>
                <span className="text-unix-border-light">|</span>
                <span className="text-unix-accent neon-accent">Powered by Unixdev</span>
              </div>
            </div>
          </motion.div>
          <nav className="flex items-center gap-6">
            <motion.button
              onClick={toggleSound}
              className={`relative px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 ${
                soundEnabled
                  ? 'bg-unix-main/20 text-unix-main border border-unix-main/40'
                  : 'bg-unix-sub-alt/50 text-unix-sub border border-unix-border/30'
              }`}
              aria-label={soundEnabled ? "Disable sound effects" : "Enable sound effects"}
              title={soundEnabled ? "Click to disable sound effects" : "Click to enable sound effects"}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            >
              <motion.div
                animate={{
                  rotate: soundEnabled ? 0 : 0,
                  scale: soundEnabled ? 1 : 0.9
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut"
                }}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4" strokeWidth={2.5} />
                ) : (
                  <VolumeX className="w-4 h-4" strokeWidth={2.5} />
                )}
              </motion.div>
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
            <motion.a
              href="/history"
              className="px-4 py-2 text-unix-sub hover:text-unix-main transition-all duration-200 font-medium flex items-center gap-2"
              aria-label="About Unixdev"
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            >
              <Info className="w-4 h-4" strokeWidth={2.5} />
              About
            </motion.a>
            <motion.a
              href="/leaderboard"
              className="px-4 py-2 text-unix-sub hover:text-unix-main transition-all duration-200 font-medium flex items-center gap-2"
              aria-label="View full leaderboard"
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
              <Trophy className="w-4 h-4" strokeWidth={2.5} />
              Leaderboard
            </motion.a>
            <div className="px-5 py-2 bg-unix-main/10 text-unix-main rounded-lg font-bold border border-unix-main/30">
              💻 Live at Booth
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-6 px-4 relative z-10">
        <AnimatePresence mode="wait">
          {sharedScore ? (
            // Display shared score card
            <motion.div
              key="shared-score"
              className="w-full max-w-2xl mx-auto space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
            <div className="glass-effect rounded-3xl p-8 border-2 border-unix-main/30 shadow-lg">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{sharedScore.emoji}</div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-unix-main to-unix-accent bg-clip-text text-transparent mb-2">
                  {sharedScore.rank}
                </h1>
                <p className="text-2xl text-unix-text font-bold mb-4">{sharedScore.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass-effect rounded-2xl p-6 text-center border border-unix-main/30">
                  <div className="text-5xl font-bold text-unix-main mb-2">{sharedScore.wpm}</div>
                  <div className="text-sm text-unix-sub font-medium">WPM</div>
                </div>
                <div className="glass-effect rounded-2xl p-6 text-center border border-unix-success/30">
                  <div className="text-5xl font-bold text-unix-success mb-2">{sharedScore.accuracy}%</div>
                  <div className="text-sm text-unix-sub font-medium">Accuracy</div>
                </div>
              </div>

              <div className="glass-effect rounded-2xl p-6 text-center border border-unix-accent/30 mb-6">
                <div className="text-3xl font-bold text-unix-accent mb-2">🔥 {sharedScore.streak}</div>
                <div className="text-sm text-unix-sub font-medium">Max Streak</div>
              </div>

              <div className="text-center py-4 border-t border-unix-border/30">
                <p className="text-unix-main font-bold text-xl mb-2">#UnixTypeChallenge</p>
                <p className="text-unix-sub text-sm mb-4">Can you beat this score?</p>
                <button
                  onClick={() => {
                    setSharedScore(null);
                    window.history.pushState({}, '', '/');
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-unix-main to-unix-accent text-white rounded-xl hover:shadow-lg transition-all duration-200 font-bold text-lg"
                >
                  🎮 Take the Challenge!
                </button>
              </div>
            </div>
            </motion.div>
          ) : !showResults ? (
            <motion.div
              key="typing-test"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full"
            >
              <TypingTest onComplete={handleTestComplete} />
            </motion.div>
          ) : result ? (
            <motion.div
              key="result-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full"
            >
              <ResultScreen result={result} onRestart={handleRestart} maxStreak={result.maxStreak || 0} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Footer - Terminal Style */}
      <footer className="w-full py-6 px-8 border-t border-unix-border-light backdrop-blur-sm bg-unix-bg/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-unix-purple opacity-60">$</span>
                <div className="text-unix-main font-bold text-lg neon-accent">Unixdev</div>
              </div>
              <span className="text-unix-border-light">|</span>
              <span className="text-unix-sub">⚡ Building tools for developers who type fast and think faster</span>
            </div>
            <div className="flex items-center gap-6 text-unix-sub font-semibold">
              <span className="text-unix-main flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-unix-success rounded-full animate-pulse"></span>
                Live at booth
              </span>
              <span className="text-unix-purple-light">#UnixTypeChallenge</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Zap, RotateCcw, HelpCircle, Timer, Hash } from "lucide-react";
import { generateWords } from "@/lib/words";
import { TestResult } from "@/types";
import { countChars, calculateWPM, calculateAccuracy } from "@/lib/test-stats";
import { sounds } from "@/lib/sounds";

interface TypingTestProps {
  onComplete: (result: TestResult) => void;
}

export default function TypingTest({ onComplete }: TypingTestProps) {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [mode, setMode] = useState<"time" | "words">("time");
  const [timeLimit, setTimeLimit] = useState(30);
  const [wordCount, setWordCount] = useState(50);
  const [timeLeft, setTimeLeft] = useState(30);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [showInstructions, setShowInstructions] = useState(() => {
    // Show instructions for first-time visitors
    if (typeof window !== "undefined") {
      return !localStorage.getItem("unixtype_visited_before");
    }
    return false;
  });
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [combo, setCombo] = useState(1);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wpmIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const currentWordRef = useRef<HTMLDivElement>(null);
  const [caretPosition, setCaretPosition] = useState({ top: 0, left: 0 });
  const shouldEndTestRef = useRef(false);

  useEffect(() => {
    resetTest();
  }, [mode, timeLimit, wordCount]);

  // Auto-focus input on mount and when instructions are dismissed
  useEffect(() => {
    if (inputRef.current && !showInstructions) {
      inputRef.current.focus();
    }
  }, [showInstructions]);

  // Update caret position when current word or input changes
  useEffect(() => {
    if (currentWordRef.current && wordsContainerRef.current && isActive) {
      const containerRect = wordsContainerRef.current.getBoundingClientRect();
      const wordRect = currentWordRef.current.getBoundingClientRect();

      // Create a temporary span to measure the width of typed characters
      const span = document.createElement('span');
      span.style.visibility = 'hidden';
      span.style.position = 'absolute';
      span.style.fontSize = '1.5rem'; // text-2xl
      span.style.fontFamily = getComputedStyle(currentWordRef.current).fontFamily;
      span.textContent = currentInput;
      document.body.appendChild(span);
      const textWidth = span.getBoundingClientRect().width;
      document.body.removeChild(span);

      setCaretPosition({
        top: wordRect.top - containerRect.top,
        left: wordRect.left - containerRect.left + textWidth
      });
    }
  }, [currentInput, currentWordIndex, isActive]);

  const endTest = useCallback(() => {
    console.log("endTest called, typedWords:", typedWords.length, "currentInput:", currentInput);

    if (timerRef.current) clearInterval(timerRef.current);
    if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
    setIsActive(false);
    shouldEndTestRef.current = false;

    const endTime = Date.now();
    const duration = startTime ? (endTime - startTime) / 1000 : 1;

    // Don't end test if no words were typed
    if (typedWords.length === 0 && !currentInput.trim()) {
      console.log("Test ended with no typed words - ignoring");
      return;
    }

    // Use Monkeytype's character counting logic
    const targetWords = words.slice(0, typedWords.length);
    const chars = countChars(typedWords, targetWords);
    const { wpm, raw } = calculateWPM(chars, Math.max(duration, 0.01));
    const accuracy = calculateAccuracy(chars);

    // Calculate consistency (coefficient of variation of WPM)
    let consistency = 50; // Default value
    if (wpmHistory.length > 1) {
      const mean = wpmHistory.reduce((a, b) => a + b, 0) / wpmHistory.length;
      if (mean > 0) {
        const variance = wpmHistory.reduce((sum, wpm) => sum + Math.pow(wpm - mean, 2), 0) / wpmHistory.length;
        const stdDev = Math.sqrt(variance);
        consistency = Math.round((1 - (stdDev / mean)) * 100);
      }
    }

    const result: TestResult = {
      wpm: Math.max(0, wpm),
      rawWpm: Math.max(0, raw),
      accuracy: Math.max(0, Math.min(100, accuracy)),
      consistency: Math.max(0, Math.min(100, consistency)),
      correctChars: chars.allCorrectChars,
      incorrectChars: chars.incorrectChars + chars.extraChars,
      totalChars: chars.allCorrectChars + chars.incorrectChars + chars.extraChars,
      testDuration: duration,
      mode,
      mode2: mode === "time" ? timeLimit.toString() : wordCount.toString(),
      language: "english",
      maxStreak,
    };

    // Play test complete sound
    sounds.playTestComplete();

    onComplete(result);
  }, [startTime, typedWords, currentInput, words, mode, timeLimit, wordCount, wpmHistory, maxStreak, onComplete]);

  const resetTest = useCallback(() => {
    const newWords = generateWords(mode === "words" ? wordCount : 200);
    setWords(newWords);
    setCurrentWordIndex(0);
    setCurrentInput("");
    setStartTime(null);
    setIsActive(false);
    setTypedWords([]);
    setTimeLeft(mode === "time" ? timeLimit : 0);
    setWpmHistory([]);
    setStreak(0);
    setMaxStreak(0);
    setCombo(1);
    setParticles([]);

    if (timerRef.current) clearInterval(timerRef.current);
    if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);

    // Auto-focus input after reset
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  }, [mode, timeLimit, wordCount]);

  const startTest = useCallback(() => {
    if (!isActive) {
      const now = Date.now();
      setIsActive(true);
      setStartTime(now);
      shouldEndTestRef.current = false;

      if (mode === "time") {
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              shouldEndTestRef.current = true;
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }

      // Track WPM every second
      wpmIntervalRef.current = setInterval(() => {
        setWpmHistory(prev => {
          const currentTypedWords = [...typedWords];
          if (currentInput.trim()) {
            currentTypedWords.push(currentInput.trim());
          }
          const targetWords = words.slice(0, currentTypedWords.length);
          const chars = countChars(currentTypedWords, targetWords);
          const elapsed = (Date.now() - now) / 1000 / 60;
          if (elapsed > 0 && chars.allCorrectChars > 0) {
            const currentWpm = Math.round((chars.allCorrectChars / 5) / elapsed);
            return [...prev, currentWpm];
          }
          return prev;
        });
      }, 1000);
    }
  }, [isActive, mode]);

  useEffect(() => {
    if (mode === "words" && currentWordIndex >= wordCount && isActive) {
      endTest();
    }
  }, [currentWordIndex, wordCount, mode, isActive, endTest]);

  // Watch for timer end
  useEffect(() => {
    if (shouldEndTestRef.current && isActive) {
      console.log("Timer ended, calling endTest");
      endTest();
    }
  }, [timeLeft, isActive, endTest]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!isActive && value.length > 0) {
      startTest();
    }

    // Play keystroke sound for correct characters
    if (value.length > currentInput.length) {
      const currentWord = words[currentWordIndex];
      const typedChar = value[value.length - 1];
      const expectedChar = currentWord?.[value.length - 1];

      if (typedChar === expectedChar) {
        sounds.playKeystroke();
      }
    }

    if (value.endsWith(" ")) {
      handleWordSubmit(value.trim());
      setCurrentInput("");
    } else {
      setCurrentInput(value);
    }
  };

  const handleWordSubmit = (typedWord: string) => {
    const currentWord = words[currentWordIndex];
    if (!currentWord) return;

    setTypedWords((prev) => [...prev, typedWord]);
    setCurrentWordIndex((prev) => prev + 1);

    // Check if word is correct for streak/combo
    const isCorrect = typedWord === currentWord;
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak));

      // Play word complete sound
      sounds.playWordComplete();

      // Increase combo every 5 correct words
      if (newStreak % 5 === 0) {
        setCombo((prev) => Math.min(prev + 0.5, 3));
        sounds.playComboUp(); // Play combo sound
      }

      // Play streak milestone sound at 10, 20, 30, etc.
      if (newStreak % 10 === 0) {
        sounds.playStreakMilestone(newStreak);
      }

      // Add particle effect
      if (currentWordRef.current) {
        const rect = currentWordRef.current.getBoundingClientRect();
        const newParticle = {
          id: Date.now(),
          x: rect.left + rect.width / 2,
          y: rect.top,
        };
        setParticles((prev) => [...prev, newParticle]);

        // Remove particle after animation
        setTimeout(() => {
          setParticles((prev) => prev.filter(p => p.id !== newParticle.id));
        }, 1000);
      }
    } else {
      setStreak(0);
      setCombo(1);
      sounds.playError(); // Play error sound
    }
  };

  const getWordClass = (index: number) => {
    if (index < currentWordIndex) {
      return words[index] === typedWords[index] ? "text-unix-main" : "text-unix-error";
    } else if (index === currentWordIndex) {
      return "text-unix-text border-b-2 border-unix-main";
    } else {
      return "text-unix-sub";
    }
  };

  const getWordIndicator = (index: number) => {
    if (index < currentWordIndex) {
      return words[index] === typedWords[index] ? "✓" : "✗";
    }
    return null;
  };

  const getCharClass = (wordIndex: number, charIndex: number) => {
    if (wordIndex !== currentWordIndex) return "";

    const char = currentInput[charIndex];
    const expectedChar = words[currentWordIndex][charIndex];

    if (!char) return "";
    if (char === expectedChar) return "text-unix-main";
    return "text-unix-error bg-unix-error-dark";
  };

  const getCharIndicator = (wordIndex: number, charIndex: number) => {
    if (wordIndex !== currentWordIndex) return null;

    const char = currentInput[charIndex];
    const expectedChar = words[currentWordIndex][charIndex];

    if (!char) return null;
    if (char === expectedChar) return null; // No indicator for correct chars
    return "✗"; // Visual indicator for incorrect chars
  };

  const handleInstructionsDismiss = () => {
    setShowInstructions(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("unixtype_visited_before", "true");
    }
  };

  if (showInstructions) {
    return (
      <motion.div
        className="w-full max-w-2xl mx-auto space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="glass-effect rounded-2xl p-8 shadow-2xl" role="dialog" aria-labelledby="instructions-title" aria-modal="true">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-unix-main to-unix-accent mb-4"
            >
              <Zap className="w-12 h-12 text-white" strokeWidth={2.5} />
            </motion.div>
            <h1 id="instructions-title" className="text-5xl font-bold bg-gradient-to-r from-unix-main to-unix-accent bg-clip-text text-transparent mb-3">
              DevType Challenge
            </h1>
            <p className="text-2xl text-unix-sub font-semibold mb-2">Test Your Developer Speed!</p>
            <p className="text-sm text-unix-accent font-semibold">Powered by Unixdev</p>
          </div>

          <div className="space-y-6 text-unix-text">
            <section className="bg-unix-bg/50 rounded-xl p-6 border border-unix-main/20">
              <h2 className="text-2xl font-bold text-unix-main mb-4 flex items-center gap-2">
                🎮 Game Rules
              </h2>
              <ul className="space-y-3 text-base">
                <li className="flex items-start gap-3">
                  <span className="text-unix-main text-xl">→</span>
                  <span>Type <strong className="text-unix-main">developer terms</strong> (JavaScript, React, Docker, etc.)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-unix-main text-xl">→</span>
                  <span>Build <strong className="text-unix-success">streaks</strong> 🔥 by typing correctly</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-unix-main text-xl">→</span>
                  <span>Unlock <strong className="text-unix-accent">combo multipliers</strong> ×1.5, ×2.0, ×3.0</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-unix-main text-xl">→</span>
                  <span>Compete for the <strong className="text-unix-accent">TOP SPOT</strong> on the leaderboard!</span>
                </li>
              </ul>
            </section>

            <section className="grid grid-cols-2 gap-4">
              <motion.div
                className="glass-effect rounded-xl p-5 border border-unix-success/30"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <Timer className="w-8 h-8 text-unix-success mb-2" strokeWidth={2.5} />
                <h3 className="font-bold text-unix-success mb-2">Quick Mode</h3>
                <p className="text-sm text-unix-text/80">30-60 seconds of intense typing!</p>
              </motion.div>
              <motion.div
                className="glass-effect rounded-xl p-5 border border-unix-accent/30"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <Zap className="w-8 h-8 text-unix-accent mb-2" strokeWidth={2.5} />
                <h3 className="font-bold text-unix-accent mb-2">High Score</h3>
                <p className="text-sm text-unix-text/80">Beat the top developers!</p>
              </motion.div>
            </section>

            <motion.div
              className="bg-gradient-to-r from-unix-main/20 to-unix-accent/20 rounded-xl p-4 border border-unix-main/30"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <p className="text-center text-base flex items-center justify-center gap-2">
                <Flame className="w-5 h-5 text-unix-main" strokeWidth={2.5} />
                <strong className="text-unix-main">Pro Tip:</strong> Build long streaks for massive bonus points!
              </p>
            </motion.div>
          </div>

          <div className="mt-8">
            <motion.button
              onClick={handleInstructionsDismiss}
              className="w-full px-10 py-6 bg-gradient-to-r from-unix-main to-unix-accent text-white rounded-2xl font-bold text-2xl min-h-[60px] flex items-center justify-center gap-3"
              aria-label="Start typing test"
              whileHover={{ scale: 1.02, boxShadow: "0 20px 50px rgba(20, 184, 166, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Zap className="w-6 h-6" strokeWidth={2.5} />
              START GAME
            </motion.button>
            <p className="text-center text-unix-sub text-sm mt-4">
              Press any key to begin instantly!
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Help Button */}
      <motion.div
        className="flex justify-end"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.button
          onClick={() => setShowInstructions(true)}
          className="px-5 py-2.5 glass-effect text-unix-sub hover:text-unix-main rounded-xl transition-all duration-200 text-sm font-medium border border-unix-border/50 hover:border-unix-main/50 min-h-[44px] min-w-[44px] flex items-center gap-2"
          aria-label="Show instructions and help"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <HelpCircle className="w-4 h-4" strokeWidth={2.5} />
          Help
        </motion.button>
      </motion.div>

      {/* Test Configuration */}
      <div className="flex items-center justify-center gap-6 text-sm" role="group" aria-label="Test configuration">
        <div className="flex gap-2 glass-effect p-1 rounded-xl" role="radiogroup" aria-labelledby="mode-label">
          <span id="mode-label" className="sr-only">Test mode</span>
          <button
            onClick={() => {setMode("time"); resetTest();}}
            className={`px-6 py-2.5 rounded-lg min-h-[44px] min-w-[44px] font-semibold transition-all duration-200 ${mode === "time" ? "bg-unix-main text-white shadow-tech" : "text-unix-sub hover:text-unix-text"}`}
            role="radio"
            aria-checked={mode === "time"}
            aria-label="Time mode - type for a set duration"
          >
            Time
          </button>
          <button
            onClick={() => {setMode("words"); resetTest();}}
            className={`px-6 py-2.5 rounded-lg min-h-[44px] min-w-[44px] font-semibold transition-all duration-200 ${mode === "words" ? "bg-unix-main text-white shadow-tech" : "text-unix-sub hover:text-unix-text"}`}
            role="radio"
            aria-checked={mode === "words"}
            aria-label="Words mode - type a set number of words"
          >
            Words
          </button>
        </div>

        {mode === "time" ? (
          <div className="flex gap-2 glass-effect p-1 rounded-xl" role="radiogroup" aria-labelledby="time-label">
            <span id="time-label" className="sr-only">Time limit in seconds</span>
            {[15, 30, 60, 120].map((time) => (
              <button
                key={time}
                onClick={() => {setTimeLimit(time); resetTest();}}
                className={`px-5 py-2.5 rounded-lg min-h-[44px] min-w-[60px] font-semibold transition-all duration-200 ${timeLimit === time ? "bg-unix-main text-white shadow-tech" : "text-unix-sub hover:text-unix-text"}`}
                role="radio"
                aria-checked={timeLimit === time}
                aria-label={`${time} seconds`}
              >
                {time}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex gap-2 glass-effect p-1 rounded-xl" role="radiogroup" aria-labelledby="words-label">
            <span id="words-label" className="sr-only">Number of words</span>
            {[10, 25, 50, 100].map((count) => (
              <button
                key={count}
                onClick={() => {setWordCount(count); resetTest();}}
                className={`px-5 py-2.5 rounded-lg min-h-[44px] min-w-[60px] font-semibold transition-all duration-200 ${wordCount === count ? "bg-unix-main text-white shadow-tech" : "text-unix-sub hover:text-unix-text"}`}
                role="radio"
                aria-checked={wordCount === count}
                aria-label={`${count} words`}
              >
                {count}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Timer & Combo Display */}
      <div className="flex items-center justify-center gap-6">
        <AnimatePresence mode="wait">
          {mode === "time" && isActive && (
            <motion.div
              key="timer"
              className="text-center"
              role="timer"
              aria-live="polite"
              aria-label={`${timeLeft} seconds remaining`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="inline-block glass-effect px-8 py-4 rounded-2xl border border-unix-main/30">
                <div className="flex items-center gap-2 mb-1">
                  <Timer className="w-5 h-5 text-unix-main" strokeWidth={2.5} />
                  <div className="text-5xl font-bold text-unix-main mono tech-glow">{timeLeft}</div>
                </div>
                <div className="text-xs text-unix-sub font-medium">seconds</div>
              </div>
            </motion.div>
          )}

          {/* Streak Display */}
          {isActive && streak > 0 && (
            <motion.div
              key={`streak-${streak}`}
              className="text-center"
              initial={{ opacity: 0, scale: 0.5, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                className={`inline-block glass-effect px-6 py-3 rounded-2xl border-2 ${
                  streak >= 10 ? 'border-unix-accent tech-glow-strong' : 'border-unix-success/50'
                }`}
                animate={{
                  scale: streak >= 10 ? [1, 1.05, 1] : 1
                }}
                transition={{ duration: 0.5, repeat: streak >= 10 ? Infinity : 0, repeatDelay: 1 }}
              >
                <div className="flex items-center gap-2 text-3xl font-bold text-unix-success">
                  <Flame className="w-6 h-6" strokeWidth={2.5} />
                  {streak}
                </div>
                <div className="text-xs text-unix-sub font-medium mt-1">streak</div>
              </motion.div>
            </motion.div>
          )}

          {/* Combo Multiplier */}
          {isActive && combo > 1 && (
            <motion.div
              key={`combo-${combo}`}
              className="text-center"
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="inline-block glass-effect px-6 py-3 rounded-2xl border-2 border-unix-accent tech-glow">
                <div className="flex items-center gap-2 text-3xl font-bold text-unix-accent">
                  <Zap className="w-6 h-6" strokeWidth={2.5} />
                  ×{combo.toFixed(1)}
                </div>
                <div className="text-xs text-unix-sub font-medium mt-1">combo</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Words Display */}
      <div className="relative">
        <div
          ref={wordsContainerRef}
          className="text-2xl mono leading-relaxed flex flex-wrap gap-3 p-10 glass-effect rounded-2xl min-h-[240px] border border-unix-border/50"
          role="application"
          aria-label="Typing test words"
          aria-live="polite"
          aria-atomic="false"
        >
          {words.slice(0, Math.min(currentWordIndex + 20, words.length)).map((word, wordIndex) => (
            <div
              key={wordIndex}
              ref={wordIndex === currentWordIndex ? currentWordRef : null}
              className={`${getWordClass(wordIndex)} transition-colors relative`}
              aria-label={
                wordIndex < currentWordIndex
                  ? `Word ${wordIndex + 1}: ${typedWords[wordIndex]} - ${words[wordIndex] === typedWords[wordIndex] ? 'correct' : 'incorrect'}`
                  : wordIndex === currentWordIndex
                  ? `Current word ${wordIndex + 1}: ${word}`
                  : `Upcoming word ${wordIndex + 1}: ${word}`
              }
            >
              {getWordIndicator(wordIndex) && (
                <span
                  className={`absolute -top-2 -left-2 text-xs font-bold ${
                    words[wordIndex] === typedWords[wordIndex]
                      ? "text-unix-main"
                      : "text-unix-error"
                  }`}
                  aria-hidden="true"
                >
                  {getWordIndicator(wordIndex)}
                </span>
              )}
              {wordIndex === currentWordIndex
                ? word.split("").map((char, charIndex) => (
                    <span
                      key={charIndex}
                      className={`relative ${getCharClass(wordIndex, charIndex)}`}
                      aria-label={
                        currentInput[charIndex] === word[charIndex]
                          ? `Character ${charIndex + 1}: ${char} - correct`
                          : currentInput[charIndex]
                          ? `Character ${charIndex + 1}: ${currentInput[charIndex]} - incorrect, expected ${char}`
                          : `Character ${charIndex + 1}: ${char} - not typed yet`
                      }
                    >
                      {char}
                      {getCharIndicator(wordIndex, charIndex) && (
                        <span
                          className="absolute -top-2 -right-2 text-xs text-unix-error font-bold"
                          aria-hidden="true"
                        >
                          {getCharIndicator(wordIndex, charIndex)}
                        </span>
                      )}
                    </span>
                  ))
                : word}
            </div>
          ))}
        </div>

        {/* Caret */}
        {isActive && (
          <div
            className="absolute w-0.5 h-8 bg-unix-main animate-pulse transition-all duration-100"
            style={{
              top: `${caretPosition.top + 8}px`,
              left: `${caretPosition.left + 8}px`
            }}
            aria-hidden="true"
          />
        )}

        {/* Particle Effects */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute pointer-events-none animate-bounce"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              animation: 'float-up 1s ease-out forwards',
            }}
          >
            <span className="text-2xl">✨</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-50px) scale(1.5);
          }
        }
      `}</style>

      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        value={currentInput}
        onChange={handleInputChange}
        className="w-full p-5 text-xl mono glass-effect text-unix-text rounded-2xl focus:outline-none focus:ring-2 focus:ring-unix-main border border-unix-border/50 focus:border-unix-main/50 transition-all duration-200"
        placeholder={isActive ? "Type the words above..." : "Click here to start typing..."}
        disabled={!isActive && currentWordIndex >= (mode === "words" ? wordCount : words.length)}
        aria-label="Type the words shown above"
        aria-describedby="typing-instructions"
      />
      <div id="typing-instructions" className="sr-only">
        Type the highlighted word exactly as shown. Press space after each word to move to the next one.
      </div>

      {/* Stats Display */}
      <div className="flex justify-center gap-8 text-sm font-medium" role="status" aria-live="polite" aria-atomic="true">
        <div className="glass-effect px-4 py-2 rounded-lg border border-unix-border/30" aria-label={`Progress: ${currentWordIndex} of ${mode === "words" ? wordCount : "unlimited"} words`}>
          <span className="text-unix-sub">Words:</span> <span className="text-unix-text ml-1">{currentWordIndex}/{mode === "words" ? wordCount : "∞"}</span>
        </div>
        <div className="glass-effect px-4 py-2 rounded-lg border border-unix-border/30" aria-label={`${typedWords.length} words typed`}>
          <span className="text-unix-sub">Typed:</span> <span className="text-unix-text ml-1">{typedWords.length}</span>
        </div>
        {isActive && startTime && (typedWords.length > 0 || currentInput.length > 0) && (
          <>
            <div className="glass-effect px-4 py-2 rounded-lg border border-unix-main/30 tech-glow" aria-label={`Current speed: ${(() => {
              const currentTypedWords = [...typedWords];
              if (currentInput.trim()) {
                currentTypedWords.push(currentInput.trim());
              }
              const targetWords = words.slice(0, currentTypedWords.length);
              const chars = countChars(currentTypedWords, targetWords);
              const duration = (Date.now() - startTime) / 1000;
              const { wpm } = calculateWPM(chars, Math.max(duration, 0.01));
              return wpm;
            })()} words per minute`}>
              <span className="text-unix-sub">WPM:</span> <span className="text-unix-main font-bold ml-1">{(() => {
                const currentTypedWords = [...typedWords];
                if (currentInput.trim()) {
                  currentTypedWords.push(currentInput.trim());
                }
                const targetWords = words.slice(0, currentTypedWords.length);
                const chars = countChars(currentTypedWords, targetWords);
                const duration = (Date.now() - startTime) / 1000;
                const { wpm } = calculateWPM(chars, Math.max(duration, 0.01));
                return wpm;
              })()}</span>
            </div>
            <div className="glass-effect px-4 py-2 rounded-lg border border-unix-success/30" aria-label={`Current accuracy: ${(() => {
              const currentTypedWords = [...typedWords];
              if (currentInput.trim()) {
                currentTypedWords.push(currentInput.trim());
              }
              const targetWords = words.slice(0, currentTypedWords.length);
              const chars = countChars(currentTypedWords, targetWords);
              const accuracy = calculateAccuracy(chars);
              return Math.round(accuracy);
            })()} percent`}>
              <span className="text-unix-sub">Acc:</span> <span className="text-unix-success font-bold ml-1">{(() => {
                const currentTypedWords = [...typedWords];
                if (currentInput.trim()) {
                  currentTypedWords.push(currentInput.trim());
                }
                const targetWords = words.slice(0, currentTypedWords.length);
                const chars = countChars(currentTypedWords, targetWords);
                const accuracy = calculateAccuracy(chars);
                return Math.round(accuracy);
              })()}%</span>
            </div>
          </>
        )}
      </div>

      {/* Restart Button */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <motion.button
          onClick={resetTest}
          className="px-10 py-4 glass-effect text-unix-main rounded-xl hover:bg-unix-main hover:text-white transition-all duration-200 font-semibold border border-unix-main/30 hover:border-unix-main tech-glow min-h-[48px] min-w-[120px] flex items-center gap-2"
          aria-label="Restart the typing test"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
          Restart
        </motion.button>
      </motion.div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { generateWords } from "@/lib/words";
import { TestResult } from "@/types";
import { countChars, calculateWPM, calculateAccuracy } from "@/lib/test-stats";

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

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wpmIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    resetTest();
  }, [mode, timeLimit, wordCount]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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

    if (timerRef.current) clearInterval(timerRef.current);
    if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
  }, [mode, timeLimit, wordCount]);

  const startTest = useCallback(() => {
    if (!isActive) {
      const now = Date.now();
      setIsActive(true);
      setStartTime(now);

      if (mode === "time") {
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              endTest();
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

  const endTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);

    const endTime = Date.now();
    const duration = startTime ? (endTime - startTime) / 1000 : 1;

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
    };

    onComplete(result);
  }, [startTime, typedWords, words, mode, timeLimit, wordCount, wpmHistory, onComplete]);

  useEffect(() => {
    if (mode === "words" && currentWordIndex >= wordCount && isActive) {
      endTest();
    }
  }, [currentWordIndex, wordCount, mode, isActive, endTest]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!isActive && value.length > 0) {
      startTest();
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
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <div className="bg-unix-sub-alt rounded-lg p-8" role="dialog" aria-labelledby="instructions-title" aria-modal="true">
          <h1 id="instructions-title" className="text-3xl font-bold text-unix-main mb-6">
            Welcome to UnixType! 🚀
          </h1>
          
          <div className="space-y-6 text-unix-text">
            <section>
              <h2 className="text-xl font-semibold text-unix-main mb-3">How to Use</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>Click the input field or start typing to begin the test</li>
                <li>Type the highlighted word exactly as shown</li>
                <li>Press space after each word to move to the next one</li>
                <li>The test starts automatically when you begin typing</li>
                <li>Complete the test before time runs out or reach the word count goal</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-unix-main mb-3">Test Modes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-unix-bg rounded p-4">
                  <h3 className="font-semibold text-unix-sub mb-2">⏱️ Time Mode</h3>
                  <p className="text-sm">Type as many words as possible within the time limit (15, 30, 60, or 120 seconds)</p>
                </div>
                <div className="bg-unix-bg rounded p-4">
                  <h3 className="font-semibold text-unix-sub mb-2">📝 Words Mode</h3>
                  <p className="text-sm">Type a specific number of words (10, 25, 50, or 100) as quickly as possible</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-unix-main mb-3">Visual Indicators</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li><span className="text-unix-main">Green text</span>: Correct characters</li>
                <li><span className="text-unix-error">Red text with background</span>: Incorrect characters</li>
                <li><span className="text-unix-sub">Gray text</span>: Words to type</li>
                <li><span className="border-b-2 border-unix-main">Underlined</span>: Current word being typed</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-unix-main mb-3">Tips</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>Focus on accuracy first, speed will come with practice</li>
                <li>Don't correct mistakes - just keep typing</li>
                <li>Take a moment to look at the word before typing it</li>
                <li>Use the restart button anytime to reset the test</li>
              </ul>
            </section>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleInstructionsDismiss}
              className="flex-1 px-8 py-4 bg-unix-main text-unix-bg rounded-lg hover:bg-unix-sub transition-colors font-semibold text-lg min-h-[48px]"
              aria-label="Start typing test"
            >
              Start Typing
            </button>
            <button
              onClick={() => {
                handleInstructionsDismiss();
                inputRef.current?.focus();
              }}
              className="px-8 py-4 bg-unix-sub-alt text-unix-text rounded-lg hover:bg-unix-sub transition-colors font-semibold text-lg min-h-[48px] min-w-[120px]"
              aria-label="Show instructions again later"
            >
              Help
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Help Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowInstructions(true)}
          className="px-6 py-3 bg-unix-sub-alt text-unix-sub rounded-lg hover:bg-unix-sub transition-colors text-sm min-h-[44px] min-w-[44px]"
          aria-label="Show instructions and help"
        >
          ❓ Help
        </button>
      </div>

      {/* Test Configuration */}
      <div className="flex items-center justify-center gap-8 text-sm" role="group" aria-label="Test configuration">
        <div className="flex gap-2" role="radiogroup" aria-labelledby="mode-label">
          <span id="mode-label" className="sr-only">Test mode</span>
          <button
            onClick={() => {setMode("time"); resetTest();}}
            className={`px-6 py-3 rounded-lg min-h-[44px] min-w-[44px] ${mode === "time" ? "bg-unix-main text-unix-bg" : "bg-unix-sub-alt text-unix-sub"}`}
            role="radio"
            aria-checked={mode === "time"}
            aria-label="Time mode - type for a set duration"
          >
            time
          </button>
          <button
            onClick={() => {setMode("words"); resetTest();}}
            className={`px-6 py-3 rounded-lg min-h-[44px] min-w-[44px] ${mode === "words" ? "bg-unix-main text-unix-bg" : "bg-unix-sub-alt text-unix-sub"}`}
            role="radio"
            aria-checked={mode === "words"}
            aria-label="Words mode - type a set number of words"
          >
            words
          </button>
        </div>

        {mode === "time" ? (
          <div className="flex gap-2" role="radiogroup" aria-labelledby="time-label">
            <span id="time-label" className="sr-only">Time limit in seconds</span>
            {[15, 30, 60, 120].map((time) => (
              <button
                key={time}
                onClick={() => {setTimeLimit(time); resetTest();}}
                className={`px-6 py-3 rounded-lg min-h-[44px] min-w-[44px] ${timeLimit === time ? "bg-unix-main text-unix-bg" : "bg-unix-sub-alt text-unix-sub"}`}
                role="radio"
                aria-checked={timeLimit === time}
                aria-label={`${time} seconds`}
              >
                {time}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex gap-2" role="radiogroup" aria-labelledby="words-label">
            <span id="words-label" className="sr-only">Number of words</span>
            {[10, 25, 50, 100].map((count) => (
              <button
                key={count}
                onClick={() => {setWordCount(count); resetTest();}}
                className={`px-6 py-3 rounded-lg min-h-[44px] min-w-[44px] ${wordCount === count ? "bg-unix-main text-unix-bg" : "bg-unix-sub-alt text-unix-sub"}`}
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

      {/* Timer Display */}
      {mode === "time" && isActive && (
        <div className="text-center text-4xl font-bold text-unix-main" role="timer" aria-live="polite" aria-label={`${timeLeft} seconds remaining`}>
          {timeLeft}s
        </div>
      )}

      {/* Words Display */}
      <div className="relative">
        <div
          className="text-2xl leading-relaxed flex flex-wrap gap-2 p-8 bg-unix-sub-alt rounded-lg min-h-[200px]"
          role="application"
          aria-label="Typing test words"
          aria-live="polite"
          aria-atomic="false"
        >
          {words.slice(0, Math.min(currentWordIndex + 20, words.length)).map((word, wordIndex) => (
            <div
              key={wordIndex}
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
            className="absolute top-10 left-10 w-0.5 h-8 bg-unix-main animate-pulse"
            style={{
              transform: `translateX(${currentInput.length * 14}px)`
            }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        value={currentInput}
        onChange={handleInputChange}
        className="w-full p-4 text-xl bg-unix-sub-alt text-unix-text rounded-lg focus:outline-none focus:ring-2 focus:ring-unix-main"
        placeholder={isActive ? "Type the words above..." : "Click here to start typing..."}
        disabled={!isActive && currentWordIndex >= (mode === "words" ? wordCount : words.length)}
        aria-label="Type the words shown above"
        aria-describedby="typing-instructions"
      />
      <div id="typing-instructions" className="sr-only">
        Type the highlighted word exactly as shown. Press space after each word to move to the next one.
      </div>

      {/* Stats Display */}
      <div className="flex justify-center gap-8 text-sm text-unix-sub" role="status" aria-live="polite" aria-atomic="true">
        <div aria-label={`Progress: ${currentWordIndex} of ${mode === "words" ? wordCount : "unlimited"} words`}>
          Words: {currentWordIndex}/{mode === "words" ? wordCount : "∞"}
        </div>
        <div aria-label={`${typedWords.length} words typed`}>
          Typed: {typedWords.length}
        </div>
        {isActive && startTime && (typedWords.length > 0 || currentInput.length > 0) && (
          <>
            <div aria-label={`Current speed: ${(() => {
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
              WPM: {(() => {
                const currentTypedWords = [...typedWords];
                if (currentInput.trim()) {
                  currentTypedWords.push(currentInput.trim());
                }
                const targetWords = words.slice(0, currentTypedWords.length);
                const chars = countChars(currentTypedWords, targetWords);
                const duration = (Date.now() - startTime) / 1000;
                const { wpm } = calculateWPM(chars, Math.max(duration, 0.01));
                return wpm;
              })()}
            </div>
            <div aria-label={`Current accuracy: ${(() => {
              const currentTypedWords = [...typedWords];
              if (currentInput.trim()) {
                currentTypedWords.push(currentInput.trim());
              }
              const targetWords = words.slice(0, currentTypedWords.length);
              const chars = countChars(currentTypedWords, targetWords);
              const accuracy = calculateAccuracy(chars);
              return Math.round(accuracy);
            })()} percent`}>
              Acc: {(() => {
                const currentTypedWords = [...typedWords];
                if (currentInput.trim()) {
                  currentTypedWords.push(currentInput.trim());
                }
                const targetWords = words.slice(0, currentTypedWords.length);
                const chars = countChars(currentTypedWords, targetWords);
                const accuracy = calculateAccuracy(chars);
                return Math.round(accuracy);
              })()}%
            </div>
          </>
        )}
      </div>

      {/* Restart Button */}
      <div className="flex justify-center">
        <button
          onClick={resetTest}
          className="px-8 py-4 bg-unix-sub-alt text-unix-main rounded-lg hover:bg-unix-main hover:text-unix-bg transition-colors font-semibold min-h-[48px] min-w-[120px]"
          aria-label="Restart the typing test"
        >
          restart
        </button>
      </div>
    </div>
  );
}

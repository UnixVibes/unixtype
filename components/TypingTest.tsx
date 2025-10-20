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
        const elapsed = (Date.now() - now) / 1000 / 60;
        if (elapsed > 0) {
          setWpmHistory(prev => {
            setCorrectChars(currentCorrect => {
              const currentWpm = Math.round((currentCorrect / 5) / elapsed);
              return currentCorrect;
            });
            return prev;
          });
        }
      }, 1000);
    }
  }, [isActive, mode, endTest]);

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

  const getCharClass = (wordIndex: number, charIndex: number) => {
    if (wordIndex !== currentWordIndex) return "";

    const char = currentInput[charIndex];
    const expectedChar = words[currentWordIndex][charIndex];

    if (!char) return "";
    if (char === expectedChar) return "text-unix-main";
    return "text-unix-error bg-unix-error-dark";
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Test Configuration */}
      <div className="flex items-center justify-center gap-8 text-sm">
        <div className="flex gap-2">
          <button
            onClick={() => {setMode("time"); resetTest();}}
            className={`px-4 py-2 rounded ${mode === "time" ? "bg-unix-main text-unix-bg" : "bg-unix-sub-alt text-unix-sub"}`}
          >
            time
          </button>
          <button
            onClick={() => {setMode("words"); resetTest();}}
            className={`px-4 py-2 rounded ${mode === "words" ? "bg-unix-main text-unix-bg" : "bg-unix-sub-alt text-unix-sub"}`}
          >
            words
          </button>
        </div>

        {mode === "time" ? (
          <div className="flex gap-2">
            {[15, 30, 60, 120].map((time) => (
              <button
                key={time}
                onClick={() => {setTimeLimit(time); resetTest();}}
                className={`px-4 py-2 rounded ${timeLimit === time ? "bg-unix-main text-unix-bg" : "bg-unix-sub-alt text-unix-sub"}`}
              >
                {time}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex gap-2">
            {[10, 25, 50, 100].map((count) => (
              <button
                key={count}
                onClick={() => {setWordCount(count); resetTest();}}
                className={`px-4 py-2 rounded ${wordCount === count ? "bg-unix-main text-unix-bg" : "bg-unix-sub-alt text-unix-sub"}`}
              >
                {count}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Timer Display */}
      {mode === "time" && isActive && (
        <div className="text-center text-4xl font-bold text-unix-main">
          {timeLeft}s
        </div>
      )}

      {/* Words Display */}
      <div className="relative">
        <div className="text-2xl leading-relaxed flex flex-wrap gap-2 p-8 bg-unix-sub-alt rounded-lg min-h-[200px]">
          {words.slice(0, Math.min(currentWordIndex + 20, words.length)).map((word, wordIndex) => (
            <div key={wordIndex} className={`${getWordClass(wordIndex)} transition-colors`}>
              {wordIndex === currentWordIndex
                ? word.split("").map((char, charIndex) => (
                    <span key={charIndex} className={getCharClass(wordIndex, charIndex)}>
                      {char}
                    </span>
                  ))
                : word}
            </div>
          ))}
        </div>

        {/* Caret */}
        {isActive && (
          <div className="absolute top-10 left-10 w-0.5 h-8 bg-unix-main animate-pulse"
               style={{
                 transform: `translateX(${currentInput.length * 14}px)`
               }}
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
      />

      {/* Stats Display */}
      <div className="flex justify-center gap-8 text-sm text-unix-sub">
        <div>Words: {currentWordIndex}/{mode === "words" ? wordCount : "∞"}</div>
        <div>Typed: {typedWords.length}</div>
        {isActive && startTime && typedWords.length > 0 && (
          <div>
            WPM: {(() => {
              const targetWords = words.slice(0, typedWords.length);
              const chars = countChars(typedWords, targetWords);
              const duration = (Date.now() - startTime) / 1000;
              const { wpm } = calculateWPM(chars, Math.max(duration, 0.01));
              return wpm;
            })()}
          </div>
        )}
      </div>

      {/* Restart Button */}
      <div className="flex justify-center">
        <button
          onClick={resetTest}
          className="px-6 py-2 bg-unix-sub-alt text-unix-main rounded hover:bg-unix-main hover:text-unix-bg transition-colors"
        >
          restart
        </button>
      </div>
    </div>
  );
}

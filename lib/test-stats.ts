// Test statistics calculations based on Monkeytype logic

interface CharCount {
  correctWordChars: number;
  allCorrectChars: number;
  incorrectChars: number;
  extraChars: number;
  missedChars: number;
  spaces: number;
  correctSpaces: number;
}

export function countChars(
  typedWords: string[],
  targetWords: string[]
): CharCount {
  let correctWordChars = 0;
  let correctChars = 0;
  let incorrectChars = 0;
  let extraChars = 0;
  let missedChars = 0;
  let spaces = 0;
  let correctSpaces = 0;

  for (let i = 0; i < typedWords.length; i++) {
    const inputWord = typedWords[i] || "";
    const targetWord = targetWords[i] || "";

    if (inputWord === targetWord) {
      // The word is correct
      correctWordChars += targetWord.length;
      correctChars += targetWord.length;
      if (i < typedWords.length - 1) {
        correctSpaces++;
      }
    } else if (inputWord.length >= targetWord.length) {
      // Too many chars
      for (let c = 0; c < inputWord.length; c++) {
        if (c < targetWord.length) {
          // On char that still has a word list pair
          if (inputWord[c] === targetWord[c]) {
            correctChars++;
          } else {
            incorrectChars++;
          }
        } else {
          // On char that is extra
          extraChars++;
        }
      }
    } else {
      // Not enough chars
      const toAdd = {
        correct: 0,
        incorrect: 0,
        missed: 0,
      };
      for (let c = 0; c < targetWord.length; c++) {
        if (c < inputWord.length) {
          // On char that still has a word list pair
          if (inputWord[c] === targetWord[c]) {
            toAdd.correct++;
          } else {
            toAdd.incorrect++;
          }
        } else {
          // On char that is missing
          toAdd.missed++;
        }
      }
      correctChars += toAdd.correct;
      incorrectChars += toAdd.incorrect;
      if (i === typedWords.length - 1) {
        // Last word - check if it was all correct
        if (toAdd.incorrect === 0) correctWordChars += toAdd.correct;
      } else {
        missedChars += toAdd.missed;
      }
    }
    if (i < typedWords.length - 1) {
      spaces++;
    }
  }

  return {
    correctWordChars,
    allCorrectChars: correctChars,
    incorrectChars,
    extraChars,
    missedChars,
    spaces,
    correctSpaces,
  };
}

export function calculateWPM(
  chars: CharCount,
  testSeconds: number
): { wpm: number; raw: number } {
  const wpm = Math.round(
    ((chars.correctWordChars + chars.correctSpaces) * (60 / testSeconds)) / 5
  );

  const raw = Math.round(
    ((chars.allCorrectChars +
      chars.spaces +
      chars.incorrectChars +
      chars.extraChars) *
      (60 / testSeconds)) /
      5
  );

  return {
    wpm: Math.max(0, wpm),
    raw: Math.max(0, raw),
  };
}

export function calculateAccuracy(chars: CharCount): number {
  const correct = chars.allCorrectChars;
  const incorrect = chars.incorrectChars + chars.extraChars;
  const total = correct + incorrect;

  if (total === 0) return 0;

  const acc = (correct / total) * 100;
  return Math.round(Math.max(0, Math.min(100, acc)));
}

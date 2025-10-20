export interface TestResult {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  testDuration: number;
  mode: string;
  mode2: string;
  language: string;
}

export interface LeaderboardScore {
  id: string;
  name: string;
  wpm: number;
  accuracy: number;
  consistency: number;
  mode: string;
  mode2: string;
  language: string;
  timestamp: number;
  raw: number;
  testDuration: number;
}

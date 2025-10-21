'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { TestResult } from '@/types';
import { saveScore } from '@/lib/leaderboard';
import { getRank, getNextRank, getProgressToNextRank } from '@/lib/ranks';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import Leaderboard from './Leaderboard';
import { getQuoteForPerformance } from '@/lib/developer-quotes';
import { useGSAP } from '@gsap/react';
import * as gsapAnimations from '@/lib/gsap-animations';

interface ResultScreenProps {
  result: TestResult;
  onRestart: () => void;
  maxStreak: number;
}

export default function ResultScreen({ result, onRestart, maxStreak }: ResultScreenProps) {
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [nameInputValue, setNameInputValue] = useState('');
  const [savedEntryId, setSavedEntryId] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [fortuneQuote, setFortuneQuote] = useState('');

  // GSAP animation refs
  const rankBadgeRef = useRef<HTMLDivElement>(null);
  const statCardsRef = useRef<HTMLDivElement>(null);
  const fortuneCookieRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load saved name from localStorage
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('devtype_username') || '';
      setNameInputValue(savedName);
    }
    // Generate fortune cookie quote based on performance
    const quote = getQuoteForPerformance(result.wpm);
    setFortuneQuote(quote);
  }, [result.wpm]);

  // GSAP: Animate result screen entrance
  useEffect(() => {
    if (!showNameInput && rankBadgeRef.current && statCardsRef.current && fortuneCookieRef.current) {
      const statCards = Array.from(statCardsRef.current.children) as HTMLElement[];
      gsapAnimations.animateResultScreen(
        rankBadgeRef.current,
        statCards,
        fortuneCookieRef.current
      );
    }
  }, [showNameInput]);

  const handleNameSubmit = () => {
    const name = nameInputValue.trim() || 'Anonymous';
    setPlayerName(name);

    if (typeof window !== 'undefined') {
      localStorage.setItem('devtype_username', name);
    }

    const rank = getRank(result.wpm);

    // Save score to leaderboard
    const entry = saveScore({
      name,
      wpm: result.wpm,
      rawWpm: result.rawWpm,
      accuracy: result.accuracy,
      consistency: result.consistency,
      rank: rank.title,
      rankEmoji: rank.emoji,
      maxStreak,
    });

    setSavedEntryId(entry.id);
    setShowNameInput(false);
  };

  const handleSkipToResults = () => {
    const name = 'Guest';
    setPlayerName(name);

    const rank = getRank(result.wpm);

    // Save score to leaderboard even when skipping
    const entry = saveScore({
      name,
      wpm: result.wpm,
      rawWpm: result.rawWpm,
      accuracy: result.accuracy,
      consistency: result.consistency,
      rank: rank.title,
      rankEmoji: rank.emoji,
      maxStreak,
    });

    setSavedEntryId(entry.id);
    setShowNameInput(false);
  };

  // Show leaderboard view
  if (showLeaderboard) {
    return <Leaderboard onClose={() => setShowLeaderboard(false)} highlightId={savedEntryId || undefined} />;
  }

  // Show name input screen
  if (showNameInput) {
    return (
      <div className="w-full max-w-md mx-auto space-y-8 text-center">
        <div className="text-5xl font-bold bg-gradient-to-r from-unix-main to-unix-accent bg-clip-text text-transparent mb-8">
          Test Complete!
        </div>

        <div className="glass-effect rounded-2xl p-8 space-y-6 border border-unix-border/50">
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
              <div className="text-unix-sub text-sm">Max Streak</div>
              <div className="text-3xl font-bold text-unix-accent">{maxStreak}</div>
            </div>
            <div>
              <div className="text-unix-sub text-sm">Consistency</div>
              <div className="text-2xl font-bold text-unix-text">{Math.round(result.consistency)}%</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-unix-sub text-sm font-medium">
            Enter your name to save to leaderboard:
          </label>
          <input
            type="text"
            value={nameInputValue}
            onChange={(e) => setNameInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
            placeholder="Your name"
            className="w-full p-4 glass-effect text-unix-text rounded-xl focus:outline-none focus:ring-2 focus:ring-unix-main border border-unix-border/50 transition-all duration-200"
            autoFocus
          />
          <div className="flex gap-3">
            <button
              onClick={handleNameSubmit}
              className="flex-1 px-8 py-4 bg-unix-main text-white rounded-xl hover:bg-unix-main/80 transition-all duration-200 font-semibold text-lg shadow-lg"
            >
              Save & Continue
            </button>
            <button
              onClick={handleSkipToResults}
              className="flex-1 px-8 py-4 glass-effect text-unix-text rounded-xl hover:bg-unix-main/10 transition-all duration-200 font-semibold text-lg border border-unix-border"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    );
  }

  const rank = getRank(result.wpm);
  const nextRank = getNextRank(result.wpm);
  const progress = getProgressToNextRank(result.wpm);

  const downloadScoreCard = async () => {
    const scoreCard = document.getElementById('score-card');
    if (!scoreCard) return;

    try {
      const canvas = await html2canvas(scoreCard, {
        backgroundColor: '#0a0e1a',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `devtype-${rank.title.toLowerCase().replace(' ', '-')}-${Math.round(result.wpm)}wpm.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Failed to download score card:', error);
    }
  };

  // Generate a unique shareable URL with player's score data encoded
  const generateShareableUrl = () => {
    if (typeof window === 'undefined') return '';

    const scoreData = {
      name: playerName || 'Guest',
      wpm: Math.round(result.wpm),
      accuracy: Math.round(result.accuracy),
      streak: maxStreak,
      rank: rank.title,
      emoji: rank.emoji
    };

    try {
      // Encode the score data in the URL (using encodeURIComponent to handle Unicode)
      const jsonString = JSON.stringify(scoreData);
      const base64String = btoa(unescape(encodeURIComponent(jsonString)));

      const params = new URLSearchParams({
        score: base64String
      });

      const url = `${window.location.origin}?${params.toString()}`;
      console.log('✅ Generated shareable URL:', url);
      console.log('📊 Score data:', scoreData);
      return url;
    } catch (error) {
      console.error('❌ Failed to generate shareable URL:', error);
      return window.location.origin;
    }
  };

  const shareableUrl = generateShareableUrl();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Shareable Score Card */}
      <div id="score-card" className="max-w-2xl mx-auto">
        <div className="glass-effect rounded-3xl p-8 border-2 border-unix-main/30 shadow-lg relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(20, 184, 166, 0.1) 10px, rgba(20, 184, 166, 0.1) 20px)',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-6">
            {/* Header */}
            <div className="text-center border-b border-unix-border/30 pb-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-unix-main to-unix-accent rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">⚡</span>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-unix-main to-unix-accent bg-clip-text text-transparent">
                  DevType Challenge
                </h1>
              </div>
              <p className="text-unix-sub text-sm">
                Powered by <span className="text-unix-accent font-bold">Unixdev</span>
              </p>
            </div>

            {/* Rank Badge */}
            <div ref={rankBadgeRef} className="text-center py-4">
              <div className="text-8xl mb-3">{rank.emoji}</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-unix-main to-unix-accent bg-clip-text text-transparent mb-2">
                {rank.title}
              </div>
              <p className="text-lg text-unix-sub italic">&quot;{rank.message}&quot;</p>
              {playerName && playerName !== 'Guest' && (
                <p className="text-2xl text-unix-text font-bold mt-4">{playerName}</p>
              )}
            </div>

            {/* Stats Grid */}
            <div ref={statCardsRef} className="grid grid-cols-2 gap-4">
              <div className="glass-effect rounded-2xl p-6 text-center border border-unix-main/30">
                <div className="text-5xl font-bold text-unix-main mb-2">{Math.round(result.wpm)}</div>
                <div className="text-sm text-unix-sub font-medium">WPM</div>
              </div>
              <div className="glass-effect rounded-2xl p-6 text-center border border-unix-success/30">
                <div className="text-5xl font-bold text-unix-success mb-2">{Math.round(result.accuracy)}%</div>
                <div className="text-sm text-unix-sub font-medium">Accuracy</div>
              </div>
              <div className="glass-effect rounded-2xl p-6 text-center border border-unix-accent/30">
                <div className="text-3xl font-bold text-unix-accent mb-2">{maxStreak}</div>
                <div className="text-sm text-unix-sub font-medium">Max Streak</div>
              </div>
              <div className="glass-effect rounded-2xl p-6 text-center border border-unix-border/30">
                <div className="text-3xl font-bold text-unix-text mb-2">{Math.round(result.rawWpm)}</div>
                <div className="text-sm text-unix-sub font-medium">Raw WPM</div>
              </div>
            </div>

            {/* Progress Bar */}
            {nextRank && (
              <div className="bg-unix-bg/50 rounded-xl p-4 border border-unix-border/30">
                <div className="flex justify-between text-xs text-unix-sub mb-2">
                  <span>
                    Next: {nextRank.emoji} {nextRank.title}
                  </span>
                  <span>{nextRank.minWpm - Math.round(result.wpm)} WPM to go</span>
                </div>
                <div className="w-full bg-unix-sub-alt rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-unix-main to-unix-accent h-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Footer with QR Code */}
            <div className="text-center pt-4 border-t border-unix-border/30">
              <div className="flex items-center justify-between">
                <div className="flex-1 text-left">
                  <p className="text-unix-main font-bold text-lg mb-1">#DevTypeChallenge</p>
                  <p className="text-unix-sub text-sm mb-1">Can you beat this score?</p>
                  <p className="text-unix-accent text-xs font-semibold">by Unixdev</p>
                </div>

                {/* QR Code */}
                <div className="bg-white p-2 rounded-lg">
                  <QRCodeCanvas value={shareableUrl} size={80} level="M" />
                </div>
              </div>
              <p className="text-unix-sub text-xs mt-2">Scan to play • Visit our booth</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fortune Cookie Quote */}
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="relative">
          {/* Fortune Cookie Container */}
          <div ref={fortuneCookieRef} className="glass-effect rounded-2xl p-6 border border-unix-accent/30 bg-gradient-to-br from-unix-accent/5 to-unix-main/5">
            <div className="flex items-start gap-4">
              {/* Fortune Cookie Icon */}
              <motion.div
                className="text-5xl flex-shrink-0"
                animate={{
                  rotate: [0, -5, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🥠
              </motion.div>

              {/* Quote Content */}
              <div className="flex-1">
                <div className="text-unix-accent text-xs font-bold uppercase tracking-wider mb-2">
                  Developer Fortune Cookie
                </div>
                <motion.p
                  className="text-unix-text text-lg font-medium leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  &ldquo;{fortuneQuote}&rdquo;
                </motion.p>
              </div>
            </div>

            {/* Decorative sparkles */}
            <div className="absolute -top-2 -right-2 text-unix-accent text-2xl opacity-60">✨</div>
            <div className="absolute -bottom-2 -left-2 text-unix-main text-xl opacity-40">✨</div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={downloadScoreCard}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-unix-main to-unix-accent text-white rounded-xl hover:shadow-lg transition-all duration-200 font-bold text-lg"
        >
          📥 Download Score Card
        </button>
        <button
          onClick={() => setShowLeaderboard(true)}
          className="inline-flex items-center gap-2 px-8 py-4 bg-unix-accent text-white rounded-xl hover:shadow-lg transition-all duration-200 font-bold text-lg"
        >
          🏆 View Leaderboard
        </button>
        <button
          onClick={() => {
            const shareText = `🎮 DevType Challenge Results!\n\n${rank.emoji} ${rank.title}\n⚡ ${Math.round(result.wpm)} WPM\n🎯 ${Math.round(result.accuracy)}% Accuracy\n🔥 ${maxStreak} Max Streak\n\nCan you beat my score? #DevTypeChallenge`;
            if (navigator.share) {
              navigator.share({
                title: 'DevType Challenge',
                text: shareText,
                url: shareableUrl,
              }).catch(() => {});
            } else {
              navigator.clipboard.writeText(`${shareText}\n\n${shareableUrl}`);
              alert('Score copied to clipboard! Share it with your friends! 🎉');
            }
          }}
          className="inline-flex items-center gap-2 px-8 py-4 bg-unix-success text-white rounded-xl hover:shadow-lg transition-all duration-200 font-bold text-lg"
        >
          📱 Share Score
        </button>
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 px-8 py-4 bg-unix-main text-white rounded-xl hover:bg-unix-main/80 transition-all duration-200 font-semibold text-lg shadow-lg"
        >
          🔄 Play Again
        </button>
      </div>
    </div>
  );
}

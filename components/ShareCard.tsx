"use client";

import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Share2, Copy, Check, Download } from "lucide-react";
import { useState, useRef } from "react";
import { TestResult } from "@/types";
import { getRank } from "@/lib/ranks";
import html2canvas from "html2canvas";

interface ShareCardProps {
  result: TestResult;
  playerName?: string;
}

export default function ShareCard({ result, playerName = "Anonymous" }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const rank = getRank(result.wpm);
  const shareUrl = typeof window !== "undefined" ? generateShareUrl(result, playerName, rank) : "";
  const shareText = `I just scored ${result.wpm} WPM with ${result.accuracy}% accuracy on #UnixTypeChallenge! 🚀\n\nCan you beat my score?`;

  function generateShareUrl(result: TestResult, name: string, rank: { title: string; emoji: string }) {
    const baseUrl = window.location.origin;
    const scoreData = {
      name,
      wpm: result.wpm,
      accuracy: result.accuracy,
      streak: result.maxStreak || 0,
      rank: rank.title,
      emoji: rank.emoji,
    };

    // Encode the score data as base64
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(scoreData))));
    return `${baseUrl}?score=${encoded}`;
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "width=550,height=420");
  };

  const shareToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, "_blank", "width=550,height=420");
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;

    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0a0f1e",
        scale: 2,
      });

      const link = document.createElement("a");
      link.download = `devtype-score-${result.wpm}wpm.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error("Failed to download:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Share Card for Download */}
      <motion.div
        ref={cardRef}
        className="glass-effect rounded-3xl p-8 border-2 border-unix-main/40 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-unix-main/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-unix-purple/10 rounded-full blur-3xl -z-10"></div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">{rank.emoji}</div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-unix-main via-unix-purple to-unix-accent bg-clip-text text-transparent mb-2">
            {rank.title}
          </h3>
          <p className="text-xl text-unix-text font-bold mb-1">{playerName}</p>
          <p className="text-sm text-unix-sub">#UnixTypeChallenge</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass-effect rounded-xl p-4 text-center border border-unix-main/30">
            <div className="text-4xl font-bold text-unix-main mb-1">{result.wpm}</div>
            <div className="text-xs text-unix-sub font-medium">WPM</div>
          </div>
          <div className="glass-effect rounded-xl p-4 text-center border border-unix-success/30">
            <div className="text-4xl font-bold text-unix-success mb-1">{result.accuracy}%</div>
            <div className="text-xs text-unix-sub font-medium">Accuracy</div>
          </div>
        </div>

        {/* Streak */}
        {(result.maxStreak ?? 0) > 0 && (
          <div className="glass-effect rounded-xl p-4 text-center border border-unix-accent/30 mb-6">
            <div className="text-2xl font-bold text-unix-accent">🔥 {result.maxStreak} Streak</div>
          </div>
        )}

        {/* QR Code Section */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="glass-effect rounded-2xl p-4 border-2 border-unix-main/40 bg-white">
            <QRCodeSVG
              value={shareUrl}
              size={140}
              level="H"
              includeMargin={true}
              fgColor="#0f172a"
              bgColor="#ffffff"
            />
          </div>
          <div className="flex-1 text-left">
            <p className="text-unix-main font-bold text-sm mb-2">Scan to Challenge!</p>
            <p className="text-unix-sub text-xs leading-relaxed">
              Share this QR code with friends or scan it to view this score and take the challenge yourself!
            </p>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="border-t border-unix-border/30 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-unix-main via-unix-purple to-unix-accent rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">U</span>
            </div>
            <div>
              <p className="text-unix-main font-bold text-sm">Unixdev</p>
              <p className="text-unix-sub text-xs">UnixType Challenge</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-unix-accent text-xs font-semibold">Tech Summit 2025</p>
            <p className="text-unix-sub text-xs">Visit our booth!</p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        {/* Copy Link Button */}
        <motion.button
          onClick={copyToClipboard}
          className="glass-effect rounded-xl p-4 border border-unix-main/30 hover:border-unix-main/60 transition-all duration-200 flex items-center justify-center gap-3 group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {copied ? (
            <Check className="w-5 h-5 text-unix-success" />
          ) : (
            <Copy className="w-5 h-5 text-unix-main group-hover:text-unix-accent transition-colors" />
          )}
          <span className="font-semibold text-unix-text">
            {copied ? "Copied!" : "Copy Link"}
          </span>
        </motion.button>

        {/* Download Card Button */}
        <motion.button
          onClick={downloadCard}
          disabled={downloading}
          className="glass-effect rounded-xl p-4 border border-unix-purple/30 hover:border-unix-purple/60 transition-all duration-200 flex items-center justify-center gap-3 group disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="w-5 h-5 text-unix-purple group-hover:text-unix-accent transition-colors" />
          <span className="font-semibold text-unix-text">
            {downloading ? "Saving..." : "Download"}
          </span>
        </motion.button>
      </div>

      {/* Social Share Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          onClick={shareToTwitter}
          className="glass-effect rounded-xl p-4 border border-[#1DA1F2]/30 hover:border-[#1DA1F2]/60 transition-all duration-200 flex items-center justify-center gap-3 group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg className="w-5 h-5 fill-[#1DA1F2]" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="font-semibold text-unix-text">Share on X</span>
        </motion.button>

        <motion.button
          onClick={shareToLinkedIn}
          className="glass-effect rounded-xl p-4 border border-[#0A66C2]/30 hover:border-[#0A66C2]/60 transition-all duration-200 flex items-center justify-center gap-3 group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg className="w-5 h-5 fill-[#0A66C2]" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          <span className="font-semibold text-unix-text">Share on LinkedIn</span>
        </motion.button>
      </div>

      {/* Share URL Display */}
      <motion.div
        className="glass-effect rounded-xl p-4 border border-unix-border/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs text-unix-sub mb-2 font-medium">Your Share URL:</p>
        <code className="text-xs text-unix-main break-all font-mono bg-unix-bg/50 p-2 rounded block">
          {shareUrl}
        </code>
      </motion.div>
    </div>
  );
}

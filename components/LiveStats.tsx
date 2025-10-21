"use client";

import { motion } from "framer-motion";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Target, Zap, Activity } from "lucide-react";

interface LiveStatsProps {
  wpmHistory: number[];
  currentWPM: number;
  accuracy: number;
  keystrokeData?: Record<string, number>;
  isActive?: boolean;
}

export default function LiveStats({ wpmHistory, currentWPM, accuracy, keystrokeData = {}, isActive = false }: LiveStatsProps) {
  // Prepare chart data
  const wpmChartData = wpmHistory.map((wpm, index) => ({
    time: index + 1,
    wpm: Math.round(wpm),
  }));

  // Prepare keystroke heatmap data (top keys)
  const keystrokeArray = Object.entries(keystrokeData)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const avgWPM = wpmHistory.length > 0
    ? Math.round(wpmHistory.reduce((a, b) => a + b, 0) / wpmHistory.length)
    : 0;

  const maxWPM = wpmHistory.length > 0
    ? Math.round(Math.max(...wpmHistory))
    : 0;

  const minWPM = wpmHistory.length > 0
    ? Math.round(Math.min(...wpmHistory))
    : 0;

  // Calculate consistency (lower variance = better)
  const consistency = wpmHistory.length > 1
    ? Math.round((1 - (Math.sqrt(wpmHistory.reduce((sum, wpm) => sum + Math.pow(wpm - avgWPM, 2), 0) / wpmHistory.length) / avgWPM)) * 100)
    : 100;

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-effect rounded-lg p-3 border border-unix-main/30">
          <p className="text-unix-text text-sm font-semibold">
            {payload[0].value} WPM
          </p>
          <p className="text-unix-sub text-xs">Second {payload[0].payload.time}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Live Performance Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div
          className="glass-effect rounded-xl p-4 border border-unix-main/30 relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-unix-main/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-unix-main" />
              <span className="text-unix-sub text-xs font-medium">Current WPM</span>
            </div>
            <div className="text-3xl font-bold text-unix-main">{Math.round(currentWPM)}</div>
            {isActive && (
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-unix-success rounded-full animate-pulse"></div>
                <span className="text-xs text-unix-success">Live</span>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="glass-effect rounded-xl p-4 border border-unix-accent/30 relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-unix-accent/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-unix-accent" />
              <span className="text-unix-sub text-xs font-medium">Average</span>
            </div>
            <div className="text-3xl font-bold text-unix-accent">{avgWPM}</div>
            <div className="text-xs text-unix-sub mt-1">WPM</div>
          </div>
        </motion.div>

        <motion.div
          className="glass-effect rounded-xl p-4 border border-unix-success/30 relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-unix-success/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-unix-success" />
              <span className="text-unix-sub text-xs font-medium">Peak Speed</span>
            </div>
            <div className="text-3xl font-bold text-unix-success">{maxWPM}</div>
            <div className="text-xs text-unix-sub mt-1">WPM</div>
          </div>
        </motion.div>

        <motion.div
          className="glass-effect rounded-xl p-4 border border-unix-purple/30 relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-unix-purple/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-unix-purple" />
              <span className="text-unix-sub text-xs font-medium">Consistency</span>
            </div>
            <div className="text-3xl font-bold text-unix-purple">{consistency}%</div>
            <div className="text-xs text-unix-sub mt-1">
              {consistency >= 80 ? "Excellent" : consistency >= 60 ? "Good" : "Variable"}
            </div>
          </div>
        </motion.div>
      </div>

      {/* WPM Over Time Chart */}
      {wpmChartData.length > 0 && (
        <motion.div
          className="glass-effect rounded-2xl p-6 border border-unix-main/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-unix-text mb-1">Speed Over Time</h3>
              <p className="text-sm text-unix-sub">Words per minute throughout the test</p>
            </div>
            {isActive && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-unix-success/20 rounded-lg border border-unix-success/30">
                <div className="w-2 h-2 bg-unix-success rounded-full animate-pulse"></div>
                <span className="text-xs text-unix-success font-semibold">Recording</span>
              </div>
            )}
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={wpmChartData}>
              <defs>
                <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" opacity={0.3} />
              <XAxis
                dataKey="time"
                stroke="#94a3b8"
                fontSize={12}
                label={{ value: 'Seconds', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                label={{ value: 'WPM', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="wpm"
                stroke="#14b8a6"
                strokeWidth={3}
                fill="url(#wpmGradient)"
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Stats summary below chart */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-unix-border/30">
            <div className="text-center">
              <div className="text-xs text-unix-sub mb-1">Lowest</div>
              <div className="text-lg font-bold text-unix-text">{minWPM} WPM</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-unix-sub mb-1">Average</div>
              <div className="text-lg font-bold text-unix-main">{avgWPM} WPM</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-unix-sub mb-1">Highest</div>
              <div className="text-lg font-bold text-unix-success">{maxWPM} WPM</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Keystroke Heatmap */}
      {keystrokeArray.length > 0 && (
        <motion.div
          className="glass-effect rounded-2xl p-6 border border-unix-accent/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4">
            <h3 className="text-xl font-bold text-unix-text mb-1">Most Typed Keys</h3>
            <p className="text-sm text-unix-sub">Your keystroke distribution</p>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={keystrokeArray} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" opacity={0.3} />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} />
              <YAxis
                dataKey="key"
                type="category"
                stroke="#94a3b8"
                fontSize={12}
                width={40}
              />
              <Tooltip
                cursor={{ fill: 'rgba(20, 184, 166, 0.1)' }}
                content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="glass-effect rounded-lg p-3 border border-unix-accent/30">
                        <p className="text-unix-text text-sm font-semibold">
                          Key: {payload[0].payload.key}
                        </p>
                        <p className="text-unix-sub text-xs">{payload[0].value} times</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="count"
                fill="#8b5cf6"
                radius={[0, 8, 8, 0]}
                animationDuration={500}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Performance Insights */}
      <motion.div
        className="glass-effect rounded-2xl p-6 border border-unix-border/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-bold text-unix-text mb-4">Performance Insights</h3>
        <div className="space-y-3">
          {avgWPM >= 80 && (
            <div className="flex items-start gap-3 p-3 bg-unix-success/10 rounded-lg border border-unix-success/30">
              <span className="text-2xl">🚀</span>
              <div>
                <div className="font-semibold text-unix-success text-sm">Excellent Speed!</div>
                <div className="text-xs text-unix-text/80">You're typing faster than 85% of users</div>
              </div>
            </div>
          )}

          {consistency >= 80 && (
            <div className="flex items-start gap-3 p-3 bg-unix-purple/10 rounded-lg border border-unix-purple/30">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="font-semibold text-unix-purple text-sm">Very Consistent!</div>
                <div className="text-xs text-unix-text/80">Your typing rhythm is steady and reliable</div>
              </div>
            </div>
          )}

          {accuracy >= 95 && (
            <div className="flex items-start gap-3 p-3 bg-unix-main/10 rounded-lg border border-unix-main/30">
              <span className="text-2xl">✨</span>
              <div>
                <div className="font-semibold text-unix-main text-sm">High Accuracy!</div>
                <div className="text-xs text-unix-text/80">You make very few mistakes while typing</div>
              </div>
            </div>
          )}

          {maxWPM - minWPM > 30 && consistency < 60 && (
            <div className="flex items-start gap-3 p-3 bg-unix-accent/10 rounded-lg border border-unix-accent/30">
              <span className="text-2xl">💡</span>
              <div>
                <div className="font-semibold text-unix-accent text-sm">Tip: Maintain Rhythm</div>
                <div className="text-xs text-unix-text/80">Your speed varies a lot. Try maintaining a steady pace</div>
              </div>
            </div>
          )}

          {wpmChartData.length >= 5 && (
            <div className="flex items-start gap-3 p-3 bg-unix-bg/50 rounded-lg border border-unix-border/30">
              <span className="text-2xl">📊</span>
              <div>
                <div className="font-semibold text-unix-text text-sm">
                  {wpmChartData[wpmChartData.length - 1].wpm > wpmChartData[0].wpm
                    ? "Strong Finish!"
                    : "Started Strong!"}
                </div>
                <div className="text-xs text-unix-text/80">
                  {wpmChartData[wpmChartData.length - 1].wpm > wpmChartData[0].wpm
                    ? "You improved as the test went on"
                    : "You had great speed at the beginning"}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

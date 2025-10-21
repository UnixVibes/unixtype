"use client";

import { motion } from "framer-motion";
import { Zap, ArrowLeft, Code2, Rocket, Users, Target, Heart } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
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
                Our Story
              </div>
              <div className="text-unix-sub text-xs font-medium flex items-center gap-2">
                <span className="text-unix-purple">⚡</span>
                <span>About Unixdev</span>
              </div>
            </div>
          </motion.div>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="px-4 py-2 text-unix-sub hover:text-unix-main transition-all duration-200 font-medium flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              Back to Game
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 py-12 px-4 relative z-10">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Hero Section */}
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl font-bold bg-gradient-to-r from-unix-main via-unix-purple to-unix-accent bg-clip-text text-transparent">
              Unixdev
            </h1>
            <p className="text-2xl text-unix-sub font-medium">
              Building the Future of Digital Innovation
            </p>
            <div className="flex items-center justify-center gap-3 pt-4">
              <a
                href="https://www.unixdev.co.th/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-unix-main to-unix-accent text-white rounded-xl hover:shadow-lg transition-all duration-200 font-bold flex items-center gap-2 group"
              >
                Visit Our Website
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </a>
            </div>
          </motion.div>

          {/* About Section */}
          <motion.div
            className="glass-effect rounded-3xl p-8 border border-unix-border-light shadow-lg space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-unix-main/20 rounded-lg flex items-center justify-center border border-unix-main/30">
                <Code2 className="w-5 h-5 text-unix-main" strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-bold text-unix-text">Who We Are</h2>
            </div>
            <p className="text-unix-sub text-lg leading-relaxed">
              Unixdev is a leading software development company specializing in creating innovative digital solutions
              for businesses of all sizes. We combine cutting-edge technology with creative thinking to deliver
              exceptional products that drive real results.
            </p>
            <p className="text-unix-sub text-lg leading-relaxed">
              Our team of passionate developers, designers, and strategists work together to transform ideas into
              powerful digital experiences. From web applications to mobile apps, from custom software to enterprise
              solutions, we build technology that matters.
            </p>
          </motion.div>

          {/* What We Do */}
          <motion.div
            className="glass-effect rounded-3xl p-8 border border-unix-border-light shadow-lg space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-unix-purple/20 rounded-lg flex items-center justify-center border border-unix-purple/30">
                <Rocket className="w-5 h-5 text-unix-purple" strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-bold text-unix-text">What We Do</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass-effect rounded-2xl p-6 border border-unix-main/20">
                <div className="text-4xl mb-3">💻</div>
                <h3 className="text-xl font-bold text-unix-text mb-2">Custom Software Development</h3>
                <p className="text-unix-sub">
                  Tailored solutions designed to meet your unique business needs and challenges.
                </p>
              </div>
              <div className="glass-effect rounded-2xl p-6 border border-unix-main/20">
                <div className="text-4xl mb-3">📱</div>
                <h3 className="text-xl font-bold text-unix-text mb-2">Mobile App Development</h3>
                <p className="text-unix-sub">
                  Native and cross-platform mobile applications that users love.
                </p>
              </div>
              <div className="glass-effect rounded-2xl p-6 border border-unix-main/20">
                <div className="text-4xl mb-3">🌐</div>
                <h3 className="text-xl font-bold text-unix-text mb-2">Web Applications</h3>
                <p className="text-unix-sub">
                  Modern, scalable web applications built with the latest technologies.
                </p>
              </div>
              <div className="glass-effect rounded-2xl p-6 border border-unix-main/20">
                <div className="text-4xl mb-3">☁️</div>
                <h3 className="text-xl font-bold text-unix-text mb-2">Cloud Solutions</h3>
                <p className="text-unix-sub">
                  Reliable cloud infrastructure and services for modern businesses.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Our Values */}
          <motion.div
            className="glass-effect rounded-3xl p-8 border border-unix-border-light shadow-lg space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-unix-accent/20 rounded-lg flex items-center justify-center border border-unix-accent/30">
                <Heart className="w-5 h-5 text-unix-accent" strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-bold text-unix-text">Our Values</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-6">
                <div className="text-5xl mb-3">⚡</div>
                <h3 className="text-xl font-bold text-unix-main mb-2">Innovation</h3>
                <p className="text-unix-sub text-sm">
                  We stay ahead of technology trends to deliver cutting-edge solutions.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-5xl mb-3">🎯</div>
                <h3 className="text-xl font-bold text-unix-purple mb-2">Excellence</h3>
                <p className="text-unix-sub text-sm">
                  Quality is at the heart of everything we create.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-5xl mb-3">🤝</div>
                <h3 className="text-xl font-bold text-unix-accent mb-2">Partnership</h3>
                <p className="text-unix-sub text-sm">
                  We build long-term relationships with our clients.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Mission & Vision */}
          <motion.div
            className="grid md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="glass-effect rounded-3xl p-8 border border-unix-border-light shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-unix-success/20 rounded-lg flex items-center justify-center border border-unix-success/30">
                  <Target className="w-5 h-5 text-unix-success" strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-bold text-unix-text">Our Mission</h2>
              </div>
              <p className="text-unix-sub leading-relaxed">
                To empower businesses through innovative technology solutions that drive growth,
                efficiency, and digital transformation. We're committed to delivering excellence
                in every project we undertake.
              </p>
            </div>
            <div className="glass-effect rounded-3xl p-8 border border-unix-border-light shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-unix-accent/20 rounded-lg flex items-center justify-center border border-unix-accent/30">
                  <Users className="w-5 h-5 text-unix-accent" strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-bold text-unix-text">Our Vision</h2>
              </div>
              <p className="text-unix-sub leading-relaxed">
                To be the leading technology partner for businesses seeking digital transformation.
                We envision a future where technology seamlessly integrates with business goals to
                create meaningful impact.
              </p>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="glass-effect rounded-3xl p-12 border-2 border-unix-main/30 shadow-lg text-center space-y-6 bg-gradient-to-br from-unix-main/5 to-unix-accent/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-unix-main to-unix-accent bg-clip-text text-transparent">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-unix-sub text-lg max-w-2xl mx-auto">
              Whether you have a project in mind or just want to explore possibilities,
              we're here to help turn your vision into reality.
            </p>
            <a
              href="https://www.unixdev.co.th/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-unix-main to-unix-accent text-white rounded-xl hover:shadow-xl transition-all duration-300 font-bold text-lg group"
            >
              <span>Get in Touch</span>
              <motion.span
                className="inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Footer - Terminal Style */}
      <footer className="w-full py-6 px-8 border-t border-unix-border-light backdrop-blur-sm bg-unix-bg/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-unix-purple opacity-60">$</span>
                <a
                  href="https://www.unixdev.co.th/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-unix-main font-bold text-lg neon-accent hover:text-unix-accent transition-colors duration-200"
                >
                  Unixdev
                </a>
              </div>
              <span className="text-unix-border-light">|</span>
              <span className="text-unix-sub">⚡ Building tools for developers who type fast and think faster</span>
            </div>
            <div className="flex items-center gap-6 text-unix-sub font-semibold">
              <a
                href="https://www.unixdev.co.th/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-unix-main hover:text-unix-accent transition-colors duration-200 flex items-center gap-2"
              >
                <span className="inline-block w-2 h-2 bg-unix-success rounded-full animate-pulse"></span>
                Visit Website
              </a>
              <span className="text-unix-purple-light">#UnixTypeChallenge</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

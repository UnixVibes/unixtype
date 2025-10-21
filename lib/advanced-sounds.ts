// Advanced Sound Effects using Web Audio API
// Professional-grade sounds for an immersive typing experience!

class AdvancedSoundEffects {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private masterGain: GainNode | null = null;
  private bgMusicGain: GainNode | null = null;
  private bgMusicOscillators: OscillatorNode[] = [];
  private isBossMusicPlaying = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Create master gain for volume control
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.7; // Master volume at 70%

      // Create separate gain for background music
      this.bgMusicGain = this.audioContext.createGain();
      this.bgMusicGain.connect(this.masterGain);
      this.bgMusicGain.gain.value = 0.3; // BG music quieter

      // Load sound preference
      const savedPreference = localStorage.getItem('unixtype_sound_enabled');
      this.enabled = savedPreference !== 'false';
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('unixtype_sound_enabled', enabled.toString());
    }
    if (!enabled) {
      this.stopBossBattleMusic();
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  // ============================================
  // MECHANICAL KEYBOARD SOUNDS
  // ============================================

  // Cherry MX Blue style - clicky and satisfying
  playMechanicalKeyClick() {
    if (!this.enabled || !this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;

    // Click sound - sharp attack
    const clickOsc = this.audioContext.createOscillator();
    const clickGain = this.audioContext.createGain();
    const clickFilter = this.audioContext.createBiquadFilter();

    clickOsc.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(this.masterGain);

    clickOsc.type = 'square';
    clickOsc.frequency.value = 2000;

    clickFilter.type = 'bandpass';
    clickFilter.frequency.value = 1800;
    clickFilter.Q.value = 10;

    // Sharp attack, quick decay
    clickGain.gain.setValueAtTime(0.08, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    clickOsc.start(now);
    clickOsc.stop(now + 0.015);

    // Thock sound - deeper resonance
    const thockOsc = this.audioContext.createOscillator();
    const thockGain = this.audioContext.createGain();

    thockOsc.connect(thockGain);
    thockGain.connect(this.masterGain);

    thockOsc.type = 'sine';
    thockOsc.frequency.value = 150;

    thockGain.gain.setValueAtTime(0.04, now + 0.005);
    thockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    thockOsc.start(now + 0.005);
    thockOsc.stop(now + 0.04);
  }

  // Different sound for spacebar - deeper thunk
  playSpacebarThunk() {
    if (!this.enabled || !this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;

    const thunkOsc = this.audioContext.createOscillator();
    const thunkGain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    thunkOsc.connect(filter);
    filter.connect(thunkGain);
    thunkGain.connect(this.masterGain);

    thunkOsc.type = 'sine';
    thunkOsc.frequency.value = 100;

    filter.type = 'lowpass';
    filter.frequency.value = 300;

    thunkGain.gain.setValueAtTime(0.15, now);
    thunkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    thunkOsc.start(now);
    thunkOsc.stop(now + 0.08);
  }

  // ============================================
  // WORD COMPLETION SOUNDS
  // ============================================

  // Satisfying THUNK when completing a word
  playSatisfyingThunk() {
    if (!this.enabled || !this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;

    // Bass thump
    const bassOsc = this.audioContext.createOscillator();
    const bassGain = this.audioContext.createGain();

    bassOsc.connect(bassGain);
    bassGain.connect(this.masterGain);

    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(100, now);
    bassOsc.frequency.exponentialRampToValueAtTime(50, now + 0.1);

    bassGain.gain.setValueAtTime(0.2, now);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    bassOsc.start(now);
    bassOsc.stop(now + 0.15);

    // Mid-range click
    const midOsc = this.audioContext.createOscillator();
    const midGain = this.audioContext.createGain();

    midOsc.connect(midGain);
    midGain.connect(this.masterGain);

    midOsc.type = 'triangle';
    midOsc.frequency.value = 600;

    midGain.gain.setValueAtTime(0.1, now);
    midGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    midOsc.start(now);
    midOsc.stop(now + 0.08);

    // High sparkle
    const highOsc = this.audioContext.createOscillator();
    const highGain = this.audioContext.createGain();

    highOsc.connect(highGain);
    highGain.connect(this.masterGain);

    highOsc.type = 'sine';
    highOsc.frequency.value = 1200;

    highGain.gain.setValueAtTime(0.06, now + 0.02);
    highGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    highOsc.start(now + 0.02);
    highOsc.stop(now + 0.12);
  }

  // ============================================
  // CROWD CHEERING
  // ============================================

  // Crowd cheer for streak milestones
  playCrowdCheer(intensity: number = 1) {
    if (!this.enabled || !this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    const duration = 0.8 * intensity;

    // Create crowd noise using filtered white noise
    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 2;

    const gain = this.audioContext.createGain();

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    // Volume envelope for natural crowd swell
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15 * intensity, now + 0.1);
    gain.gain.linearRampToValueAtTime(0.2 * intensity, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.start(now);
    noise.stop(now + duration);

    // Add some "wooo" sounds
    this.playCrowdWoo(now, intensity);
  }

  private playCrowdWoo(startTime: number, intensity: number) {
    if (!this.audioContext || !this.masterGain) return;

    const wooOsc = this.audioContext.createOscillator();
    const wooGain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    wooOsc.connect(filter);
    filter.connect(wooGain);
    wooGain.connect(this.masterGain);

    wooOsc.type = 'sawtooth';
    wooOsc.frequency.setValueAtTime(300, startTime);
    wooOsc.frequency.exponentialRampToValueAtTime(600, startTime + 0.3);
    wooOsc.frequency.exponentialRampToValueAtTime(400, startTime + 0.6);

    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    filter.Q.value = 5;

    wooGain.gain.setValueAtTime(0, startTime + 0.1);
    wooGain.gain.linearRampToValueAtTime(0.08 * intensity, startTime + 0.2);
    wooGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.7);

    wooOsc.start(startTime + 0.1);
    wooOsc.stop(startTime + 0.7);
  }

  // ============================================
  // BOSS BATTLE MUSIC
  // ============================================

  // Epic background music that plays when typing fast
  startBossBattleMusic() {
    if (!this.enabled || !this.audioContext || !this.bgMusicGain || this.isBossMusicPlaying) return;

    this.isBossMusicPlaying = true;
    const now = this.audioContext.currentTime;

    // Bass line pattern (repeating every 2 seconds)
    const bassNotes = [
      { freq: 65.41, time: 0 },      // C2
      { freq: 65.41, time: 0.5 },    // C2
      { freq: 82.41, time: 1.0 },    // E2
      { freq: 73.42, time: 1.5 },    // D2
    ];

    // Chord progression
    const chordNotes = [
      { freqs: [261.63, 329.63, 392.00], time: 0 },    // C major
      { freqs: [220.00, 277.18, 329.63], time: 1.0 },  // A minor
    ];

    // Create looping bass line
    const playBassLoop = (startTime: number) => {
      bassNotes.forEach(note => {
        const osc = this.audioContext!.createOscillator();
        const gain = this.audioContext!.createGain();

        osc.connect(gain);
        gain.connect(this.bgMusicGain!);

        osc.type = 'sawtooth';
        osc.frequency.value = note.freq;

        const noteStart = startTime + note.time;
        gain.gain.setValueAtTime(0, noteStart);
        gain.gain.linearRampToValueAtTime(0.15, noteStart + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.4);

        osc.start(noteStart);
        osc.stop(noteStart + 0.4);

        this.bgMusicOscillators.push(osc);
      });
    };

    // Create chord pad
    const playChords = (startTime: number) => {
      chordNotes.forEach(chord => {
        chord.freqs.forEach(freq => {
          const osc = this.audioContext!.createOscillator();
          const gain = this.audioContext!.createGain();
          const filter = this.audioContext!.createBiquadFilter();

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.bgMusicGain!);

          osc.type = 'triangle';
          osc.frequency.value = freq;

          filter.type = 'lowpass';
          filter.frequency.value = 800;

          const chordStart = startTime + chord.time;
          gain.gain.setValueAtTime(0, chordStart);
          gain.gain.linearRampToValueAtTime(0.04, chordStart + 0.05);
          gain.gain.setValueAtTime(0.04, chordStart + 0.9);
          gain.gain.exponentialRampToValueAtTime(0.001, chordStart + 1.0);

          osc.start(chordStart);
          osc.stop(chordStart + 1.0);

          this.bgMusicOscillators.push(osc);
        });
      });
    };

    // Play 4 loops (8 seconds of music)
    for (let i = 0; i < 4; i++) {
      playBassLoop(now + i * 2);
      playChords(now + i * 2);
    }

    // Loop the music
    setTimeout(() => {
      if (this.isBossMusicPlaying) {
        this.startBossBattleMusic();
      }
    }, 7500); // Restart before it ends for seamless loop
  }

  stopBossBattleMusic() {
    this.isBossMusicPlaying = false;
    this.bgMusicOscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Oscillator already stopped
      }
    });
    this.bgMusicOscillators = [];
  }

  // ============================================
  // VICTORY FANFARE WITH CHOIR
  // ============================================

  playVictoryFanfareWithChoir() {
    if (!this.enabled || !this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;

    // Trumpet fanfare
    const fanfareNotes = [
      { freq: 523.25, time: 0, duration: 0.2 },      // C5
      { freq: 659.25, time: 0.2, duration: 0.2 },    // E5
      { freq: 783.99, time: 0.4, duration: 0.2 },    // G5
      { freq: 1046.50, time: 0.6, duration: 0.4 },   // C6
      { freq: 1318.51, time: 1.0, duration: 0.6 },   // E6
    ];

    fanfareNotes.forEach(note => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      const filter = this.audioContext!.createBiquadFilter();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.type = 'sawtooth';
      osc.frequency.value = note.freq;

      filter.type = 'lowpass';
      filter.frequency.value = 2000;
      filter.Q.value = 1;

      const startTime = now + note.time;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
      gain.gain.setValueAtTime(0.25, startTime + note.duration * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.duration);

      osc.start(startTime);
      osc.stop(startTime + note.duration);
    });

    // Choir "Ahhh" sound (using multiple oscillators for harmonics)
    const choirStart = now + 0.3;
    const choirDuration = 1.5;
    const fundamentalFreqs = [262, 330, 392, 494]; // C4, E4, G4, B4 - major 7th chord

    fundamentalFreqs.forEach(fundamental => {
      // Create rich harmonic content for choir-like sound
      [1, 2, 3, 4, 5].forEach(harmonic => {
        const osc = this.audioContext!.createOscillator();
        const gain = this.audioContext!.createGain();
        const filter = this.audioContext!.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.type = 'sine';
        osc.frequency.value = fundamental * harmonic;

        filter.type = 'bandpass';
        filter.frequency.value = fundamental * harmonic;
        filter.Q.value = 10;

        // Harmonics get quieter
        const harmonicVolume = 0.08 / harmonic;

        gain.gain.setValueAtTime(0, choirStart);
        gain.gain.linearRampToValueAtTime(harmonicVolume, choirStart + 0.3);
        gain.gain.setValueAtTime(harmonicVolume, choirStart + 1.0);
        gain.gain.exponentialRampToValueAtTime(0.001, choirStart + choirDuration);

        osc.start(choirStart);
        osc.stop(choirStart + choirDuration);
      });
    });

    // Timpani drum roll finale
    const timStart = now + 1.3;
    this.playTimpaniHit(timStart);
    this.playTimpaniHit(timStart + 0.15);
    this.playTimpaniHit(timStart + 0.3);
  }

  private playTimpaniHit(startTime: number) {
    if (!this.audioContext || !this.masterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, startTime);
    osc.frequency.exponentialRampToValueAtTime(50, startTime + 0.3);

    filter.type = 'lowpass';
    filter.frequency.value = 200;

    gain.gain.setValueAtTime(0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

    osc.start(startTime);
    osc.stop(startTime + 0.4);
  }

  // ============================================
  // ERROR SOUNDS
  // ============================================

  playErrorBuzz() {
    if (!this.enabled || !this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(120, now + 0.15);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // ============================================
  // COMBO & STREAK SOUNDS
  // ============================================

  playComboMultiplier(level: number) {
    if (!this.enabled || !this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    const baseFreq = 400 + (level * 200); // Higher pitch for higher combos

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 2, now + 0.15);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  playStreakPowerUp(streakLevel: number) {
    if (!this.enabled || !this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;

    // Ascending arpeggio
    const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C

    notes.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.type = 'sine';
      osc.frequency.value = freq;

      const noteTime = now + (i * 0.05);
      gain.gain.setValueAtTime(0.12, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.2);

      osc.start(noteTime);
      osc.stop(noteTime + 0.2);
    });

    // Add crowd cheer for higher streaks
    if (streakLevel >= 20) {
      this.playCrowdCheer(streakLevel / 20);
    }
  }
}

// Export singleton instance
export const advancedSounds = new AdvancedSoundEffects();

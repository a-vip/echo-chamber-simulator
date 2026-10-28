/**
 * The Echo Chamber Simulator - Procedural Audio Synthesizer & BGM Radio
 * Built entirely on the Web Audio API with zero external audio assets.
 * Generates authentic 8-bit/chiptune SFX and interactive Lo-Fi / Overclock procedural music!
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.masterGain = null;
    this.serverHumOsc = null;
    this.serverHumGain = null;
    this.initialized = false;

    // Radio BGM state
    this.currentStation = 'off'; // 'chill', 'rage', 'off'
    this.bgmGain = null;
    this.bgmStep = 0;
    this.bgmTimer = null;
    this.bpm = 88;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      // Start continuous ambient server hum
      this.startAmbientHum();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio not supported or blocked:', e);
    }
  }

  startAmbientHum() {
    if (!this.ctx || this.serverHumOsc) return;
    try {
      this.serverHumOsc = this.ctx.createOscillator();
      this.serverHumGain = this.ctx.createGain();
      
      this.serverHumOsc.type = 'triangle';
      this.serverHumOsc.frequency.setValueAtTime(55, this.ctx.currentTime);
      
      this.serverHumGain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      this.serverHumOsc.connect(this.serverHumGain);
      this.serverHumGain.connect(this.masterGain);
      this.serverHumOsc.start();
    } catch (e) {
      // Ambient hum fallback
    }
  }

  updateServerTempHum(tempNormalized) {
    if (!this.serverHumGain || !this.serverHumOsc || this.muted) return;
    const now = this.ctx.currentTime;
    const freq = 55 + tempNormalized * 80;
    const gain = 0.01 + tempNormalized * 0.05;
    this.serverHumOsc.frequency.setTargetAtTime(freq, now, 0.1);
    this.serverHumGain.gain.setTargetAtTime(gain, now, 0.1);
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.3, this.ctx.currentTime);
    }
    return this.muted;
  }

  // --- RADIO BGM SYNTHESIZER ---
  setRadioStation(station) {
    this.init();
    this.currentStation = station;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }

    if (station === 'off' || this.muted) return;

    this.bpm = station === 'rage' ? 132 : 88;
    this.bgmStep = 0;
    const intervalMs = (60 / this.bpm) * 1000 / 4; // 16th notes
    this.bgmTimer = setInterval(() => this.tickBGM(), intervalMs);
  }

  cycleRadioStation() {
    const stations = ['off', 'chill', 'rage'];
    const nextIdx = (stations.indexOf(this.currentStation) + 1) % stations.length;
    this.setRadioStation(stations[nextIdx]);
    return this.currentStation;
  }

  tickBGM() {
    if (!this.ctx || this.muted || this.currentStation === 'off') return;
    const step = this.bgmStep % 32;
    this.bgmStep++;

    if (this.currentStation === 'chill') {
      this.playChillNote(step);
    } else if (this.currentStation === 'rage') {
      this.playRageNote(step);
    }
  }

  playChillNote(step) {
    const now = this.ctx.currentTime;
    // Pentatonic scale notes (D minor pentatonic: D3, F3, G3, A3, C4, D4, F4)
    const notes = [146.83, 174.61, 196.00, 220.00, 261.63, 293.66, 349.23];
    
    // Bass on beats 0, 8, 16, 24
    if (step % 8 === 0) {
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'triangle';
      const root = (step === 0 || step === 16) ? 73.42 : (step === 8 ? 87.31 : 65.41); // D2, F2, C2
      bassOsc.frequency.setValueAtTime(root, now);
      bassGain.gain.setValueAtTime(0.2, now);
      bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      bassOsc.connect(bassGain);
      bassGain.connect(this.bgmGain);
      bassOsc.start(now);
      bassOsc.stop(now + 0.36);
    }

    // Melodic arpeggio patterns
    const melodyPattern = [0, 4, 2, 5, 3, 6, 2, 4, 1, 3, 5, 2, 4, 6, 3, 1];
    if (step % 2 === 0) {
      const noteIdx = melodyPattern[(step / 2) % melodyPattern.length];
      const freq = notes[noteIdx % notes.length];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(this.bgmGain);
      osc.start(now);
      osc.stop(now + 0.23);
    }
  }

  playRageNote(step) {
    const now = this.ctx.currentTime;
    // Driving synth bass (Sawtooth bassline)
    if (step % 4 === 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      const bassNotes = [110.00, 110.00, 130.81, 98.00]; // A2, A2, C3, G2
      osc.frequency.setValueAtTime(bassNotes[Math.floor(step / 8) % bassNotes.length], now);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
      osc.connect(gain);
      gain.connect(this.bgmGain);
      osc.start(now);
      osc.stop(now + 0.18);
    }

    // Snappy chip hi-hat on every off-beat
    if (step % 4 === 2) {
      const noise = this.ctx.createBufferSource();
      const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.04), this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      noise.connect(gain);
      gain.connect(this.bgmGain);
      noise.start(now);
    }

    // Aggressive synth lead
    if (step % 2 === 0 && Math.random() < 0.75) {
      const leadOsc = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();
      leadOsc.type = 'square';
      const scale = [440, 523.25, 587.33, 659.25, 783.99, 880];
      leadOsc.frequency.setValueAtTime(scale[step % scale.length], now);
      leadGain.gain.setValueAtTime(0.08, now);
      leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      leadOsc.connect(leadGain);
      leadGain.connect(this.bgmGain);
      leadOsc.start(now);
      leadOsc.stop(now + 0.11);
    }
  }

  // --- SOUND EFFECTS ---
  playClick() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  playDopamineChime() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = now + idx * 0.035;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);
      gain.gain.setValueAtTime(0.15, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.15);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(noteTime);
      osc.stop(noteTime + 0.16);
    });
  }

  playRageCrunch() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  playCashChime() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const freqs = [987.77, 1318.51];
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + i * 0.07;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, time);
      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.005, time + 0.22);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(time);
      osc.stop(time + 0.25);
    });
  }

  playShadowban() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  playAlarm() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.linearRampToValueAtTime(440, now + 0.15);
    osc.frequency.linearRampToValueAtTime(880, now + 0.3);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  playCoolant() {
    if (this.muted) return;
    this.init();
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.25);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    filter.Q.setValueAtTime(3, this.ctx.currentTime);
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
  }

  playAchievementFanfare() {
    if (this.muted) return;
    this.init();
    const notes = [440, 554.37, 659.25, 880];
    const now = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.08;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.36);
    });
  }
}

window.AudioSynth = new SoundEngine();

// Futuristic Web Audio Synthesizer Engine for MisterMoon Tracks & Ambient UI Sounds
// Generates lush cinematic, cyberpunk, and ambient music soundscapes on-demand using Web Audio API

export type UiSoundEffect = 'click' | 'copy' | 'star' | 'success' | 'error' | 'switch' | 'download' | 'whoosh';

class SynthEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isPlaying = false;
  private currentTrackId: string | null = null;
  private loopInterval: number | null = null;
  private nodes: (AudioNode | OscillatorNode)[] = [];
  private isAmbientSoundMuted: boolean = false;

  constructor() {
    try {
      const saved = localStorage.getItem('mistermoon_ambient_sfx_muted');
      this.isAmbientSoundMuted = saved === 'true';
    } catch {
      this.isAmbientSoundMuted = false;
    }
  }

  private init() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.isAmbientSoundMuted ? 0 : 0.45, this.ctx.currentTime);

      this.masterGain.connect(this.analyser);
      this.sfxGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    this.init();
    return this.analyser;
  }

  public setVolume(val: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime, 0.05);
    }
  }

  public isAmbientMuted(): boolean {
    return this.isAmbientSoundMuted;
  }

  public setAmbientMuted(muted: boolean) {
    this.isAmbientSoundMuted = muted;
    try {
      localStorage.setItem('mistermoon_ambient_sfx_muted', muted ? 'true' : 'false');
    } catch {
      // ignore
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(muted ? 0 : 0.45, this.ctx.currentTime, 0.05);
    }
  }

  public toggleAmbientMuted(): boolean {
    this.setAmbientMuted(!this.isAmbientSoundMuted);
    return this.isAmbientSoundMuted;
  }

  // Play subtle futuristic UI sound effects
  public playUiSound(sound: UiSoundEffect) {
    if (this.isAmbientSoundMuted) return;

    try {
      this.init();
      if (!this.ctx || !this.sfxGain) return;

      const ctx = this.ctx;
      const now = ctx.currentTime;

      switch (sound) {
        case 'click': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(400, now + 0.06);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.07);
          break;
        }

        case 'copy':
        case 'link' as unknown as UiSoundEffect: {
          // Double harmonic chirp (Gold sheen)
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.type = 'sine';
          osc2.type = 'triangle';
          osc1.frequency.setValueAtTime(587.33, now); // D5
          osc1.frequency.setValueAtTime(880, now + 0.08); // A5
          osc2.frequency.setValueAtTime(1174.66, now + 0.08); // D6
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(this.sfxGain);
          osc1.start(now);
          osc2.start(now + 0.08);
          osc1.stop(now + 0.23);
          osc2.stop(now + 0.23);
          break;
        }

        case 'star': {
          // Shimmering triple arpeggio chord (E6 -> G#6 -> B6)
          const freqs = [1318.51, 1661.22, 1975.53];
          freqs.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + idx * 0.06);
            gain.gain.setValueAtTime(0.2, now + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
            osc.connect(gain);
            gain.connect(this.sfxGain!);
            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 0.26);
          });
          break;
        }

        case 'success':
        case 'download': {
          // Uplifting gold chord (C5 -> E5 -> G5 -> C6)
          const notes = [523.25, 659.25, 783.99, 1046.5];
          notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.04);
            gain.gain.setValueAtTime(0.18, now + i * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.3);
            osc.connect(gain);
            gain.connect(this.sfxGain!);
            osc.start(now + i * 0.04);
            osc.stop(now + i * 0.04 + 0.32);
          });
          break;
        }

        case 'switch': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.09);
          break;
        }

        case 'error': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.setValueAtTime(164.81, now + 0.08);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.22);
          break;
        }

        case 'whoosh': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.16);
          break;
        }
      }
    } catch {
      // Safe ignore
    }
  }

  public playTrack(trackId: string, trackTitle: string) {
    this.stop();
    this.init();
    if (!this.ctx || !this.masterGain) return;

    this.isPlaying = true;
    this.currentTrackId = trackId;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Base atmospheric drone
    const droneOsc = ctx.createOscillator();
    const droneGain = ctx.createGain();
    droneOsc.type = 'sine';
    
    // Track-specific harmonic base frequencies
    let rootFreq = 110; // A2
    if (trackTitle.includes('Lunar')) rootFreq = 98; // G2
    else if (trackTitle.includes('Neural')) rootFreq = 87.3; // F2
    else if (trackTitle.includes('Gold')) rootFreq = 130.8; // C3
    else if (trackTitle.includes('Frequency')) rootFreq = 73.4; // D2
    else if (trackTitle.includes('Quantum')) rootFreq = 123.47; // B2

    droneOsc.frequency.setValueAtTime(rootFreq, now);
    droneGain.gain.setValueAtTime(0.15, now);

    // Sub-bass layer
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(rootFreq / 2, now);
    subGain.gain.setValueAtTime(0.2, now);

    // Filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(3, now);

    droneOsc.connect(droneGain);
    subOsc.connect(subGain);
    droneGain.connect(filter);
    subGain.connect(filter);
    filter.connect(this.masterGain);

    droneOsc.start();
    subOsc.start();
    this.nodes.push(droneOsc, droneGain, subOsc, subGain, filter);

    // Arpeggiator loop for futuristic rhythm
    const scale = [rootFreq, rootFreq * 1.25, rootFreq * 1.5, rootFreq * 1.75, rootFreq * 2];
    let noteIndex = 0;

    const playArpNote = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      const freq = scale[noteIndex % scale.length];
      osc.frequency.setValueAtTime(freq * (noteIndex % 2 === 0 ? 2 : 4), t);

      // Fast pluck envelope
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      const noteFilter = this.ctx.createBiquadFilter();
      noteFilter.type = 'bandpass';
      noteFilter.frequency.setValueAtTime(freq * 3, t);

      osc.connect(gain);
      gain.connect(noteFilter);
      noteFilter.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.36);

      noteIndex = (noteIndex + 1) % scale.length;
    };

    // Trigger arpeggiator notes
    this.loopInterval = window.setInterval(playArpNote, 320);
  }

  public stop() {
    this.isPlaying = false;
    this.currentTrackId = null;
    if (this.loopInterval) {
      clearInterval(this.loopInterval);
      this.loopInterval = null;
    }
    this.nodes.forEach((node) => {
      try {
        if ('stop' in node && typeof (node as OscillatorNode).stop === 'function') {
          (node as OscillatorNode).stop();
        }
        node.disconnect();
      } catch {
        // Safe ignore
      }
    });
    this.nodes = [];
  }

  public isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrackId(): string | null {
    return this.currentTrackId;
  }
}

export const synthEngine = new SynthEngine();

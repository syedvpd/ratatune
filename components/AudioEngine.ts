// Web Audio API Harmonica Synthesizer, Tube Amp Overdrive DSP, Lick Sequencer & Pitch Engine

export interface NoteData {
  note: string;
  freq: number;
  type: 'blow' | 'draw' | 'bend';
  hole: number;
  bendCents?: number;
  targetSemitones?: number;
}

export interface BluesLickStep {
  hole: number;
  action: 'blow' | 'draw' | 'bend';
  bendCents?: number;
  note: string;
  duration: number; // in seconds
  tab: string; // e.g. "3D''" or "4D"
}

export interface BluesLick {
  id: string;
  title: string;
  artistStyle: string;
  bpm: number;
  key: string;
  description: string;
  steps: BluesLickStep[];
}

// 3 Classic Master Blues Harp Licks
export const BLUES_LICKS: BluesLick[] = [
  {
    id: 'chicago-turnaround',
    title: 'Chicago 12-Bar Blues Turnaround',
    artistStyle: 'Little Walter / Muddy Waters style',
    bpm: 96,
    key: 'Cross Harp (Key of G on C Harp)',
    description: 'The definitive blues closing phrase: 2 draw root, deep 3 draw whole-step bend, into 4 draw and 4 blow resolution.',
    steps: [
      { hole: 2, action: 'draw', note: 'G4', duration: 0.4, tab: '2D' },
      { hole: 3, action: 'bend', bendCents: -200, note: 'A4', duration: 0.4, tab: "3D''" },
      { hole: 3, action: 'bend', bendCents: -100, note: 'Bb4', duration: 0.35, tab: "3D'" },
      { hole: 4, action: 'draw', note: 'D5', duration: 0.45, tab: '4D' },
      { hole: 4, action: 'bend', bendCents: -100, note: 'Db5', duration: 0.4, tab: "4D'" },
      { hole: 4, action: 'blow', note: 'C5', duration: 0.6, tab: '4B' },
      { hole: 2, action: 'draw', note: 'G4', duration: 0.8, tab: '2D (Root)' },
    ]
  },
  {
    id: 'sonny-boy-wail',
    title: 'Delta Swamp Deep Bend Wail',
    artistStyle: 'Sonny Boy Williamson II style',
    bpm: 84,
    key: 'Cross Harp (Key of G on C Harp)',
    description: 'A slow, agonizing pitch drop on hole 3 all the way to the blue 3rd (Ab4) and 6th (A4).',
    steps: [
      { hole: 3, action: 'draw', note: 'B4', duration: 0.5, tab: '3D (Natural)' },
      { hole: 3, action: 'bend', bendCents: -100, note: 'Bb4', duration: 0.4, tab: "3D' (b7)" },
      { hole: 3, action: 'bend', bendCents: -200, note: 'A4', duration: 0.6, tab: "3D'' (6th)" },
      { hole: 3, action: 'bend', bendCents: -300, note: 'Ab4', duration: 0.7, tab: "3D''' (Blue 3rd)" },
      { hole: 2, action: 'draw', note: 'G4', duration: 0.9, tab: '2D (Root)' },
    ]
  },
  {
    id: 'train-chug',
    title: 'Express Train Whistle & Chug',
    artistStyle: 'DeFord Bailey / Traditional style',
    bpm: 110,
    key: 'Key of C / Cross Harp',
    description: 'Rhythmic percussive harmonica train rhythm with expressive double-stop blow/draw bends.',
    steps: [
      { hole: 4, action: 'draw', note: 'D5', duration: 0.25, tab: '4D' },
      { hole: 4, action: 'bend', bendCents: -100, note: 'Db5', duration: 0.3, tab: "4D'" },
      { hole: 4, action: 'blow', note: 'C5', duration: 0.25, tab: '4B' },
      { hole: 2, action: 'draw', note: 'G4', duration: 0.35, tab: '2D' },
      { hole: 1, action: 'draw', note: 'D4', duration: 0.35, tab: '1D' },
      { hole: 4, action: 'draw', note: 'D5', duration: 0.5, tab: '4D (Whistle)' },
      { hole: 4, action: 'bend', bendCents: -100, note: 'Db5', duration: 0.7, tab: "4D' (Bend)" },
    ]
  }
];

// Key of C Richter Tuning notes (Holes 1 to 10)
export const HARMONICA_NOTES: Record<number, { blow: { note: string; freq: number }; draw: { note: string; freq: number }; bends?: { note: string; freq: number; name: string; cents: number }[] }> = {
  1: {
    blow: { note: 'C4', freq: 261.63 },
    draw: { note: 'D4', freq: 293.66 },
    bends: [{ note: 'Db4', freq: 277.18, name: '½ step bend', cents: -100 }]
  },
  2: {
    blow: { note: 'E4', freq: 329.63 },
    draw: { note: 'G4', freq: 392.00 },
    bends: [
      { note: 'Gb4', freq: 369.99, name: '½ step bend', cents: -100 },
      { note: 'F4', freq: 349.23, name: 'Whole step bend', cents: -200 }
    ]
  },
  3: {
    blow: { note: 'G4', freq: 392.00 },
    draw: { note: 'B4', freq: 493.88 },
    bends: [
      { note: 'Bb4', freq: 466.16, name: '½ step bend', cents: -100 },
      { note: 'A4', freq: 440.00, name: 'Whole step bend', cents: -200 },
      { note: 'Ab4', freq: 415.30, name: '1½ step deep bend', cents: -300 }
    ]
  },
  4: {
    blow: { note: 'C5', freq: 523.25 },
    draw: { note: 'D5', freq: 587.33 },
    bends: [{ note: 'Db5', freq: 554.37, name: '½ step bend', cents: -100 }]
  },
  5: {
    blow: { note: 'E5', freq: 659.25 },
    draw: { note: 'F5', freq: 698.46 },
  },
  6: {
    blow: { note: 'G5', freq: 783.99 },
    draw: { note: 'A5', freq: 880.00 },
    bends: [{ note: 'Ab5', freq: 830.61, name: '½ step bend', cents: -100 }]
  },
  7: {
    blow: { note: 'C6', freq: 1046.50 },
    draw: { note: 'B5', freq: 987.77 },
  },
  8: {
    blow: { note: 'E6', freq: 1318.51 },
    draw: { note: 'D6', freq: 1174.66 },
  },
  9: {
    blow: { note: 'G6', freq: 1567.98 },
    draw: { note: 'F6', freq: 1396.91 },
  },
  10: {
    blow: { note: 'C7', freq: 2093.00 },
    draw: { note: 'A6', freq: 1760.00 },
  }
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private currentOscs: { osc: OscillatorNode; gain: GainNode }[] = [];
  private breathNoise: AudioNode | null = null;
  private isMuted: boolean = false;
  private tubeAmpActive: boolean = false;
  private waveShaper: WaveShaperNode | null = null;
  private reverbConvolver: ConvolverNode | null = null;
  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private micAnalyser: AnalyserNode | null = null;
  private lickTimeouts: NodeJS.Timeout[] = [];

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 1024;
        this.analyser.smoothingTimeConstant = 0.85;

        // Tube amp distortion curves
        this.waveShaper = this.ctx.createWaveShaper();
        this.waveShaper.curve = this.makeDistortionCurve(0) as unknown as Float32Array<ArrayBuffer>;
        this.waveShaper.oversample = '4x';

        // Reverb Convolver setup
        this.reverbConvolver = this.createSpringReverbImpulse();

        this.masterGain.connect(this.waveShaper);
        this.waveShaper.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private makeDistortionCurve(amount: number): Float32Array {
    const k = amount;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      if (k === 0) {
        curve[i] = x;
      } else {
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      }
    }
    return curve;
  }

  private createSpringReverbImpulse(): ConvolverNode | null {
    if (!this.ctx) return null;
    try {
      const rate = this.ctx.sampleRate;
      const length = rate * 1.5;
      const decay = 2.0;
      const impulse = this.ctx.createBuffer(2, length, rate);
      const left = impulse.getChannelData(0);
      const right = impulse.getChannelData(1);

      for (let i = 0; i < length; i++) {
        const n = length - i;
        left[i] = ((Math.random() * 2 - 1) * Math.pow(n / length, decay));
        right[i] = ((Math.random() * 2 - 1) * Math.pow(n / length, decay));
      }

      const convolver = this.ctx.createConvolver();
      convolver.buffer = impulse;
      return convolver;
    } catch {
      return null;
    }
  }

  public toggleTubeAmp(active: boolean) {
    this.tubeAmpActive = active;
    if (this.waveShaper) {
      this.waveShaper.curve = this.makeDistortionCurve(active ? 35 : 0) as unknown as Float32Array<ArrayBuffer>;
    }
  }

  public isTubeAmp(): boolean {
    return this.tubeAmpActive;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.35, this.ctx.currentTime, 0.05);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Play a harmonica reed tone with realistic overtones and acoustic formant filtering
  public playHarmonicaTone(baseFreq: number, bendCents: number = 0, duration: number = 0): { stop: () => void; updatePitch: (newCents: number) => void } {
    this.init();
    if (!this.ctx || !this.masterGain) {
      return { stop: () => {}, updatePitch: () => {} };
    }

    // Stop previous sustained tones
    this.stopAllTones();

    const now = this.ctx.currentTime;
    const bendFactor = Math.pow(2, bendCents / 1200);
    const targetFreq = baseFreq * bendFactor;

    // Harmonic overtones typical of brass harmonica reeds
    const harmonics = [
      { mult: 1, gain: 0.65, type: 'sawtooth' as OscillatorType },
      { mult: 2, gain: 0.35, type: 'triangle' as OscillatorType },
      { mult: 3, gain: 0.24, type: 'sawtooth' as OscillatorType },
      { mult: 4, gain: 0.12, type: 'sine' as OscillatorType },
      { mult: 5, gain: 0.06, type: 'triangle' as OscillatorType },
    ];

    // Main voice gain envelope
    const voiceGain = this.ctx.createGain();
    voiceGain.gain.setValueAtTime(0.001, now);
    voiceGain.gain.exponentialRampToValueAtTime(0.42, now + 0.035);

    // Formant body filter (harmonica comb / casing resonance)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(Math.min(targetFreq * 1.85, 3400), now);
    filter.Q.setValueAtTime(2.4, now);

    const lpFilter = this.ctx.createBiquadFilter();
    lpFilter.type = 'lowpass';
    lpFilter.frequency.setValueAtTime(4800, now);

    const activeOscs: { osc: OscillatorNode; mult: number }[] = [];

    harmonics.forEach(h => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = h.type;
      osc.frequency.setValueAtTime(targetFreq * h.mult, now);

      const hGain = this.ctx.createGain();
      hGain.gain.setValueAtTime(h.gain, now);

      osc.connect(hGain);
      hGain.connect(filter);
      osc.start(now);
      activeOscs.push({ osc, mult: h.mult });
    });

    // Breath noise layer
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.04;
      }
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(targetFreq * 2.2, now);
      noiseFilter.Q.setValueAtTime(3.0, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.025, now);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(voiceGain);
      noiseSource.start(now);
      this.breathNoise = noiseSource;
    } catch {}

    filter.connect(lpFilter);
    lpFilter.connect(voiceGain);
    voiceGain.connect(this.masterGain);

    const stop = () => {
      if (!this.ctx) return;
      const stopNow = this.ctx.currentTime;
      try {
        voiceGain.gain.cancelScheduledValues(stopNow);
        voiceGain.gain.setValueAtTime(voiceGain.gain.value, stopNow);
        voiceGain.gain.exponentialRampToValueAtTime(0.0001, stopNow + 0.12);
        setTimeout(() => {
          activeOscs.forEach(o => {
            try { o.osc.stop(); o.osc.disconnect(); } catch {}
          });
          if (this.breathNoise) {
            try { (this.breathNoise as AudioScheduledSourceNode).stop(); } catch {}
            this.breathNoise = null;
          }
          voiceGain.disconnect();
        }, 150);
      } catch {}
    };

    const updatePitch = (newCents: number) => {
      if (!this.ctx) return;
      const updateNow = this.ctx.currentTime;
      const newFactor = Math.pow(2, newCents / 1200);
      const newTarget = baseFreq * newFactor;
      activeOscs.forEach(o => {
        try {
          o.osc.frequency.setTargetAtTime(newTarget * o.mult, updateNow, 0.03);
        } catch {}
      });
      try {
        filter.frequency.setTargetAtTime(Math.min(newTarget * 1.85, 3400), updateNow, 0.04);
      } catch {}
    };

    if (duration > 0) {
      setTimeout(stop, duration * 1000);
    }

    return { stop, updatePitch };
  }

  // Play a full Blues Lick sequence with step callback
  public playBluesLick(
    lick: BluesLick,
    tempoMultiplier: number = 1.0,
    onStep: (stepIndex: number) => void,
    onComplete: () => void
  ) {
    this.stopLick();
    let accumulatedTime = 0;

    lick.steps.forEach((step, index) => {
      const stepDuration = (step.duration / tempoMultiplier) * 1000;
      const timeoutId = setTimeout(() => {
        onStep(index);
        const holeData = HARMONICA_NOTES[step.hole];
        if (holeData) {
          const baseFreq = step.action === 'blow' ? holeData.blow.freq : holeData.draw.freq;
          const cents = step.bendCents || 0;
          this.playHarmonicaTone(baseFreq, cents, step.duration / tempoMultiplier * 0.92);
        }
      }, accumulatedTime);

      this.lickTimeouts.push(timeoutId);
      accumulatedTime += stepDuration;
    });

    const finishTimeout = setTimeout(() => {
      onComplete();
    }, accumulatedTime);
    this.lickTimeouts.push(finishTimeout);
  }

  public stopLick() {
    this.lickTimeouts.forEach(t => clearTimeout(t));
    this.lickTimeouts = [];
    this.stopAllTones();
  }

  // Play two simultaneous tones to demonstrate acoustic dissonance / beating (for Ear Training)
  public playComparisonTone(targetFreq: number, userDeviationCents: number): { stop: () => void; updateDeviation: (c: number) => void } {
    this.init();
    if (!this.ctx || !this.masterGain) {
      return { stop: () => {}, updateDeviation: () => {} };
    }

    this.stopAllTones();
    const now = this.ctx.currentTime;

    // Reference pure tone
    const oscRef = this.ctx.createOscillator();
    oscRef.type = 'triangle';
    oscRef.frequency.setValueAtTime(targetFreq, now);

    const gainRef = this.ctx.createGain();
    gainRef.gain.setValueAtTime(0.2, now);
    oscRef.connect(gainRef);
    gainRef.connect(this.masterGain);
    oscRef.start(now);

    // Detuned bend tone
    const oscDetuned = this.ctx.createOscillator();
    oscDetuned.type = 'sawtooth';
    const detunedFreq = targetFreq * Math.pow(2, userDeviationCents / 1200);
    oscDetuned.frequency.setValueAtTime(detunedFreq, now);

    const gainDetuned = this.ctx.createGain();
    gainDetuned.gain.setValueAtTime(0.2, now);
    oscDetuned.connect(gainDetuned);
    gainDetuned.connect(this.masterGain);
    oscDetuned.start(now);

    const updateDeviation = (newCents: number) => {
      if (!this.ctx) return;
      const updateNow = this.ctx.currentTime;
      const newFreq = targetFreq * Math.pow(2, newCents / 1200);
      oscDetuned.frequency.setTargetAtTime(newFreq, updateNow, 0.03);
    };

    const stop = () => {
      try {
        oscRef.stop();
        oscDetuned.stop();
        oscRef.disconnect();
        oscDetuned.disconnect();
      } catch {}
    };

    return { stop, updateDeviation };
  }

  public stopAllTones() {
    this.currentOscs.forEach(o => {
      try {
        o.osc.stop();
        o.osc.disconnect();
      } catch {}
    });
    this.currentOscs = [];
    if (this.breathNoise) {
      try { (this.breathNoise as AudioScheduledSourceNode).stop(); } catch {}
      this.breathNoise = null;
    }
  }

  // Play musical UI clicks
  public playClick(freq: number = 880, type: 'click' | 'lock' | 'snap' = 'click') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (type === 'lock') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'snap') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.06);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.045);
    }

    osc.connect(gain);
    gain.connect(this.masterGain);
  }

  // Real-time Mic Listening
  public async startMicListening(onPitchDetected: (pitch: number, note: string, cents: number) => void): Promise<boolean> {
    try {
      this.init();
      if (!this.ctx) return false;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.micStream = stream;
      this.micSource = this.ctx.createMediaStreamSource(stream);
      this.micAnalyser = this.ctx.createAnalyser();
      this.micAnalyser.fftSize = 2048;
      this.micSource.connect(this.micAnalyser);

      const buf = new Float32Array(this.micAnalyser.fftSize);
      const detectLoop = () => {
        if (!this.micAnalyser) return;
        this.micAnalyser.getFloatTimeDomainData(buf);
        const pitch = autoCorrelate(buf, this.ctx!.sampleRate);
        if (pitch !== -1) {
          const { note, cents } = frequencyToNote(pitch);
          onPitchDetected(pitch, note, cents);
        }
        if (this.micStream) {
          requestAnimationFrame(detectLoop);
        }
      };
      requestAnimationFrame(detectLoop);
      return true;
    } catch {
      return false;
    }
  }

  public stopMicListening() {
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }
    if (this.micSource) {
      this.micSource.disconnect();
      this.micSource = null;
    }
    this.micAnalyser = null;
  }
}

function autoCorrelate(buffer: Float32Array, sampleRate: number): number {
  let rms = 0;
  for (let i = 0; i < buffer.length; i++) {
    const val = buffer[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / buffer.length);
  if (rms < 0.015) return -1;

  let r1 = 0, r2 = buffer.length - 1;
  const thres = 0.2;
  for (let i = 0; i < buffer.length / 2; i++) {
    if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
  }
  for (let i = 1; i < buffer.length / 2; i++) {
    if (Math.abs(buffer[buffer.length - i]) < thres) { r2 = buffer.length - i; break; }
  }

  const trimmed = buffer.slice(r1, r2);
  const c = new Array(trimmed.length).fill(0);
  for (let i = 0; i < trimmed.length; i++) {
    for (let j = 0; j < trimmed.length - i; j++) {
      c[i] = c[i] + trimmed[j] * trimmed[j + i];
    }
  }

  let d = 0;
  while (c[d] > c[d + 1]) d++;
  let maxval = -1, maxpos = -1;
  for (let i = d; i < trimmed.length; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  let T0 = maxpos;
  if (T0 === -1 || maxval / c[0] < 0.4) return -1;

  const x1 = c[T0 - 1] || 0;
  const x2 = c[T0];
  const x3 = c[T0 + 1] || 0;
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}

const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function frequencyToNote(freq: number): { note: string; cents: number; noteNumber: number } {
  const noteNum = 12 * (Math.log(freq / 440) / Math.log(2));
  const rounded = Math.round(noteNum) + 69;
  const note = noteNames[rounded % 12] + (Math.floor(rounded / 12) - 1);
  const cents = Math.floor((noteNum - Math.round(noteNum)) * 100);
  return { note, cents, noteNumber: rounded };
}

export const audioEngine = new SoundEngine();

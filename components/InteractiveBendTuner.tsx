'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { audioEngine } from './AudioEngine';
import SpectrogramWaterfall from './SpectrogramWaterfall';

interface BendPreset {
  id: string;
  name: string;
  hole: number;
  type: 'draw' | 'blow';
  naturalNote: string;
  naturalFreq: number;
  targetNote: string;
  targetSemitones: number;
  targetCents: number;
  simulatedDefaultMiss: number;
}

const PRESETS: BendPreset[] = [
  {
    id: '3-draw-2st',
    name: '3-Hole Draw · Whole Step',
    hole: 3,
    type: 'draw',
    naturalNote: 'B4',
    naturalFreq: 493.88,
    targetNote: 'A4',
    targetSemitones: -2.0,
    targetCents: -200,
    simulatedDefaultMiss: -228,
  },
  {
    id: '2-draw-2st',
    name: '2-Hole Draw · Whole Step',
    hole: 2,
    type: 'draw',
    naturalNote: 'G4',
    naturalFreq: 392.00,
    targetNote: 'F4',
    targetSemitones: -2.0,
    targetCents: -200,
    simulatedDefaultMiss: -185,
  },
  {
    id: '4-draw-1st',
    name: '4-Hole Draw · Half Step',
    hole: 4,
    type: 'draw',
    naturalNote: 'D5',
    naturalFreq: 587.33,
    targetNote: 'Db5',
    targetSemitones: -1.0,
    targetCents: -100,
    simulatedDefaultMiss: -112,
  },
  {
    id: '3-draw-3st',
    name: '3-Hole Draw · 1½ Step Deep',
    hole: 3,
    type: 'draw',
    naturalNote: 'B4',
    naturalFreq: 493.88,
    targetNote: 'Ab4',
    targetSemitones: -3.0,
    targetCents: -300,
    simulatedDefaultMiss: -280,
  }
];

export default function InteractiveBendTuner() {
  const [activePreset, setActivePreset] = useState<BendPreset>(PRESETS[0]);
  const [currentBendCents, setCurrentBendCents] = useState<number>(PRESETS[0].simulatedDefaultMiss);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [isTubeAmpOn, setIsTubeAmpOn] = useState<boolean>(false);
  const [micPitch, setMicPitch] = useState<{ freq: number; note: string; cents: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const soundHandleRef = useRef<{ stop: () => void; updatePitch: (c: number) => void } | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const sliderTrackRef = useRef<HTMLDivElement>(null);

  const deviationCents = Math.round(currentBendCents - activePreset.targetCents);
  const actualSemitones = (currentBendCents / 100).toFixed(2);
  const isInTune = Math.abs(deviationCents) <= 6;

  const getCoachTip = (diff: number) => {
    if (Math.abs(diff) <= 4) return { tip: 'Target Locked (0¢)! Clean, resonant embouchure.', tone: 'perfect' };
    if (diff < -40) return { tip: 'Overbent or throat too tight. Relax jaw and ease the suction.', tone: 'warning' };
    if (diff < 0) return { tip: `Flat by ${Math.abs(diff)}¢. Raise back of tongue arch toward molars for deeper pitch.`, tone: 'flat' };
    if (diff > 40) return { tip: 'Underbent. Pull resonance further back toward the soft palate.', tone: 'warning' };
    return { tip: `Sharp by ${diff}¢. Ease breath pressure and widen oral cavity.`, tone: 'sharp' };
  };

  const coach = getCoachTip(deviationCents);

  const toggleAmp = () => {
    const nextAmp = !isTubeAmpOn;
    setIsTubeAmpOn(nextAmp);
    audioEngine.toggleTubeAmp(nextAmp);
    audioEngine.playClick(660, 'snap');
  };

  const startTone = useCallback(() => {
    if (soundHandleRef.current) {
      soundHandleRef.current.stop();
    }
    const handle = audioEngine.playHarmonicaTone(activePreset.naturalFreq, currentBendCents);
    soundHandleRef.current = handle;
    setIsPlaying(true);
    audioEngine.playClick(660, 'snap');
  }, [activePreset, currentBendCents]);

  const stopTone = useCallback(() => {
    if (soundHandleRef.current) {
      soundHandleRef.current.stop();
      soundHandleRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const handleBendChange = useCallback((newTotalCents: number) => {
    setCurrentBendCents(newTotalCents);
    if (soundHandleRef.current) {
      soundHandleRef.current.updatePitch(newTotalCents);
    }
    if (Math.abs(newTotalCents - activePreset.targetCents) <= 4) {
      audioEngine.playClick(1046.5, 'lock');
    }
  }, [activePreset]);

  const selectPreset = (p: BendPreset) => {
    setActivePreset(p);
    setCurrentBendCents(p.simulatedDefaultMiss);
    if (soundHandleRef.current) {
      soundHandleRef.current.stop();
      soundHandleRef.current = audioEngine.playHarmonicaTone(p.naturalFreq, p.simulatedDefaultMiss);
    }
    audioEngine.playClick(784, 'click');
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromPointer(e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    updateFromPointer(e.clientY);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const updateFromPointer = (clientY: number) => {
    if (!sliderTrackRef.current) return;
    const rect = sliderTrackRef.current.getBoundingClientRect();
    const relativeY = Math.max(0, Math.min(rect.height, clientY - rect.top));
    const ratio = relativeY / rect.height;
    const minCents = 0;
    const maxCents = activePreset.targetCents * 1.5;
    const calculatedCents = Math.round(minCents + ratio * (maxCents - minCents));
    handleBendChange(calculatedCents);
  };

  const toggleMic = async () => {
    if (isMicActive) {
      audioEngine.stopMicListening();
      setIsMicActive(false);
      setMicPitch(null);
    } else {
      const ok = await audioEngine.startMicListening((pitch, note, cents) => {
        setMicPitch({ freq: pitch, note, cents });
      });
      if (ok) {
        setIsMicActive(true);
        audioEngine.playClick(880, 'lock');
      } else {
        alert('Microphone access unavailable or denied. You can continue using the interactive bend lever!');
      }
    }
  };

  // Waveform canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const analyser = audioEngine.getAnalyser();
    const dataArray = new Uint8Array(analyser ? analyser.frequencyBinCount : 256);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      if (analyser && isPlaying) {
        analyser.getByteTimeDomainData(dataArray);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = isInTune ? '#8ee4af' : '#f5c253';
        ctx.shadowColor = isInTune ? 'rgba(142, 228, 175, 0.8)' : 'rgba(245, 194, 83, 0.6)';
        ctx.shadowBlur = 12;

        ctx.beginPath();
        const sliceWidth = width / dataArray.length;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        const time = Date.now() * 0.003;
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(245, 194, 83, 0.35)';
        ctx.beginPath();
        for (let x = 0; x < width; x += 4) {
          const y = height / 2 + Math.sin(x * 0.04 + time) * 12 * Math.sin(x * 0.01);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isInTune]);

  useEffect(() => {
    return () => {
      if (soundHandleRef.current) {
        soundHandleRef.current.stop();
      }
      audioEngine.stopMicListening();
    };
  }, []);

  const clampedDiff = Math.max(-50, Math.min(50, deviationCents));
  const needleAngle = (clampedDiff / 50) * 45;

  return (
    <div className="bend-sandbox-card">
      <div className="sandbox-header">
        <div className="sandbox-tag">
          <span className={`live-pulse-dot ${isPlaying ? 'is-live' : ''}`} />
          <span>Interactive Harmonica Bend Sandbox</span>
        </div>
        <div className="sandbox-actions">
          <button
            type="button"
            className={`sandbox-mic-btn ${isTubeAmpOn ? 'is-active' : ''}`}
            onClick={toggleAmp}
            title="Switch Tube Amp Overdrive"
          >
            <span>{isTubeAmpOn ? '🔥 1959 Tube Amp ON' : 'Acoustic Clean'}</span>
          </button>
          <button
            type="button"
            className={`sandbox-mic-btn ${isMicActive ? 'is-active' : ''}`}
            onClick={toggleMic}
            title="Listen to your actual harmonica using your microphone"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
            <span>{isMicActive ? 'Listening to Mic...' : 'Test with Real Mic'}</span>
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="preset-selector-bar">
        <span className="preset-label">CHOOSE TARGET BEND:</span>
        <div className="preset-pill-group">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`preset-pill ${activePreset.id === p.id ? 'is-active' : ''}`}
              onClick={() => selectPreset(p)}
            >
              <span>{p.name}</span>
              <b>{p.targetNote} ({p.targetSemitones} ST)</b>
            </button>
          ))}
        </div>
      </div>

      {/* Main Tuner Display & Controls */}
      <div className="sandbox-grid">
        {/* Left: Interactive Bend Lever */}
        <div className="lever-column">
          <div className="lever-title">
            <span>EMBOUCHURE / BEND DEPTH</span>
            <small>Drag lever up / down</small>
          </div>
          <div
            ref={sliderTrackRef}
            className="lever-track"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div className="track-scale">
              <span className="scale-mark mark-0">Unbent (0 ST) · {activePreset.naturalNote}</span>
              <span className="scale-mark mark-target">Target ({activePreset.targetSemitones} ST) · {activePreset.targetNote}</span>
              <span className="scale-mark mark-deep">Deep Bend (-3.5 ST)</span>
            </div>
            <div
              className="target-line"
              style={{
                top: `${(activePreset.targetCents / (activePreset.targetCents * 1.5)) * 100}%`,
              }}
            >
              <span className="target-pill">Target {activePreset.targetSemitones} ST</span>
            </div>
            <div
              className="lever-thumb"
              style={{
                top: `${Math.min(100, Math.max(0, (currentBendCents / (activePreset.targetCents * 1.5)) * 100))}%`,
              }}
            >
              <div className="thumb-grip">
                <span />
                <span />
                <span />
              </div>
              <div className="thumb-bubble">
                <b>{actualSemitones} ST</b>
                <small>{currentBendCents}¢</small>
              </div>
            </div>
          </div>
          <div className="lever-controls">
            <button
              type="button"
              className={`lever-play-btn ${isPlaying ? 'is-playing' : ''}`}
              onClick={isPlaying ? stopTone : startTone}
            >
              {isPlaying ? (
                <>
                  <span className="pause-icon" /> Stop Reed Sound
                </>
              ) : (
                <>
                  <span className="play-icon" /> Hold & Hear Reed Tone
                </>
              )}
            </button>
          </div>
        </div>

        {/* Center: Live Pitch Strobe Gauge & Meter */}
        <div className="gauge-column">
          <div className="gauge-housing">
            <div className={`gauge-meter ${isInTune ? 'is-in-tune' : ''}`}>
              <div className="gauge-arc">
                <div
                  className="gauge-needle"
                  style={{ transform: `rotate(${needleAngle}deg)` }}
                />
                <div className="gauge-center-cap" />
                <div className="gauge-mark-0" />
              </div>
              <div className="cents-big-readout">
                <span className="cents-sign">{deviationCents > 0 ? '+' : ''}</span>
                <strong className={`cents-num ${isInTune ? 'text-green' : 'text-gold'}`}>
                  {deviationCents}
                </strong>
                <span className="cents-unit">CENTS</span>
              </div>
              <div className="target-comparison">
                <div className="comp-item">
                  <small>NATURAL NOTE</small>
                  <b>{activePreset.naturalNote}</b>
                </div>
                <div className="comp-divider">➔</div>
                <div className="comp-item">
                  <small>TARGET</small>
                  <b className="text-gold">{activePreset.targetNote}</b>
                </div>
                <div className="comp-divider">➔</div>
                <div className="comp-item">
                  <small>ACTUAL</small>
                  <b className={isInTune ? 'text-green' : 'text-white'}>
                    {(activePreset.naturalFreq * Math.pow(2, currentBendCents / 1200)).toFixed(1)} Hz
                  </b>
                </div>
              </div>
            </div>

            {/* Live Waveform Canvas */}
            <div className="waveform-container">
              <div className="waveform-meta">
                <span>REED VIBRATION FREQUENCY / SPECTRUM</span>
                <span className="wave-status">{isPlaying ? 'LIVE OSCILLOSCOPE' : 'IDLE'}</span>
              </div>
              <canvas ref={canvasRef} width={460} height={80} className="waveform-canvas" />
            </div>

            {/* AI Coach Live Feedback */}
            <div className={`coach-feedback-box tone-${coach.tone}`}>
              <div className="coach-badge">
                <span className="coach-icon">⚡</span>
                <span>RATATUNE BEND COACH</span>
              </div>
              <p className="coach-text">{coach.tip}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 60FPS Harmonic Spectrogram Waterfall */}
      <div className="tuner-waterfall-box">
        <SpectrogramWaterfall />
      </div>

      {isMicActive && micPitch && (
        <div className="mic-live-banner">
          <span className="mic-dot" />
          <span>MICROPHONE DETECTED:</span>
          <b>{micPitch.note} ({micPitch.freq.toFixed(1)} Hz)</b>
          <span className="mic-cents">{micPitch.cents > 0 ? `+${micPitch.cents}` : micPitch.cents} cents</span>
        </div>
      )}
    </div>
  );
}

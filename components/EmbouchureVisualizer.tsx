'use client';

import { useState } from 'react';
import { audioEngine } from './AudioEngine';

interface EmbouchureStage {
  id: string;
  name: string;
  hole: string;
  target: string;
  semitones: number; // 0, -1, -2, -3
  tongueArchY: number; // 0 = flat bottom, 100 = high arch
  airflowSpeed: string;
  vocalTractVolume: string;
  techniqueCue: string;
  frequency: number;
}

const STAGES: EmbouchureStage[] = [
  {
    id: 'unbent',
    name: '01. Natural Draw (Unbent)',
    hole: '3 Hole Draw',
    target: 'B4 (Natural)',
    semitones: 0,
    tongueArchY: 15,
    airflowSpeed: 'Laminar Airflow (Smooth)',
    vocalTractVolume: 'Large / Neutral Oral Chamber (68 cm³)',
    techniqueCue: 'Tongue rests flat on the floor of the mouth, breathing from the diaphragm.',
    frequency: 493.88
  },
  {
    id: 'half-step',
    name: '02. Half-Step Bend',
    hole: '3 Hole Draw Bend',
    target: 'Bb4 (−1.0 ST)',
    semitones: -1,
    tongueArchY: 45,
    airflowSpeed: 'Accelerated Mid-Vowel Flow',
    vocalTractVolume: 'Medium Chamber (48 cm³)',
    techniqueCue: 'Arch middle of the tongue slightly toward the hard palate (like saying "Kee").',
    frequency: 466.16
  },
  {
    id: 'whole-step',
    name: '03. Whole-Step Bend (The Sweet Spot)',
    hole: '3 Hole Draw Bend',
    target: 'A4 (−2.0 ST)',
    semitones: -2,
    tongueArchY: 78,
    airflowSpeed: 'High-Velocity Compressed Jet',
    vocalTractVolume: 'Small Resonance Cavity (32 cm³)',
    techniqueCue: 'Pull back of tongue firmly toward upper molars. Coupler pressure drops reed pitch 2 semitones.',
    frequency: 440.00
  },
  {
    id: 'deep-bend',
    name: '04. Deep 1½ Step Blue Note',
    hole: '3 Hole Draw Deep Bend',
    target: 'Ab4 (−3.0 ST)',
    semitones: -3,
    tongueArchY: 96,
    airflowSpeed: 'Extreme Vortex Constriction',
    vocalTractVolume: 'Tight Throat Aperture (18 cm³)',
    techniqueCue: 'Deep drop of jaw with tight posterior tongue constriction against soft palate.',
    frequency: 415.30
  }
];

export default function EmbouchureVisualizer() {
  const [activeStage, setActiveStage] = useState<EmbouchureStage>(STAGES[2]); // Whole step default

  const selectStage = (s: EmbouchureStage) => {
    setActiveStage(s);
    audioEngine.playHarmonicaTone(493.88, s.semitones * 100, 1.2);
    audioEngine.playClick(800 + Math.abs(s.semitones) * 120, 'snap');
  };

  // SVG Tongue curve calculation based on arch percentage
  const arch = activeStage.tongueArchY;
  // SVG tongue path from lips (left) to throat (right)
  const tonguePath = `M 70 210 Q 150 ${210 - arch * 1.3} 240 ${170 - arch * 0.8} Q 310 ${140 - arch * 0.4} 370 240 L 70 240 Z`;

  return (
    <div className="embouchure-shell">
      <div className="embouchure-head">
        <div>
          <span className="eyebrow">Acoustic Physics of the Mouth</span>
          <h3 className="serif">How mouth shape bends the pitch</h3>
        </div>
        <div className="embouchure-pill-group">
          {STAGES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`stage-pill ${activeStage.id === s.id ? 'is-active' : ''}`}
              onClick={() => selectStage(s)}
            >
              <span>{s.target}</span>
              <small>{s.semitones === 0 ? 'Natural' : `${s.semitones} ST`}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="embouchure-stage-grid">
        {/* Anatomical SVG Cross-Section */}
        <div className="anatomy-canvas-box">
          <div className="anatomy-tags">
            <span className="anat-tag tag-harp">HARMONICA COMB</span>
            <span className="anat-tag tag-palate">HARD PALATE</span>
            <span className="anat-tag tag-tongue">DYNAMIC TONGUE ARCH</span>
            <span className="anat-tag tag-throat">VOCAL TRACT</span>
          </div>

          <svg viewBox="0 0 460 280" className="anatomy-svg" preserveAspectRatio="xMidYMid meet">
            <defs>
              {/* Airflow gradient */}
              <linearGradient id="airGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f5c253" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#8ee4af" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Upper Jaw & Hard Palate */}
            <path
              d="M 50 110 Q 140 70 250 85 Q 340 100 390 180"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Teeth / Lips */}
            <rect x="50" y="105" width="16" height="24" rx="4" fill="#ffffff" opacity="0.8" />
            <rect x="50" y="195" width="16" height="24" rx="4" fill="#ffffff" opacity="0.8" />

            {/* Harmonica Body (Left) */}
            <rect x="10" y="90" width="36" height="140" rx="8" fill="#1b2820" stroke="var(--gold)" strokeWidth="2" />
            <line x1="28" y1="100" x2="28" y2="220" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="3,3" />

            {/* Air Stream Vectors (Dynamic Vortex) */}
            <path
              d={`M 46 160 Q 150 ${160 - arch * 0.9} 250 ${130 - arch * 0.5} Q 330 ${120} 380 200`}
              fill="none"
              stroke="url(#airGrad)"
              strokeWidth={Math.max(3, 10 - arch * 0.08)}
              strokeLinecap="round"
              strokeDasharray="6,4"
              className="airflow-animation"
              filter="url(#glow)"
            />

            {/* Dynamic Tongue Geometry */}
            <path
              d={tonguePath}
              fill="rgba(245, 194, 83, 0.22)"
              stroke="var(--gold)"
              strokeWidth="3.5"
              className="tongue-path-transition"
            />

            {/* Acoustic Resonance Center Indicator */}
            <circle
              cx={200 + arch * 0.3}
              cy={145 - arch * 0.7}
              r={12 + arch * 0.08}
              fill="rgba(142, 228, 175, 0.25)"
              stroke="var(--mint)"
              strokeWidth="2"
              strokeDasharray="4,2"
              className="resonance-pulse"
            />
          </svg>

          <div className="anatomy-indicator">
            <span className="pulse-icon">⚡</span>
            <span>Resonance Chamber Volume: <b>{activeStage.vocalTractVolume}</b></span>
          </div>
        </div>

        {/* Technique & Science Card */}
        <div className="anatomy-info-card">
          <div className="info-top">
            <span className="stage-badge">{activeStage.name}</span>
            <strong className="pitch-readout text-gold">{activeStage.frequency.toFixed(1)} Hz</strong>
          </div>
          <h4>{activeStage.target}</h4>
          <p className="cue-text">{activeStage.techniqueCue}</p>

          <div className="science-breakdown">
            <div className="sci-row">
              <span>AIRFLOW SPEED:</span>
              <b>{activeStage.airflowSpeed}</b>
            </div>
            <div className="sci-row">
              <span>COUPLED REED ACTION:</span>
              <b>{activeStage.semitones === 0 ? 'Blow reed dominant' : 'Blow & Draw reeds acoustically locked'}</b>
            </div>
            <div className="sci-row">
              <span>ORAL CAVITY FORMANT:</span>
              <b className="text-green">Tuned to {activeStage.frequency.toFixed(1)} Hz</b>
            </div>
          </div>

          <button
            type="button"
            className="play-bend-sample-btn"
            onClick={() => audioEngine.playHarmonicaTone(493.88, activeStage.semitones * 100, 1.6)}
          >
            <span>▶ Hear This Embouchure Tone</span>
          </button>
        </div>
      </div>
    </div>
  );
}

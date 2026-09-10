'use client';

import { useState } from 'react';
import { audioEngine, HARMONICA_NOTES } from './AudioEngine';

interface PositionData {
  songKey: string;
  crossHarpKey: string; // 2nd position harmonica key
  straightHarpKey: string; // 1st position
  slantHarpKey: string; // 3rd position
  blueNotes: { degree: string; hole: string; note: string; action: string; cents?: number }[];
}

const SONG_KEYS: PositionData[] = [
  {
    songKey: 'Key of E (Blues)',
    crossHarpKey: 'Key of A Harp',
    straightHarpKey: 'Key of E Harp',
    slantHarpKey: 'Key of D Harp',
    blueNotes: [
      { degree: 'Root (1)', hole: '2 Draw / 6 Blow', note: 'E', action: 'Draw' },
      { degree: 'Flat 3rd (b3 Blue Note)', hole: '3 Draw Whole-Step Bend', note: 'G', action: 'Bend', cents: -200 },
      { degree: '4th', hole: '4 Blow / 1 Blow', note: 'A', action: 'Blow' },
      { degree: 'Flat 5th (b5 Devil Note)', hole: '4 Draw Half-Step Bend', note: 'Bb', action: 'Bend', cents: -100 },
      { degree: '5th', hole: '4 Draw / 1 Draw', note: 'B', action: 'Draw' },
      { degree: 'Flat 7th (b7)', hole: '5 Draw / 2 Blow', note: 'D', action: 'Draw' },
    ]
  },
  {
    songKey: 'Key of G (Blues)',
    crossHarpKey: 'Key of C Harp (Standard)',
    straightHarpKey: 'Key of G Harp',
    slantHarpKey: 'Key of F Harp',
    blueNotes: [
      { degree: 'Root (1)', hole: '2 Draw / 6 Blow', note: 'G4', action: 'Draw' },
      { degree: 'Flat 3rd (b3 Blue Note)', hole: '3 Draw 1½ Step Bend', note: 'Bb4', action: 'Bend', cents: -100 },
      { degree: '4th', hole: '4 Blow', note: 'C5', action: 'Blow' },
      { degree: 'Flat 5th (b5 Devil Note)', hole: '4 Draw Half-Step Bend', note: 'Db5', action: 'Bend', cents: -100 },
      { degree: '5th', hole: '4 Draw', note: 'D5', action: 'Draw' },
      { degree: 'Flat 7th (b7)', hole: '5 Draw', note: 'F5', action: 'Draw' },
    ]
  },
  {
    songKey: 'Key of A (Blues)',
    crossHarpKey: 'Key of D Harp',
    straightHarpKey: 'Key of A Harp',
    slantHarpKey: 'Key of G Harp',
    blueNotes: [
      { degree: 'Root (1)', hole: '2 Draw', note: 'A', action: 'Draw' },
      { degree: 'Flat 3rd (b3 Blue Note)', hole: '3 Draw Bend', note: 'C', action: 'Bend', cents: -200 },
      { degree: '4th', hole: '4 Blow', note: 'D', action: 'Blow' },
      { degree: 'Flat 5th (b5 Devil Note)', hole: '4 Draw Bend', note: 'Eb', action: 'Bend', cents: -100 },
      { degree: '5th', hole: '4 Draw', note: 'E', action: 'Draw' },
      { degree: 'Flat 7th (b7)', hole: '5 Draw', note: 'G', action: 'Draw' },
    ]
  },
  {
    songKey: 'Key of C (Blues)',
    crossHarpKey: 'Key of F Harp',
    straightHarpKey: 'Key of C Harp',
    slantHarpKey: 'Key of Bb Harp',
    blueNotes: [
      { degree: 'Root (1)', hole: '2 Draw', note: 'C', action: 'Draw' },
      { degree: 'Flat 3rd (b3 Blue Note)', hole: '3 Draw Bend', note: 'Eb', action: 'Bend', cents: -200 },
      { degree: '4th', hole: '4 Blow', note: 'F', action: 'Blow' },
      { degree: 'Flat 5th (b5 Devil Note)', hole: '4 Draw Bend', note: 'Gb', action: 'Bend', cents: -100 },
      { degree: '5th', hole: '4 Draw', note: 'G', action: 'Draw' },
      { degree: 'Flat 7th (b7)', hole: '5 Draw', note: 'Bb', action: 'Draw' },
    ]
  }
];

export default function PositionCalculator() {
  const [selectedSongKey, setSelectedSongKey] = useState<PositionData>(SONG_KEYS[1]); // Key of G on C Harp default

  const playScaleDegree = (note: { note: string; action: string; cents?: number }) => {
    // Play demonstration tone
    audioEngine.playHarmonicaTone(493.88, note.cents || 0, 1.0);
    audioEngine.playClick(920, 'snap');
  };

  return (
    <div className="position-calc-shell">
      <div className="calc-header">
        <div>
          <span className="eyebrow">Harmonica Theory & Position Calculator</span>
          <h3 className="serif">Cross Harp & Blue Note Key Finder</h3>
        </div>
        <div className="song-key-selector">
          <span>SELECT BAND / SONG KEY:</span>
          <div className="key-buttons">
            {SONG_KEYS.map((k) => (
              <button
                key={k.songKey}
                type="button"
                className={`key-btn ${selectedSongKey.songKey === k.songKey ? 'is-active' : ''}`}
                onClick={() => setSelectedSongKey(k)}
              >
                {k.songKey}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Position Matrix Cards */}
      <div className="positions-grid">
        <div className="position-card is-recommended">
          <div className="card-flag">MOST POPULAR / BLUES</div>
          <span className="pos-label">2ND POSITION (CROSS HARP)</span>
          <h4 className="pos-harp-key">{selectedSongKey.crossHarpKey}</h4>
          <p>
            Provides deep expressive draw bends on holes 1, 2, 3, 4 and the flatted 7th on hole 5. Essential for Chicago & Delta blues.
          </p>
        </div>

        <div className="position-card">
          <span className="pos-label">1ST POSITION (STRAIGHT HARP)</span>
          <h4 className="pos-harp-key">{selectedSongKey.straightHarpKey}</h4>
          <p>
            Standard blow-dominant tuning. Ideal for folk melodies, Bob Dylan style, and clean hymns.
          </p>
        </div>

        <div className="position-card">
          <span className="pos-label">3RD POSITION (SLANT HARP)</span>
          <h4 className="pos-harp-key">{selectedSongKey.slantHarpKey}</h4>
          <p>
            Dorian minor scale starting on hole 4 draw. Perfect for brooding, minor-key blues phrases.
          </p>
        </div>
      </div>

      {/* Blues Scale Blue Note Map */}
      <div className="blues-scale-map">
        <div className="scale-map-header">
          <span>BLUES SCALE BENDS AVAILABLE IN 2ND POSITION:</span>
          <small>Tap any note to preview its acoustic frequency</small>
        </div>

        <div className="scale-nodes-row">
          {selectedSongKey.blueNotes.map((bn, idx) => (
            <div
              key={idx}
              className={`scale-node action-${bn.action.toLowerCase()}`}
              onClick={() => playScaleDegree(bn)}
              title="Click to play tone"
            >
              <span className="node-degree">{bn.degree}</span>
              <strong className="node-note">{bn.note}</strong>
              <small className="node-hole">{bn.hole}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

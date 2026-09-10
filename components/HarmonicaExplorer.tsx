'use client';

import { useState } from 'react';
import { audioEngine, HARMONICA_NOTES } from './AudioEngine';

export default function HarmonicaExplorer() {
  const [activeHole, setActiveHole] = useState<number>(3);
  const [activeNote, setActiveNote] = useState<string>('3-draw-2'); // 3 hole whole-step bend (A4)
  const [activeDescription, setActiveDescription] = useState<{
    hole: number;
    type: string;
    note: string;
    freq: number;
    cents?: number;
    detail: string;
  }>({
    hole: 3,
    type: 'Draw Bend (Whole Step)',
    note: 'A4',
    freq: 440.0,
    cents: -200,
    detail: 'The core blues note on a C harp. Requires raising the back of the tongue toward the molar teeth to lower the pitch by 2 full semitones.'
  });

  const playNote = (hole: number, type: 'blow' | 'draw' | 'bend', bendIndex = 0) => {
    setActiveHole(hole);
    const data = HARMONICA_NOTES[hole];
    if (!data) return;

    if (type === 'blow') {
      setActiveNote(`${hole}-blow`);
      audioEngine.playHarmonicaTone(data.blow.freq, 0, 1.2);
      setActiveDescription({
        hole,
        type: 'Natural Blow Note',
        note: data.blow.note,
        freq: data.blow.freq,
        detail: `Hole ${hole} exhale. Air flows forward over the upper blow reed slot.`
      });
    } else if (type === 'draw') {
      setActiveNote(`${hole}-draw`);
      audioEngine.playHarmonicaTone(data.draw.freq, 0, 1.2);
      setActiveDescription({
        hole,
        type: 'Natural Draw Note',
        note: data.draw.note,
        freq: data.draw.freq,
        detail: `Hole ${hole} unbent inhale. Air flows into the mouth without throat/tongue constriction.`
      });
    } else if (type === 'bend' && data.bends && data.bends[bendIndex]) {
      const b = data.bends[bendIndex];
      setActiveNote(`${hole}-bend-${bendIndex}`);
      audioEngine.playHarmonicaTone(data.draw.freq, b.cents, 1.4);
      setActiveDescription({
        hole,
        type: `Draw Bend (${b.name})`,
        note: b.note,
        freq: b.freq,
        cents: b.cents,
        detail: `Hole ${hole} ${b.name}. Both blow and draw reeds couple together acoustically inside the chamber.`
      });
    }
    audioEngine.playClick(920, 'snap');
  };

  return (
    <div className="harmonica-explorer-shell">
      <div className="explorer-top">
        <div>
          <span className="eyebrow">Interactive Diatonic Harmonica (Key of C)</span>
          <h3 className="serif">Tap any reed to hear the bend physics</h3>
        </div>
        <div className="explorer-legend">
          <span className="leg-item blow"><i /> Blow (Exhale)</span>
          <span className="leg-item draw"><i /> Draw (Inhale)</span>
          <span className="leg-item bend"><i /> Draw Bend (Coupled Reeds)</span>
        </div>
      </div>

      {/* Visual Harmonica Comb and Plates */}
      <div className="harmonica-comb">
        <div className="comb-top-plate">
          <span>HOHNER / MARINE BAND STYLE ACOUSTIC CHAMBERS</span>
          <small>10-HOLE RICHTER TUNING</small>
        </div>

        {/* 10 Holes Grid */}
        <div className="holes-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((hole) => {
            const hData = HARMONICA_NOTES[hole];
            return (
              <div key={hole} className={`hole-column ${activeHole === hole ? 'is-active-col' : ''}`}>
                {/* Blow Note Button */}
                <button
                  type="button"
                  className={`reed-btn blow-reed ${activeNote === `${hole}-blow` ? 'is-active' : ''}`}
                  onClick={() => playNote(hole, 'blow')}
                  title={`Play Hole ${hole} Blow (${hData.blow.note})`}
                >
                  <span className="note-name">{hData.blow.note}</span>
                  <small>BLOW</small>
                </button>

                {/* Hole Number Ingot */}
                <div className="hole-number-box" onClick={() => playNote(hole, 'draw')}>
                  <div className="hole-air-chamber" />
                  <strong>{hole}</strong>
                </div>

                {/* Draw Note Button */}
                <button
                  type="button"
                  className={`reed-btn draw-reed ${activeNote === `${hole}-draw` ? 'is-active' : ''}`}
                  onClick={() => playNote(hole, 'draw')}
                  title={`Play Hole ${hole} Draw (${hData.draw.note})`}
                >
                  <span className="note-name">{hData.draw.note}</span>
                  <small>DRAW</small>
                </button>

                {/* Available Bends for this hole */}
                <div className="bends-stack">
                  {hData.bends?.map((bend, bIdx) => (
                    <button
                      key={bend.note}
                      type="button"
                      className={`reed-btn bend-reed ${activeNote === `${hole}-bend-${bIdx}` ? 'is-active' : ''}`}
                      onClick={() => playNote(hole, 'bend', bIdx)}
                      title={`Play Hole ${hole} Bend: ${bend.note}`}
                    >
                      <span className="note-name">{bend.note}</span>
                      <small>{bend.cents}¢</small>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Reed Acoustics Card */}
      <div className="selected-reed-card">
        <div className="reed-main-data">
          <div className="reed-pill">{activeDescription.type}</div>
          <h4>
            Hole {activeDescription.hole} · <strong className="text-gold">{activeDescription.note}</strong> ({activeDescription.freq.toFixed(1)} Hz)
          </h4>
          <p>{activeDescription.detail}</p>
        </div>
        <div className="reed-extra-stats">
          {activeDescription.cents !== undefined && (
            <div className="stat-bubble">
              <span>BEND DEPTH</span>
              <strong>{activeDescription.cents}¢</strong>
            </div>
          )}
          <div className="stat-bubble">
            <span>FREQUENCY</span>
            <strong>{activeDescription.freq.toFixed(1)} Hz</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

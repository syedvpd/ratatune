'use client';

import { useState, useRef, useEffect } from 'react';
import { audioEngine } from './AudioEngine';

interface ChallengeRound {
  id: string;
  name: string;
  hole: string;
  targetNote: string;
  targetFreq: number;
  initialRandomOffset: number; // e.g. -36 cents
  hint: string;
}

const ROUNDS: ChallengeRound[] = [
  {
    id: 'round-1',
    name: 'Round 1 · The 3-Hole Draw Whole-Step Bend',
    hole: '3 Draw',
    targetNote: 'A4 (440.0 Hz)',
    targetFreq: 440.0,
    initialRandomOffset: -38,
    hint: 'Listen closely for the pulsating acoustic beating. Move the slider until the tone turns glassy and smooth.'
  },
  {
    id: 'round-2',
    name: 'Round 2 · The 4-Hole Draw Half-Step Bend',
    hole: '4 Draw',
    targetNote: 'Db5 (554.4 Hz)',
    targetFreq: 554.37,
    initialRandomOffset: +32,
    hint: 'Higher pitch notes beat faster when out of tune. Lock it in dead center.'
  },
  {
    id: 'round-3',
    name: 'Round 3 · The 2-Hole Draw Whole-Step Deep Bend',
    hole: '2 Draw',
    targetNote: 'F4 (349.2 Hz)',
    targetFreq: 349.23,
    initialRandomOffset: -45,
    hint: 'Low frequencies require subtle ear discrimination. Eliminate the slow throbbing wobble.'
  }
];

export default function BendEarChallenge() {
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [userOffset, setUserOffset] = useState<number>(ROUNDS[0].initialRandomOffset);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasTested, setHasTested] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<{ accuracy: number; text: string; medal: string } | null>(null);

  const soundHandleRef = useRef<{ stop: () => void; updateDeviation: (c: number) => void } | null>(null);

  const round = ROUNDS[currentRoundIdx];

  const startListening = () => {
    if (soundHandleRef.current) {
      soundHandleRef.current.stop();
    }
    const handle = audioEngine.playComparisonTone(round.targetFreq, userOffset);
    soundHandleRef.current = handle;
    setIsPlaying(true);
    setHasTested(false);
    audioEngine.playClick(880, 'snap');
  };

  const stopListening = () => {
    if (soundHandleRef.current) {
      soundHandleRef.current.stop();
      soundHandleRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setUserOffset(val);
    if (soundHandleRef.current) {
      soundHandleRef.current.updateDeviation(val);
    }
  };

  const testAccuracy = () => {
    stopListening();
    const errorCents = Math.abs(userOffset);
    const accuracy = Math.max(0, Math.round(100 - errorCents * 1.5));

    let text = '';
    let medal = '🎯';

    if (errorCents <= 3) {
      text = 'Incredible Master Ear! You tuned within ±3 cents by pure sound!';
      medal = '🏆 PLATINUM EAR';
      audioEngine.playClick(1046.5, 'lock');
    } else if (errorCents <= 10) {
      text = `Outstanding! Only ${errorCents} cents off the pure harmonic center.`;
      medal = '🥇 GOLD EAR';
      audioEngine.playClick(880, 'lock');
    } else if (errorCents <= 25) {
      text = `Good ear (${errorCents} cents off). With Ratatune's visual meter, you'll lock this instantly.`;
      medal = '🥈 SILVER EAR';
      audioEngine.playClick(660, 'snap');
    } else {
      text = `Missed by ${errorCents} cents. Proves why bending is so tricky without visual feedback!`;
      medal = '🥉 BRONZE EAR';
      audioEngine.playClick(440, 'snap');
    }

    setScoreResult({ accuracy, text, medal });
    setHasTested(true);
  };

  const nextRound = () => {
    const nextIdx = (currentRoundIdx + 1) % ROUNDS.length;
    setCurrentRoundIdx(nextIdx);
    setUserOffset(ROUNDS[nextIdx].initialRandomOffset);
    setHasTested(false);
    setScoreResult(null);
    stopListening();
  };

  useEffect(() => {
    return () => {
      if (soundHandleRef.current) {
        soundHandleRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="ear-challenge-shell">
      <div className="ear-head">
        <div>
          <span className="eyebrow">Ear Training Game / Blind Test</span>
          <h3 className="serif">Can you tune the bend by ear?</h3>
        </div>
        <div className="round-stepper">
          {ROUNDS.map((r, i) => (
            <span key={r.id} className={`round-dot ${currentRoundIdx === i ? 'is-active' : ''}`}>
              Round {i + 1}
            </span>
          ))}
        </div>
      </div>

      <div className="ear-challenge-body">
        <div className="challenge-prompt-card">
          <div className="prompt-meta">
            <span className="round-badge">{round.name}</span>
            <span className="target-badge">Target: <b>{round.targetNote}</b></span>
          </div>
          <p className="hint-text">{round.hint}</p>

          {/* Interactive Tuning Dial / Slider */}
          <div className="interactive-dial-box">
            <div className="dial-scale-labels">
              <span>−50¢ (Very Flat)</span>
              <span className="center-target">0¢ Target Center</span>
              <span>+50¢ (Very Sharp)</span>
            </div>

            <input
              type="range"
              min="-50"
              max="50"
              value={userOffset}
              onChange={handleSliderChange}
              className="ear-tuning-slider"
            />

            <div className="dial-feedback-bar">
              <span>YOUR BLIND ADJUSTMENT:</span>
              <strong className="user-cents-readout">
                {userOffset > 0 ? `+${userOffset}` : userOffset} cents
              </strong>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="challenge-buttons">
            <button
              type="button"
              className={`play-beating-btn ${isPlaying ? 'is-playing' : ''}`}
              onClick={isPlaying ? stopListening : startListening}
            >
              {isPlaying ? (
                <>
                  <span className="pause-icon" /> Stop Comparison Sound
                </>
              ) : (
                <>
                  <span className="play-icon" /> 🔊 Listen & Tune Tone
                </>
              )}
            </button>

            <button type="button" className="btn btn-primary" onClick={testAccuracy}>
              Check My Accuracy ↗
            </button>
          </div>

          {/* Result Card */}
          {hasTested && scoreResult && (
            <div className="score-result-card">
              <div className="score-top">
                <span className="medal-tag">{scoreResult.medal}</span>
                <strong className="accuracy-percentage">{scoreResult.accuracy}% ACCURACY</strong>
              </div>
              <p className="score-text">{scoreResult.text}</p>
              <div className="score-actions">
                <button type="button" className="btn btn-secondary" onClick={nextRound}>
                  Try Next Round ({((currentRoundIdx + 1) % ROUNDS.length) + 1} / {ROUNDS.length}) ➔
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

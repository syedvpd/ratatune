'use client';

import { useState, useEffect } from 'react';
import { audioEngine, BLUES_LICKS, BluesLick } from './AudioEngine';

export default function BluesLickPlayer() {
  const [activeLick, setActiveLick] = useState<BluesLick>(BLUES_LICKS[0]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [tempo, setTempo] = useState<number>(1.0);
  const [isTubeAmpOn, setIsTubeAmpOn] = useState<boolean>(false);

  const toggleAmp = () => {
    const nextAmp = !isTubeAmpOn;
    setIsTubeAmpOn(nextAmp);
    audioEngine.toggleTubeAmp(nextAmp);
    audioEngine.playClick(660, 'lock');
  };

  const playLick = (lick: BluesLick) => {
    setActiveLick(lick);
    setIsPlaying(true);
    setActiveStepIndex(0);

    audioEngine.playBluesLick(
      lick,
      tempo,
      (stepIdx) => {
        setActiveStepIndex(stepIdx);
      },
      () => {
        setIsPlaying(false);
        setActiveStepIndex(-1);
      }
    );
  };

  const stopLick = () => {
    audioEngine.stopLick();
    setIsPlaying(false);
    setActiveStepIndex(-1);
  };

  useEffect(() => {
    return () => {
      audioEngine.stopLick();
    };
  }, []);

  return (
    <div className="lick-player-shell">
      <div className="lick-header">
        <div>
          <span className="eyebrow">Interactive Harmonica Tab & Lick Player</span>
          <h3 className="serif">Hear authentic blues bend phrasing</h3>
        </div>
        <div className="lick-top-controls">
          {/* Tube Amp Toggle */}
          <button
            type="button"
            className={`amp-toggle-pill ${isTubeAmpOn ? 'is-amp-on' : ''}`}
            onClick={toggleAmp}
            title="Switch between Acoustic Clean and 1959 Chicago Tube Amp Overdrive"
          >
            <span className="tube-glow-icon" />
            <span>{isTubeAmpOn ? '1959 Tube Amp (ON)' : 'Acoustic Clean'}</span>
          </button>

          {/* Tempo Selector */}
          <div className="tempo-pill-group">
            {[0.75, 1.0, 1.25].map((t) => (
              <button
                key={t}
                type="button"
                className={`tempo-btn ${tempo === t ? 'is-active' : ''}`}
                onClick={() => setTempo(t)}
              >
                {t}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lick Selector Tabs */}
      <div className="lick-selector-row">
        {BLUES_LICKS.map((lick) => (
          <button
            key={lick.id}
            type="button"
            className={`lick-tab-card ${activeLick.id === lick.id ? 'is-selected' : ''}`}
            onClick={() => {
              if (isPlaying) stopLick();
              setActiveLick(lick);
              audioEngine.playClick(880, 'snap');
            }}
          >
            <div className="tab-card-top">
              <span>{lick.artistStyle}</span>
              <b>{lick.key}</b>
            </div>
            <h4>{lick.title}</h4>
            <p>{lick.description}</p>
          </button>
        ))}
      </div>

      {/* Interactive Rolling Tab Sheet */}
      <div className="tab-sheet-display">
        <div className="tab-sheet-header">
          <span>REAL-TIME HARMONICA ROLLING TAB SHEET:</span>
          <span className="tab-legend-hint">D = Draw · B = Blow · ' = Half Step Bend · '' = Whole Step Bend</span>
        </div>

        <div className="rolling-tabs-track">
          {activeLick.steps.map((step, idx) => (
            <div
              key={idx}
              className={`tab-node ${activeStepIndex === idx ? 'is-active-step' : ''} action-${step.action}`}
            >
              <span className="tab-label">{step.tab}</span>
              <strong className="tab-note">{step.note}</strong>
              <small className="tab-hole">Hole {step.hole}</small>
              {activeStepIndex === idx && <div className="step-glow-laser" />}
            </div>
          ))}
        </div>
      </div>

      {/* Synchronized Mini 10-Hole Harp Indicator */}
      <div className="mini-harp-strip">
        <span className="mini-harp-label">HARP HOLE ACTIVE:</span>
        <div className="mini-holes-row">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((hole) => {
            const isCurrentHole =
              activeStepIndex >= 0 && activeLick.steps[activeStepIndex]?.hole === hole;
            const currentStep = activeStepIndex >= 0 ? activeLick.steps[activeStepIndex] : null;

            return (
              <div
                key={hole}
                className={`mini-hole ${isCurrentHole ? 'is-firing' : ''} ${
                  isCurrentHole && currentStep ? `type-${currentStep.action}` : ''
                }`}
              >
                <span>{hole}</span>
                {isCurrentHole && (
                  <small className="action-pill">{currentStep?.action.toUpperCase()}</small>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Play / Stop Button */}
      <div className="lick-footer-actions">
        <button
          type="button"
          className={`lick-play-main-btn ${isPlaying ? 'is-running' : ''}`}
          onClick={isPlaying ? stopLick : () => playLick(activeLick)}
        >
          {isPlaying ? (
            <>
              <span className="pause-box" /> Stop Lick
            </>
          ) : (
            <>
              <span className="play-triangle" /> Play {activeLick.title} ({tempo}x)
            </>
          )}
        </button>
      </div>
    </div>
  );
}

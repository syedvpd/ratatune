'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { audioEngine } from './AudioEngine';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    n: '01',
    label: 'PLAY',
    title: 'Give it a bend.',
    body: 'Play the note you already know. Ratatune listens through the microphone while you play, isolating acoustic harmonics in real time.',
    value: '3 draw',
    detail: 'BEND DETECTED',
    cents: '0¢',
    status: 'Harmonic lock 493.9 Hz',
  },
  {
    n: '02',
    label: 'MEASURE',
    title: 'See where it landed.',
    body: 'The target becomes a number you can actually work with: -28 cents off the A4 whole-step target. No vague “close enough”.',
    value: '−28¢',
    detail: 'FROM TARGET',
    cents: '−28¢',
    status: 'Missed target by -28 cents',
  },
  {
    n: '03',
    label: 'ADJUST',
    title: 'Know what to change.',
    body: 'A simple cue turns the reading into the next useful move: raise the tongue arch toward upper molars and slow the breath pressure.',
    value: 'FLAT',
    detail: 'TRY AGAIN',
    cents: 'ADJUST',
    status: 'CUE: Deeper tongue position',
  },
  {
    n: '04',
    label: 'REPEAT',
    title: 'Play it again with context.',
    body: 'That is the loop: play, measure, adjust. Less guessing. Unshakeable control over every draw bend on the instrument.',
    value: '02.0',
    detail: 'SEMITONES TARGET',
    cents: 'LOCKED',
    status: 'Target locked: A4 (-2.0 ST)',
  },
];

export default function BendLab() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: '+=2000',
        pin: '.bend-lab-inner',
        pinSpacing: true,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          const stepIndex = Math.min(
            steps.length - 1,
            Math.floor(self.progress * steps.length)
          );
          setActiveStepIndex(stepIndex);
        },
      });

      if (progress.current) {
        gsap.fromTo(
          progress.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: 'left center',
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top top', end: '+=2000', scrub: true },
          }
        );
      }

      gsap.to('.lab-orbit.orbit-a', { rotation: 360, duration: 28, repeat: -1, ease: 'none' });
      gsap.to('.lab-orbit.orbit-b', { rotation: -360, duration: 36, repeat: -1, ease: 'none' });
      gsap.to('.lab-scan', { yPercent: 200, duration: 3.2, repeat: -1, ease: 'none' });
    }, el);

    return () => ctx.revert();
  }, []);

  const jumpToStep = (index: number) => {
    setActiveStepIndex(index);
    audioEngine.playClick(750 + index * 100, 'click');
  };

  const currentStep = steps[activeStepIndex] || steps[0];

  return (
    <section ref={root} className="bend-lab" id="how">
      <div className="bend-lab-grid" />
      <div className="lab-progress"><span ref={progress} /></div>
      <div className="wrap bend-lab-inner">
        <div className="lab-head">
          <div>
            <span className="eyebrow" style={{ color: 'var(--gold)' }}>A BEND, MEASURED IN THE MOMENT</span>
            <h2 className="display">Stop guessing.<br /><em>Start seeing.</em></h2>
          </div>
          <p>Scroll through the loop or tap any stage. Watch one bend become actionable real-time feedback.</p>
        </div>

        <div className="lab-stage-grid">
          {/* Left Column: Interactive Steps & Current Panel */}
          <div className="lab-copy-col">
            <div className="lab-rail" aria-label="Ratatune bend process">
              {steps.map((s, i) => (
                <button
                  key={s.n}
                  className={`lab-step ${activeStepIndex === i ? 'is-active' : ''}`}
                  type="button"
                  onClick={() => jumpToStep(i)}
                  aria-label={`${s.n} ${s.label}`}
                >
                  <span>{s.n}</span>
                  <strong>{s.label}</strong>
                </button>
              ))}
            </div>

            <div className="lab-kicker">
              LIVE BEND CHECK / <span>3 HOLE DRAW (KEY OF C)</span>
            </div>

            <div className="lab-panel-active" key={currentStep.n}>
              <h3>{currentStep.title}</h3>
              <p>{currentStep.body}</p>
              <div className="lab-metric">
                <strong>{currentStep.value}</strong>
                <span>{currentStep.detail}</span>
              </div>
              <div className="lab-status-tag">
                <span className="dot" />
                <span>{currentStep.status}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Full 100% Unclipped Phone Showcase */}
          <div className="lab-phone-col">
            <div className="lab-phone-wrapper">
              <div className="phone-bezel">
                <Image
                  src="/phone.jpg"
                  alt="Ratatune live 3 hole draw bend reading"
                  width={340}
                  height={680}
                  priority
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
                <div className="lab-scan" />
              </div>
              <div className="phone-glow" />
            </div>
            <div className="lab-orbit orbit-a" />
            <div className="lab-orbit orbit-b" />
          </div>
        </div>

        <div className="lab-foot">
          <span>Target <b>−2.0 semitones (A4)</b></span>
          <span>Actual <b>−1.6 semitones (447.2 Hz)</b></span>
          <span>Difference <b>−28 cents from target</b></span>
        </div>
      </div>
    </section>
  );
}

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
  const phone = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = root.current;
    const stageEl = stage.current;
    if (!el || !stageEl) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=2400',
          pin: '.bend-lab-inner',
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      panels.current.forEach((panel, index) => {
        if (!panel) return;
        gsap.set(panel, {
          autoAlpha: index === 0 ? 1 : 0,
          y: index === 0 ? 0 : 30,
          scale: index === 0 ? 1 : 0.98,
        });
      });

      steps.forEach((_, index) => {
        if (index > 0) {
          const previous = panels.current[index - 1];
          const current = panels.current[index];
          if (previous && current) {
            tl.to(
              previous,
              { autoAlpha: 0, y: -30, scale: 0.97, duration: 0.14, ease: 'power2.in' },
              index * 0.25 - 0.05
            ).fromTo(
              current,
              { autoAlpha: 0, y: 30, scale: 0.98 },
              { autoAlpha: 1, y: 0, scale: 1, duration: 0.18, ease: 'power3.out' },
              index * 0.25
            );
          }
          if (phone.current) {
            tl.to(
              phone.current,
              {
                y: index % 2 ? -20 : 15,
                x: index % 2 ? 12 : -10,
                rotate: index % 2 ? 1.6 : -1.2,
                scale: 1 + index * 0.015,
                duration: 0.25,
                ease: 'power2.inOut',
              },
              index * 0.25
            );
          }
        }
        tl.call(
          () => {
            setActiveStepIndex(index);
            stepRefs.current.forEach((button, buttonIndex) =>
              button?.classList.toggle('is-active', buttonIndex === index)
            );
          },
          [],
          index * 0.25 + 0.01
        );
      });

      if (progress.current) {
        gsap.fromTo(
          progress.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: 'left center',
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top top', end: '+=2400', scrub: true },
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
    panels.current.forEach((panel, pIdx) => {
      if (!panel) return;
      if (pIdx === index) {
        gsap.to(panel, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' });
      } else {
        gsap.to(panel, { autoAlpha: 0, y: pIdx < index ? -20 : 20, scale: 0.98, duration: 0.25 });
      }
    });
    stepRefs.current.forEach((button, bIdx) => {
      button?.classList.toggle('is-active', bIdx === index);
    });
  };

  return (
    <section ref={root} className="bend-lab" id="how">
      <div className="bend-lab-grid" />
      <div className="lab-progress"><span ref={progress} /></div>
      <div className="wrap bend-lab-inner">
        <div className="lab-head">
          <div>
            <span className="eyebrow">A bend, measured in the moment</span>
            <h2 className="display">Stop guessing.<br /><em>Start seeing.</em></h2>
          </div>
          <p>Scroll through the loop or tap any stage. Watch one bend become actionable real-time feedback.</p>
        </div>

        <div ref={stage} className="lab-stage">
          <div className="lab-rail" aria-label="Ratatune bend process">
            {steps.map((s, i) => (
              <button
                key={s.n}
                ref={(node) => { stepRefs.current[i] = node; }}
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

          <div className="lab-copy">
            <div className="lab-kicker">
              LIVE BEND CHECK / <span>3 HOLE DRAW (KEY OF C)</span>
            </div>
            <div className="lab-panels">
              {steps.map((s, i) => (
                <div className="lab-panel" key={s.n} ref={(node) => { panels.current[i] = node; }}>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  <div className="lab-metric">
                    <strong>{s.value}</strong>
                    <span>{s.detail}</span>
                  </div>
                  <div className="lab-status-tag">
                    <span className="dot" />
                    <span>{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lab-phone" ref={phone}>
            <div className="phone-bezel">
              <Image
                src="/phone.jpg"
                alt="Ratatune live 3 hole draw bend reading"
                fill
                sizes="(max-width: 800px) 72vw, 360px"
              />
              <div className="lab-scan" />
            </div>
            <div className="phone-glow" />
          </div>
          <div className="lab-orbit orbit-a" />
          <div className="lab-orbit orbit-b" />
          <div className="lab-cursor"><span /> LIVE ENGINE</div>
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

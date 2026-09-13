'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import SmoothScroll from './SmoothScroll';
import Reveal from './Reveal';
import LeadModal from './LeadModal';
import Harmonica3D from './Harmonica3D';
import BendLab from './BendLab';
import InteractiveBendTuner from './InteractiveBendTuner';
import HarmonicaExplorer from './HarmonicaExplorer';
import EmbouchureVisualizer from './EmbouchureVisualizer';
import BluesLickPlayer from './BluesLickPlayer';
import BendEarChallenge from './BendEarChallenge';
import PositionCalculator from './PositionCalculator';
import CursorGlow from './CursorGlow';
import { audioEngine } from './AudioEngine';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const featureCards = [
  {
    n: '01',
    title: 'Bends, measured.',
    copy: 'See how far each draw bend lands, in precise cents from the diatonic target.',
    visual: 'target',
    badge: 'ST & CENTS',
  },
  {
    n: '02',
    title: 'Tone and breath.',
    copy: 'Notice embouchure wobble, then make a smaller, more controlled tongue adjustment.',
    visual: 'wave',
    badge: 'ACOUSTIC FORMANT',
  },
  {
    n: '03',
    title: 'Kind, honest coaching.',
    copy: 'No punitive streak guilt. Just the exact next throat/tongue cue worth trying.',
    visual: 'coach',
    badge: 'AI CUES',
  },
];

export default function Page() {
  const [open, setOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, 80]);
  const signal = useRef<HTMLDivElement>(null);

  const toggleAudioMute = () => {
    const nextMute = !isAudioMuted;
    setIsAudioMuted(nextMute);
    audioEngine.setMuted(nextMute);
    if (!nextMute) {
      audioEngine.playClick(880, 'lock');
    }
  };

  const playHeroDemoSound = () => {
    audioEngine.playHarmonicaTone(493.88, -228, 1.8);
  };

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = signal.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to('.signal-line', {
        xPercent: -20,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
      gsap.to('.signal-dot', {
        x: 160,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 20%', scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div className="page">
      <SmoothScroll />
      <CursorGlow />
      <div className="grain" />

      {/* Persistent Glass Navigation */}
      <header className="nav">
        <a href="#top" className="brand">
          <span className="brand-mark">R</span>
          <span>
            Ratatune <small>pre-launch</small>
          </span>
        </a>
        <nav className="navlinks">
          <a href="#tuner">Live Tuner</a>
          <a href="#embouchure">Mouth Physics</a>
          <a href="#ear-test">Ear Game</a>
          <a href="#licks">Blues Tabs</a>
          <a href="#instrument">10-Hole Reeds</a>
          <a href="#positions">Positions</a>
          <a href="#proof">Proof</a>
        </nav>
        <div className="nav-right">
          <button
            type="button"
            className={`audio-toggle-btn ${isAudioMuted ? 'is-muted' : ''}`}
            onClick={toggleAudioMute}
            title={isAudioMuted ? 'Turn Sound ON' : 'Mute Sound'}
          >
            <span className="sound-bars" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>{isAudioMuted ? 'Audio OFF' : 'Audio ON'}</span>
          </button>
          <button className="navcta" onClick={() => setOpen(true)}>
            Get Early Access <span>↗</span>
          </button>
        </div>
      </header>

      <main id="top">
        {/* 1. Hero Section */}
        <section className="hero-v2">
          <div className="hero-noise" />
          <div className="hero-glow hero-glow-a" />
          <div className="hero-glow hero-glow-b" />
          <div className="hero-orbit" aria-hidden="true" />
          <div className="wrap hero-v2-grid">
            <div className="hero-v2-copy">
              <Reveal>
                <div className="hero-tag">
                  <span className="pulse" />
                  <span>AI that listens · harmonica bend accuracy</span>
                </div>
              </Reveal>
              <Reveal>
                <h1 className="display hero-title">
                  Finally hear whether your <em>bends</em> are actually in tune.
                </h1>
              </Reveal>
              <Reveal>
                <p className="hero-lede">
                  You already know how to bend. Ratatune listens through the microphone and shows you exactly where the pitch landed — in the moment, with a number you can use.
                </p>
              </Reveal>
              <Reveal>
                <div className="hero-actions">
                  <button className="btn btn-primary" onClick={() => setOpen(true)}>
                    Get Early Access <span>↗</span>
                  </button>
                  <a className="btn btn-secondary" href="#tuner">
                    <span>⚡ Try Interactive Tuner</span>
                  </a>
                  <button type="button" className="text-link" onClick={playHeroDemoSound}>
                    <span>▶ Play −28¢ Bend Sample</span>
                  </button>
                </div>
              </Reveal>
              <Reveal>
                <div className="hero-proof">
                  <span><b>−28 cents</b> from target</span>
                  <span>3 hole draw bend</span>
                  <span>pre-launch / founding access</span>
                </div>
              </Reveal>
            </div>

            <motion.div className="hero-v2-media" style={{ y: heroY }}>
              <Harmonica3D />
            </motion.div>
          </div>
          <div className="hero-bottom">
            <div>01 / 09 · ACOUSTIC REED ANALYSIS</div>
            <div className="hero-scroll">
              <span /> Scroll to explore the interactive physics
            </div>
            <div>Ratatune / USA · UK</div>
          </div>
        </section>

        {/* 2. Statement Section */}
        <section className="statement" id="why">
          <div className="wrap statement-inner">
            <Reveal>
              <div className="statement-index">The problem / 01</div>
            </Reveal>
            <Reveal>
              <h2 className="display">
                A clean bend is <em>hard to hear</em> while you're the one playing it.
              </h2>
            </Reveal>
            <Reveal>
              <p>
                Unlike a fretted guitar or piano key, there is nothing mechanical to look at. You alter breath and oral resonance, then must judge from internal bone conduction alone whether the pitch reached the true semitone.
              </p>
            </Reveal>
          </div>
          <div className="statement-spark" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="statement-rail">
            <span>BREATH PRESSURE</span>
            <i />
            <span>ORAL CAVITY</span>
            <i />
            <span>COUPLED REEDS</span>
            <i />
            <span>CENT ACCURACY</span>
          </div>
        </section>

        {/* 3. Signal Section */}
        <section className="signal-section" ref={signal}>
          <div className="wrap signal-wrap">
            <div className="signal-copy">
              <span className="eyebrow">What your ear is trying to catch</span>
              <h2 className="display">
                From a sound<br />
                to a <em>number.</em>
              </h2>
              <p>
                Ratatune listens while you draw and compares your tone to the harmonic center: target pitch, actual frequency, cent discrepancy, and a practical embouchure cue.
              </p>
            </div>
            <div className="signal-visual">
              <div className="signal-grid" />
              <div className="signal-line">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="signal-dot" />
              <div className="signal-label label-target">
                TARGET NOTE
                <br />
                <b>−2.0 ST</b>
              </div>
              <div className="signal-label label-actual">
                ACTUAL PITCH
                <br />
                <b>−1.6 ST</b>
              </div>
              <div className="signal-center">
                0¢ <small>IN TUNE SWEET SPOT</small>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Flagship Feature 1: Live Interactive Bend Sandbox & 60FPS Waterfall */}
        <section className="interactive-sandbox-section" id="tuner">
          <div className="wrap">
            <div className="sandbox-intro">
              <Reveal>
                <span className="eyebrow">Interactive Harmonica Tuner & Sandbox</span>
                <h2 className="display">
                  Experience the bend engine <em>in real time.</em>
                </h2>
              </Reveal>
              <Reveal>
                <p>
                  Drag the embouchure lever below to hear the harmonica bend pitch glide, inspect the live 60fps spectral waterfall, and see the AI feedback cue update instantly.
                </p>
              </Reveal>
            </div>
            <InteractiveBendTuner />
          </div>
        </section>

        {/* 5. Flagship Feature 2: Embouchure & Oral Cavity Physics Visualizer */}
        <section className="interactive-sandbox-section" id="embouchure" style={{ background: '#0b130e' }}>
          <div className="wrap">
            <EmbouchureVisualizer />
          </div>
        </section>

        {/* 6. Bend Lab: Pinned Scroll Choreography */}
        <BendLab />

        {/* 7. Flagship Feature 3: Ear Training & Blind Bend Challenge */}
        <section className="interactive-sandbox-section" id="ear-test" style={{ background: '#0e1611' }}>
          <div className="wrap">
            <BendEarChallenge />
          </div>
        </section>

        {/* 8. Flagship Feature 4: Interactive Blues Lick Player & Rolling Tab Visualizer */}
        <section className="interactive-sandbox-section" id="licks" style={{ background: '#09100c' }}>
          <div className="wrap">
            <BluesLickPlayer />
          </div>
        </section>

        {/* 9. Feature Story Section */}
        <section className="feature-story">
          <div className="wrap">
            <div className="feature-intro">
              <Reveal>
                <span className="eyebrow">Built around the instrument</span>
                <h2 className="display">
                  Not “music practice.”<br />
                  <em>Bend practice.</em>
                </h2>
              </Reveal>
              <Reveal>
                <p>
                  Every measurement starts with the question a harmonica player actually has after a phrase: <strong>where did my bend land?</strong>
                </p>
              </Reveal>
            </div>
            <div className="feature-cards">
              {featureCards.map((f, i) => (
                <Reveal key={f.n}>
                  <article className={`feature-card-v2 card-${i}`}>
                    <div className="card-top">
                      <span>{f.n}</span>
                      <span className="card-badge">{f.badge}</span>
                    </div>
                    <div className={`card-visual visual-${f.visual}`}>
                      {f.visual === 'target' && (
                        <>
                          <div className="target-ring ring-1" />
                          <div className="target-ring ring-2" />
                          <div className="target-point" />
                        </>
                      )}
                      {f.visual === 'wave' && (
                        <div className="wave">
                          <i />
                          <i />
                          <i />
                          <i />
                          <i />
                          <i />
                          <i />
                          <i />
                          <i />
                        </div>
                      )}
                      {f.visual === 'coach' && (
                        <>
                          <div className="coach-bubble">A little flat (−28¢).</div>
                          <div className="coach-bubble second">Raise tongue arch.</div>
                        </>
                      )}
                    </div>
                    <div className="card-copy">
                      <h3>{f.title}</h3>
                      <p>{f.copy}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 10. Flagship Feature 5: Interactive 10-Hole Reed Explorer */}
        <section className="instrument-section" id="instrument">
          <div className="wrap">
            <div className="instrument-grid">
              <Reveal>
                <div className="instrument-copy">
                  <span className="eyebrow">The nuance is in the draw</span>
                  <h2 className="display">
                    You know the note.<br />
                    <em>Now explore the reeds.</em>
                  </h2>
                  <p>
                    A bend is mouth shape, breath pressure, and coupled reed physics occurring simultaneously. Ratatune is designed specifically for diatonic reeds — not an acoustic guitar tuner reskinned with a harmonica photo.
                  </p>
                  <button className="btn btn-primary" onClick={() => setOpen(true)}>
                    Get Early Access ↗
                  </button>
                </div>
              </Reveal>
              <Reveal>
                <div className="instrument-media">
                  <Image
                    src="/harmonica.jpg"
                    alt="Chrome harmonica on wood"
                    width={1536}
                    height={1068}
                    sizes="(max-width: 900px) 100vw, 55vw"
                  />
                  <div className="instrument-label">
                    <span>10-HOLE DIATONIC / RICHTER TUNING</span>
                    <b>The expressive core</b>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="explorer-mount-box">
              <HarmonicaExplorer />
            </div>
          </div>
        </section>

        {/* 11. Flagship Feature 6: Cross-Harp & Position Calculator */}
        <section className="interactive-sandbox-section" id="positions" style={{ background: '#0b120d' }}>
          <div className="wrap">
            <PositionCalculator />
          </div>
        </section>

        {/* 12. Real Product Proof Section */}
        <section className="proof-v2" id="proof">
          <div className="wrap proof-v2-head">
            <Reveal>
              <span className="eyebrow">The proof</span>
              <h2 className="display">
                A real reading<br />
                <em>beats a big claim.</em>
              </h2>
            </Reveal>
            <Reveal>
              <p>
                The supplied product screen illustrates the clarity Ratatune provides: <b>−28 cents</b> on a 3 hole draw bend, accompanied by a plain-English correction.
              </p>
            </Reveal>
          </div>
          <div className="wrap proof-stage">
            <div className="proof-phone">
              <Image
                src="/phone.jpg"
                alt="Ratatune 3 Hole Draw Bend reading of minus 28 cents"
                fill
                sizes="(max-width: 900px) 86vw, 470px"
              />
            </div>
            <div className="proof-notes">
              <div className="proof-note">
                <span>01</span>
                <strong>Target Note</strong>
                <p>Where the harmonic bend should land (e.g. A4 / −2.0 ST).</p>
              </div>
              <div className="proof-note">
                <span>02</span>
                <strong>−28 cents</strong>
                <p>The exact acoustic deviation measured from the microphone.</p>
              </div>
              <div className="proof-note">
                <span>03</span>
                <strong>Next move</strong>
                <p>“Try a stronger bend with slower, warmer breath.”</p>
              </div>
            </div>
          </div>
          <div className="wrap full-width-dashboard">
            <div className="dashboard-topbar">
              <div className="dashboard-brand">
                <span className="dashboard-dot" />
                <span className="eyebrow" style={{ color: 'var(--gold)' }}>ACOUSTIC REED SPECTROGRAPH · HOLE 3 DRAW</span>
              </div>
              <div className="scorecard-badge">
                <span>−28¢ CALIBRATION LOCK</span>
              </div>
            </div>
            <div className="dashboard-cols">
              <div className="dashboard-waveform">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#8ea092' }}>
                  <span>RESONANT HARMONIC SPECTRUM</span>
                  <span style={{ color: 'var(--gold)', fontWeight: 700 }}>447.2 Hz / TARGET 493.9 Hz</span>
                </div>
                <div className="wave-bars-flex">
                  <div className="wave-bar-unit" style={{ height: '35%' }} />
                  <div className="wave-bar-unit" style={{ height: '55%' }} />
                  <div className="wave-bar-unit" style={{ height: '85%' }} />
                  <div className="wave-bar-unit" style={{ height: '100%', background: 'var(--gold)' }} />
                  <div className="wave-bar-unit" style={{ height: '70%' }} />
                  <div className="wave-bar-unit" style={{ height: '90%' }} />
                  <div className="wave-bar-unit" style={{ height: '60%' }} />
                  <div className="wave-bar-unit" style={{ height: '40%' }} />
                  <div className="wave-bar-unit" style={{ height: '25%' }} />
                </div>
              </div>
              <div className="dashboard-controls">
                <div className="cue-box">
                  <strong>PRACTICAL EMBOUCHURE CUE</strong>
                  <p>“Slightly flat by −28 cents. Lift the back of your tongue toward the upper rear molars and slow your draw breath.”</p>
                </div>
                <button 
                  type="button"
                  className="btn btn-secondary" 
                  onClick={playHeroDemoSound}
                  style={{ width: '100%' }}
                >
                  <span>▶ Play −28¢ Harmonic Tone</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 13. Campaign Promise Bento Scorecard (100% Full-Width) */}
        <section className="brief-signal">
          <div className="wrap">
            <Reveal>
              <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
                <span className="eyebrow" style={{ color: 'var(--gold)' }}>PROMISE VERIFIED BY ACOUSTICS</span>
                <h2 className="display" style={{ margin: '14px 0 16px' }}>
                  The page never loses <em>the bend.</em>
                </h2>
                <p style={{ color: '#a4b5a7', lineHeight: 1.6 }}>
                  From the initial blow to full whole-step draws, Ratatune is the single source of truth for honest diatonic pitch accuracy.
                </p>
              </div>
            </Reveal>
            <Reveal>
              <div className="full-width-scorecard">
                <div className="scorecard-header">
                  <div className="scorecard-badge">
                    <span>AI LISTENS · HARMONIC SCORECARD</span>
                  </div>
                  <div className="scorecard-meta">
                    FOUNDING PRE-LAUNCH ACCESS · 2026 EDITION
                  </div>
                </div>
                <div className="scorecard-grid">
                  <div className="scorecard-card">
                    <span className="scorecard-card-tag">01 · ACCURACY</span>
                    <div className="scorecard-card-val">−28<em>cents</em></div>
                    <div className="scorecard-card-desc">
                      Real-time microphone analysis tracks every draw semitone deviation down to 1 cent resolution.
                    </div>
                  </div>
                  <div className="scorecard-card">
                    <span className="scorecard-card-tag">02 · MOUTH PHYSICS</span>
                    <div className="scorecard-card-val">A4<em>resonant</em></div>
                    <div className="scorecard-card-desc">
                      Acoustic formant mapping instantly connects pitch deviation with tongue arch and throat depth cues.
                    </div>
                  </div>
                  <div className="scorecard-card">
                    <span className="scorecard-card-tag">03 · COACHING</span>
                    <div className="scorecard-card-val">100%<em>kind</em></div>
                    <div className="scorecard-card-desc">
                      No streak guilt or generic gamification. Just the exact next physical adjustment to dial your bend into tune.
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 14. Pre-launch Honesty Section */}
        <section className="honesty">
          <div className="wrap honesty-grid">
            <Reveal>
              <div>
                <span className="eyebrow">Pre-launch, on purpose</span>
                <h2 className="display">
                  Confidence without<br />
                  <em>pretending it's finished.</em>
                </h2>
              </div>
            </Reveal>
            <Reveal>
              <div className="honesty-copy">
                <p>
                  Ratatune is currently in private pre-launch development. This page is an invitation to intermediate and advanced players who want to shape the first release.
                </p>
                <div className="honesty-line">
                  <span>FOUNDING ACCESS</span>
                  <span>NO PRICE SHOWN</span>
                  <span>ZERO SPAM</span>
                </div>
                <button className="btn btn-primary" onClick={() => setOpen(true)}>
                  Get Early Access ↗
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 15. Final CTA Section */}
        <section className="final-v2">
          <div className="final-orbit" />
          <div className="wrap">
            <Reveal>
              <span className="eyebrow">Ratatune / founding access</span>
              <h2 className="display">
                Your bends are<br />
                <em>closer than you think.</em>
              </h2>
              <p>Play the bend. See where it landed. Know what to adjust next.</p>
              <button className="btn btn-primary btn-large" onClick={() => setOpen(true)}>
                Get Early Access <span>↗</span>
              </button>
              <div className="final-meta">
                No credit card required. No app-store link yet. Just founding access.
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <LeadModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

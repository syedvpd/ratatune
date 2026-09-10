# Ratatune — Premium Pre-Launch Landing Page

A handcrafted, product-specific landing-page concept for Ratatune's harmonica bend-accuracy experiment.

## Experience direction

The page is designed as a continuous visual story rather than a generic SaaS landing page:

1. **Immediate promise** — “Finally hear whether your bends are actually in tune.” with real product evidence.
2. **Curiosity** — the visitor is shown why a bend is difficult to judge while playing it.
3. **Signal** — sound becomes a measurable target/actual difference.
4. **Bend Lab** — a pinned GSAP sequence turns PLAY → MEASURE → ADJUST → REPEAT into an interactive narrative.
5. **Instrument specificity** — harmonica, draw bends, breath and embouchure remain central.
6. **Proof** — the supplied Ratatune product screen is treated as evidence, including the real −28 cents reading.
7. **Honest conversion** — one CTA, “Get Early Access,” with a two-field pre-launch capture modal.

## Motion stack

- Lenis for smooth scrolling.
- GSAP + ScrollTrigger for pinned storytelling, scroll-linked progress, transitions and ambient motion.
- Motion for the lead-capture modal.
- CSS motion for subtle orbital backgrounds, signal drift, scan light and micro-interactions.
- `prefers-reduced-motion` disables continuous decorative animation and preserves readable content.

## Assets

All supplied visual assets remain in `public/`:

- `bend-accuracy.jpg`
- `phone.jpg`
- `harmonica.jpg`
- `reference-dashboard.jpg`
- `brief-scorecard.jpg`

## Run

```bash
npm install
npm run dev
```

For production:

```bash
npm run build
npm start
```

The environment used to prepare this source had a package-download timeout, so a full dependency-backed Next production build could not be honestly reported as executed here. A TypeScript/TSX syntax-level transpilation check and ZIP integrity check were completed successfully.

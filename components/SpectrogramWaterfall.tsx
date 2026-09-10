'use client';

import { useEffect, useRef } from 'react';
import { audioEngine } from './AudioEngine';

export default function SpectrogramWaterfall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animId: number;
    const analyser = audioEngine.getAnalyser();
    const bufferLength = analyser ? analyser.frequencyBinCount : 512;
    const freqData = new Uint8Array(bufferLength);

    // Offscreen canvas for fast scrolling history
    const width = canvas.width;
    const height = canvas.height;

    const render = () => {
      // Shift existing image down by 2 pixels (waterfall effect)
      ctx.drawImage(canvas, 0, 0, width, height - 2, 0, 2, width, height - 2);

      if (analyser) {
        analyser.getByteFrequencyData(freqData);

        // Draw the top 2-pixel row based on frequency spectrum
        const sliceWidth = width / 120; // focus on the lower/mid audible spectrum for harp

        for (let i = 0; i < 120; i++) {
          const value = freqData[i * 2]; // 0 to 255
          const intensity = value / 255;

          if (intensity > 0.05) {
            // Color gradient: deep green/amber/gold/white for strong peaks
            const r = Math.floor(Math.min(255, intensity * 260 + 30));
            const g = Math.floor(Math.min(255, intensity * 210 + (intensity > 0.7 ? 50 : 0)));
            const b = Math.floor(Math.min(255, intensity * 90));
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          } else {
            ctx.fillStyle = 'rgba(10, 16, 12, 1)';
          }

          ctx.fillRect(i * sliceWidth, 0, sliceWidth + 0.5, 2);
        }
      } else {
        // Idle ambient scan
        const time = Date.now() * 0.002;
        ctx.fillStyle = 'rgba(10, 16, 12, 0.9)';
        ctx.fillRect(0, 0, width, 2);

        for (let i = 0; i < width; i += 40) {
          const wave = Math.sin(i * 0.05 + time);
          if (wave > 0.7) {
            ctx.fillStyle = 'rgba(245, 194, 83, 0.35)';
            ctx.fillRect(i, 0, 30, 2);
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="spectrogram-shell">
      <div className="spectrogram-meta">
        <div className="spec-title">
          <span className="live-dot" />
          <span>60FPS REAL-TIME SPECTRAL WATERFALL / HARMONIC OVERTONES</span>
        </div>
        <div className="spec-ranges">
          <span>200 Hz</span>
          <span>440 Hz (A4)</span>
          <span>880 Hz (A5)</span>
          <span>1.7 kHz</span>
          <span>3.5 kHz</span>
        </div>
      </div>
      <canvas ref={canvasRef} width={640} height={140} className="waterfall-canvas" />
    </div>
  );
}

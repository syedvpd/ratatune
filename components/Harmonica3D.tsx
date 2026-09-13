'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { audioEngine } from './AudioEngine';

// 10-Hole Diatonic in Key of C frequencies (Hz)
const HOLE_NOTES = [
  { hole: 1, blow: 'C4', blowHz: 261.63, draw: 'D4', drawHz: 293.66 },
  { hole: 2, blow: 'E4', blowHz: 329.63, draw: 'G4', drawHz: 392.00 },
  { hole: 3, blow: 'G4', blowHz: 392.00, draw: 'B4', drawHz: 493.88 },
  { hole: 4, blow: 'C5', blowHz: 523.25, draw: 'D5', drawHz: 587.33 },
  { hole: 5, blow: 'E5', blowHz: 659.25, draw: 'F5', drawHz: 698.46 },
  { hole: 6, blow: 'G5', blowHz: 783.99, draw: 'A5', drawHz: 880.00 },
  { hole: 7, blow: 'C6', blowHz: 1046.50, draw: 'B5', drawHz: 987.77 },
  { hole: 8, blow: 'E6', blowHz: 1318.51, draw: 'D6', drawHz: 1174.66 },
  { hole: 9, blow: 'G6', blowHz: 1567.98, draw: 'F6', drawHz: 1396.91 },
  { hole: 10, blow: 'C7', blowHz: 2093.00, draw: 'A6', drawHz: 1760.00 },
];

export default function Harmonica3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeHole, setActiveHole] = useState<number>(3);
  const [isRotating360, setIsRotating360] = useState<boolean>(false);
  const [breathMode, setBreathMode] = useState<'draw' | 'blow'>('draw');
  const [centsOffset, setCentsOffset] = useState<number>(-28);
  const rotVelocityRef = useRef<number>(0);
  const targetRotationYRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const prevMouseXRef = useRef<number>(0);

  const playHoleSound = (holeNum: number, mode: 'draw' | 'blow' = breathMode) => {
    setActiveHole(holeNum);
    const data = HOLE_NOTES[holeNum - 1];
    if (!data) return;
    const baseHz = mode === 'draw' ? data.drawHz : data.blowHz;
    // Calculate bent frequency with cents offset for draw bends
    const bentHz = mode === 'draw' ? baseHz * Math.pow(2, centsOffset / 1200) : baseHz;
    audioEngine.playHarmonicaTone(bentHz, centsOffset, 1.4);
  };

  const trigger360Spin = () => {
    setIsRotating360(true);
    rotVelocityRef.current = 0.35;
    audioEngine.playClick(920, 'lock');
    setTimeout(() => setIsRotating360(false), 2400);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 580;
    const height = container.clientHeight || 460;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // Group containing harmonica parts
    const harmonicaGroup = new THREE.Group();
    scene.add(harmonicaGroup);

    // Materials
    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xdedede,
      metalness: 0.94,
      roughness: 0.18,
    });

    const brassPlateMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.28,
    });

    const combMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f2b23,
      metalness: 0.2,
      roughness: 0.5,
    });

    const holeHollowMaterial = new THREE.MeshBasicMaterial({
      color: 0x070b08,
    });

    // Dimensions
    const HARP_WIDTH = 4.2;
    const HARP_HEIGHT = 0.52;
    const HARP_DEPTH = 1.3;

    // 1. Central Comb Body
    const combGeo = new THREE.BoxGeometry(HARP_WIDTH, HARP_HEIGHT * 0.7, HARP_DEPTH * 0.96);
    const combMesh = new THREE.Mesh(combGeo, combMaterial);
    harmonicaGroup.add(combMesh);

    // 2. Brass Reed Plates (Top & Bottom)
    const plateGeo = new THREE.BoxGeometry(HARP_WIDTH + 0.05, 0.04, HARP_DEPTH * 0.98);
    const topPlate = new THREE.Mesh(plateGeo, brassPlateMaterial);
    topPlate.position.y = (HARP_HEIGHT * 0.7) / 2 + 0.02;
    harmonicaGroup.add(topPlate);

    const bottomPlate = new THREE.Mesh(plateGeo, brassPlateMaterial);
    bottomPlate.position.y = -(HARP_HEIGHT * 0.7) / 2 - 0.02;
    harmonicaGroup.add(bottomPlate);

    // 3. Curved Chrome Cover Plates (Top & Bottom)
    const coverGeo = new THREE.CylinderGeometry(0.85, 0.85, HARP_WIDTH + 0.08, 32, 1, false, 0, Math.PI);
    
    // Top Cover
    const topCover = new THREE.Mesh(coverGeo, chromeMaterial);
    topCover.rotation.z = Math.PI / 2;
    topCover.rotation.x = -Math.PI / 2;
    topCover.scale.set(0.75, 0.35, 1);
    topCover.position.set(0, (HARP_HEIGHT / 2) + 0.08, -0.05);
    harmonicaGroup.add(topCover);

    // Bottom Cover
    const bottomCover = new THREE.Mesh(coverGeo, chromeMaterial);
    bottomCover.rotation.z = Math.PI / 2;
    bottomCover.rotation.x = Math.PI / 2;
    bottomCover.scale.set(0.75, 0.35, 1);
    bottomCover.position.set(0, -(HARP_HEIGHT / 2) - 0.08, -0.05);
    harmonicaGroup.add(bottomCover);

    // 4. Diatonic 10 Holes on Front Face
    const holeGroup = new THREE.Group();
    const HOLE_COUNT = 10;
    const holeWidth = 0.22;
    const holeHeight = 0.24;
    const holeSpacing = 0.36;
    const startX = -((HOLE_COUNT - 1) * holeSpacing) / 2;

    const holeMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < HOLE_COUNT; i++) {
      const hGeo = new THREE.BoxGeometry(holeWidth, holeHeight, 0.15);
      const hMat = holeHollowMaterial.clone();
      const hMesh = new THREE.Mesh(hGeo, hMat);
      hMesh.position.set(startX + i * holeSpacing, 0, (HARP_DEPTH * 0.96) / 2 + 0.01);
      hMesh.userData = { holeIndex: i + 1 };
      holeMeshes.push(hMesh);
      holeGroup.add(hMesh);
    }
    harmonicaGroup.add(holeGroup);

    // Screw Accents
    const screwGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 16);
    const screwMat = chromeMaterial;
    const leftScrew = new THREE.Mesh(screwGeo, screwMat);
    leftScrew.position.set(-HARP_WIDTH / 2 + 0.15, topCover.position.y + 0.15, 0);
    harmonicaGroup.add(leftScrew);

    const rightScrew = new THREE.Mesh(screwGeo, screwMat);
    rightScrew.position.set(HARP_WIDTH / 2 - 0.15, topCover.position.y + 0.15, 0);
    harmonicaGroup.add(rightScrew);

    // Lighting (Dark luxury aesthetic)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const goldKeyLight = new THREE.DirectionalLight(0xf5c253, 2.8);
    goldKeyLight.position.set(3, 4, 4);
    scene.add(goldKeyLight);

    const mintFillLight = new THREE.DirectionalLight(0x8ee4af, 1.4);
    mintFillLight.position.set(-4, -2, 2);
    scene.add(mintFillLight);

    const rimLight = new THREE.PointLight(0xffffff, 2.2, 10);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    // Initial angled pose (slight tilt)
    harmonicaGroup.rotation.x = 0.28;
    harmonicaGroup.rotation.y = -0.38;
    harmonicaGroup.rotation.z = 0.08;

    // Interaction handling (Mouse Drag & Spin)
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseXRef.current = e.clientX;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const deltaX = e.clientX - prevMouseXRef.current;
        prevMouseXRef.current = e.clientX;
        rotVelocityRef.current = deltaX * 0.008;
      }
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop with inertia and floating sway
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Apply rotation velocity with damping
      harmonicaGroup.rotation.y += rotVelocityRef.current;
      rotVelocityRef.current *= 0.94;

      // Subtle ambient hover bob
      if (!isDraggingRef.current) {
        harmonicaGroup.position.y = Math.sin(elapsed * 1.8) * 0.06;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 580;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="harmonica-3d-wrapper">
      {/* 3D Viewport */}
      <div 
        ref={mountRef} 
        className="harmonica-canvas-container"
        title="Click and drag to rotate 360°"
      />

      {/* Floating 360 Spin Badge (Ringus style) */}
      <button 
        type="button" 
        className={`spin-360-badge ${isRotating360 ? 'is-spinning' : ''}`}
        onClick={trigger360Spin}
        title="Click for 360° Inspection Tour"
      >
        <span className="spin-icon">↺</span>
        <span>360° Interactive View</span>
      </button>

      {/* Hole Selector Bar */}
      <div className="harmonica-hole-hud">
        <div className="hud-header">
          <div className="hud-title">
            <span className="live-dot" />
            <span>SELECT HOLE TO HEAR RESONANCE</span>
          </div>
          <div className="breath-selector">
            <button 
              type="button"
              className={`breath-pill ${breathMode === 'draw' ? 'active' : ''}`}
              onClick={() => {
                setBreathMode('draw');
                playHoleSound(activeHole, 'draw');
              }}
            >
              Draw (Bendable)
            </button>
            <button 
              type="button"
              className={`breath-pill ${breathMode === 'blow' ? 'active' : ''}`}
              onClick={() => {
                setBreathMode('blow');
                playHoleSound(activeHole, 'blow');
              }}
            >
              Blow
            </button>
          </div>
        </div>

        <div className="holes-grid">
          {HOLE_NOTES.map((item) => (
            <button
              key={item.hole}
              type="button"
              className={`hole-btn ${activeHole === item.hole ? 'active' : ''}`}
              onClick={() => playHoleSound(item.hole)}
            >
              <span className="hole-num">{item.hole}</span>
              <span className="hole-note">{breathMode === 'draw' ? item.draw : item.blow}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

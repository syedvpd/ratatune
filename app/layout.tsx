import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ratatune — Hear Your Bends Honestly | Real-Time Harmonica Accuracy',
  description: 'AI that listens to harmonica draw bends in real-time. See where your pitch landed in cents from the diatonic target. Pre-launch founding access.',
  keywords: ['harmonica', 'pitch bend', 'harmonica tuner', 'blues harp', 'bend accuracy', 'ratatune'],
  openGraph: {
    title: 'Ratatune — Hear Your Bends Honestly',
    description: 'Finally hear whether your harmonica bends are actually in tune.',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

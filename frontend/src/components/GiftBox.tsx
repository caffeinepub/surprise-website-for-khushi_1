import { useEffect, useState } from 'react';

interface GiftBoxProps {
  onClick: () => void;
  isOpening: boolean;
}

export default function GiftBox({ onClick, isOpening }: GiftBoxProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; emoji: string }>>([]);

  useEffect(() => {
    if (isOpening) {
      const emojis = ['✨', '🌸', '💝', '🌟', '💞', '🩷'];
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 1000);
    }
  }, [isOpening]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Glow ring */}
      <div className="absolute inset-0 rounded-full bg-pink-400 opacity-20 blur-2xl scale-150 animate-ping-slow" />

      {/* Burst particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute text-2xl pointer-events-none"
          style={{
            transform: `translate(${p.x}px, ${p.y}px)`,
            animation: 'sparkleBurst 0.8s ease-out forwards',
            zIndex: 20,
          }}
        >
          {p.emoji}
        </span>
      ))}

      {/* Gift Box SVG */}
      <button
        onClick={onClick}
        disabled={isOpening}
        className="relative z-10 cursor-pointer select-none focus:outline-none group"
        aria-label="Open gift box"
        style={{
          animation: isOpening
            ? 'giftOpen 0.8s ease-in-out forwards'
            : 'giftFloat 3s ease-in-out infinite',
          filter: 'drop-shadow(0 8px 24px rgba(255,105,180,0.5))',
        }}
      >
        <svg
          width="160"
          height="160"
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform group-hover:scale-105"
        >
          {/* Box body */}
          <rect x="20" y="75" width="120" height="75" rx="6" fill="#FF69B4" />
          <rect x="20" y="75" width="120" height="75" rx="6" fill="url(#boxGrad)" />

          {/* Box lid */}
          <rect
            x="14"
            y="55"
            width="132"
            height="26"
            rx="6"
            fill="#FF1493"
            style={isOpening ? { animation: 'lidPop 0.6s ease-out forwards' } : {}}
          />

          {/* Ribbon vertical */}
          <rect x="72" y="55" width="16" height="95" fill="#FFB6C1" opacity="0.9" />
          {/* Ribbon horizontal */}
          <rect x="20" y="82" width="120" height="14" fill="#FFB6C1" opacity="0.9" />

          {/* Bow left loop */}
          <ellipse cx="60" cy="48" rx="22" ry="14" fill="#FF1493" transform="rotate(-20 60 48)" />
          <ellipse cx="60" cy="48" rx="14" ry="8" fill="#FF69B4" transform="rotate(-20 60 48)" />

          {/* Bow right loop */}
          <ellipse cx="100" cy="48" rx="22" ry="14" fill="#FF1493" transform="rotate(20 100 48)" />
          <ellipse cx="100" cy="48" rx="14" ry="8" fill="#FF69B4" transform="rotate(20 100 48)" />

          {/* Bow center */}
          <circle cx="80" cy="52" r="10" fill="#FF1493" />
          <circle cx="80" cy="52" r="6" fill="#FFB6C1" />

          {/* Stars on box */}
          <text x="35" y="110" fontSize="16" fill="rgba(255,255,255,0.6)">✦</text>
          <text x="110" y="125" fontSize="12" fill="rgba(255,255,255,0.5)">✦</text>
          <text x="50" y="135" fontSize="10" fill="rgba(255,255,255,0.4)">✦</text>

          <defs>
            <linearGradient id="boxGrad" x1="20" y1="75" x2="140" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF69B4" stopOpacity="0" />
              <stop offset="100%" stopColor="#C71585" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </button>
    </div>
  );
}

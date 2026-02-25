import { useEffect, useState, useRef } from 'react';

const EMOJIS = ['✨', '🌟', '🌺', '💐', '💞', '🩷', '🐱', '🌀', '🌸', '🌈', '🌷', '❤️'];

interface EmojiParticle {
  id: number;
  emoji: string;
  left: number;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
}

interface EmojiRainProps {
  active: boolean;
}

export default function EmojiRain({ active }: EmojiRainProps) {
  const [particles, setParticles] = useState<EmojiParticle[]>([]);
  const counterRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    // Spawn new emojis every 150ms for a lively continuous rain
    intervalRef.current = setInterval(() => {
      const count = Math.floor(Math.random() * 4) + 2;
      const newParticles: EmojiParticle[] = Array.from({ length: count }, () => {
        counterRef.current += 1;
        return {
          id: counterRef.current,
          emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
          left: Math.random() * 100,
          duration: 3 + Math.random() * 5,
          delay: Math.random() * 0.3,
          size: 1.2 + Math.random() * 1.8,
          opacity: 0.6 + Math.random() * 0.4,
        };
      });

      setParticles((prev) => {
        const combined = [...prev, ...newParticles];
        // Keep max 80 particles to avoid DOM overload
        return combined.slice(-80);
      });
    }, 150);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="pointer-events-none overflow-hidden"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 35,
      }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute select-none"
          style={{
            left: `${p.left}%`,
            bottom: '-10%',
            fontSize: `${p.size}rem`,
            opacity: p.opacity,
            animation: `emojiFloat ${p.duration}s ease-in-out ${p.delay}s forwards`,
            filter: 'drop-shadow(0 2px 6px rgba(255,105,180,0.5))',
          }}
          onAnimationEnd={() => {
            setParticles((prev) => prev.filter((x) => x.id !== p.id));
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

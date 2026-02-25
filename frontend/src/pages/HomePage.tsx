import { useState, useCallback } from 'react';
import { Shield } from 'lucide-react';
import EmojiRain from '../components/EmojiRain';
import GiftBox from '../components/GiftBox';
import CameraView from '../components/CameraView';

interface HomePageProps {
  onAdminClick: () => void;
  onCountdownComplete: () => void;
}

export default function HomePage({ onAdminClick, onCountdownComplete }: HomePageProps) {
  const [phase, setPhase] = useState<'idle' | 'opening' | 'camera'>('idle');
  const [showFlash, setShowFlash] = useState(false);

  const handleGiftClick = () => {
    if (phase === 'idle') {
      setPhase('opening');
      setTimeout(() => setPhase('camera'), 800);
    }
  };

  const handleSnapshotFlash = useCallback(() => {
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 300);
  }, []);

  const handleClose = () => {
    setPhase('idle');
  };

  return (
    <div className="relative min-h-screen pink-gradient-bg overflow-hidden flex flex-col items-center justify-center">
      {/* Decorative background circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-pink-300 opacity-20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-pink-400 opacity-20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-pink-200 opacity-10 blur-3xl" />
      </div>

      {/* Admin Shield Button */}
      <button
        onClick={onAdminClick}
        className="absolute top-4 left-4 z-50 p-2 rounded-full bg-white/30 backdrop-blur-sm border border-pink-200 hover:bg-white/50 transition-all duration-200 group shadow-pink"
        title="Admin Panel"
        aria-label="Open Admin Panel"
      >
        <Shield className="w-5 h-5 text-pink-600 group-hover:text-pink-700 transition-colors" />
      </button>

      {/* Camera View (full screen overlay) */}
      {phase === 'camera' && (
        <CameraView
          onClose={handleClose}
          onSnapshotFlash={handleSnapshotFlash}
          onCountdownComplete={onCountdownComplete}
        />
      )}

      {/* Snapshot Flash Effect */}
      {showFlash && (
        <div className="fixed inset-0 z-[200] bg-white pointer-events-none snapshot-flash" />
      )}

      {/* Home Content (hidden when camera is active) */}
      {phase !== 'camera' && (
        <main className="relative z-10 flex flex-col items-center justify-center gap-6 px-4 text-center">
          {/* Khushi Heading */}
          <div className="relative">
            <h1
              className="font-dancing text-8xl md:text-9xl font-bold text-pink-600 select-none"
              style={{
                animation: 'glowPulse 3s ease-in-out infinite',
                textShadow: '0 0 20px rgba(255,105,180,0.8), 0 0 40px rgba(255,105,180,0.5), 0 0 80px rgba(255,20,147,0.3)',
              }}
            >
              Khushi
            </h1>
            {/* Sparkle decorations */}
            <span className="absolute -top-4 -right-4 text-2xl animate-spin-slow">✨</span>
            <span className="absolute -bottom-2 -left-6 text-xl animate-bounce">🌸</span>
          </div>

          {/* Sub-heading */}
          <p className="font-quicksand text-xl md:text-2xl text-pink-500 font-medium tracking-wide">
            A surprise by{' '}
            <span className="font-dancing text-2xl md:text-3xl font-bold text-pink-600">
              Akash
            </span>{' '}
            💝
          </p>

          {/* Gift Box */}
          <div className="mt-4">
            <GiftBox
              onClick={handleGiftClick}
              isOpening={phase === 'opening'}
            />
          </div>

          <p className="font-quicksand text-sm text-pink-400 animate-pulse mt-2">
            Tap the gift to reveal your surprise ✨
          </p>
        </main>
      )}

      {/* Footer */}
      {phase !== 'camera' && (
        <footer className="absolute bottom-4 left-0 right-0 text-center z-10">
          <p className="text-xs text-pink-400 font-quicksand">
            Built with{' '}
            <span className="text-pink-500">♥</span>{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'surprise-website-khushi')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-600 underline underline-offset-2 transition-colors"
            >
              caffeine.ai
            </a>
            {' '}· © {new Date().getFullYear()}
          </p>
        </footer>
      )}
    </div>
  );
}

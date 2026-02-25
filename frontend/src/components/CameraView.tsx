import { useEffect, useRef, useCallback, useState } from 'react';
import { X, Camera } from 'lucide-react';
import { useCamera } from '../camera/useCamera';
import EmojiRain from './EmojiRain';

const SNAPSHOT_BUFFER_SIZE = 20;
const SNAPSHOT_KEY_PREFIX = 'snapshot_';
const SNAPSHOT_INDEX_KEY = 'snapshot_index';
const SNAPSHOT_COUNT_KEY = 'snapshot_count';

const CAPTURE_THROTTLE_MS = 500;
const COUNTDOWN_START = 10;

const COMPLIMENTS = [
  'You are so sweet 💕',
  'You are beautiful 🌸',
  'Wow ✨',
  'You are so sweet',
  'You are beautiful',
  'Wow',
  'love 💖',
  'OMG 😍',
  '🩷🩷🩷🩷🩷',
  '✨✨✨✨',
  '💐💐💐💐',
  '🌼🌼🌼🌼🌼🌼🌼🌼',
  'cool 😎',
];

interface FloatingMessage {
  id: number;
  text: string;
  x: number;
  y: number;
  duration: number;
  delay: number;
  driftX: number;
}

interface CameraViewProps {
  onClose: () => void;
  onSnapshotFlash: () => void;
  onCountdownComplete: () => void;
}

export default function CameraView({ onClose, onSnapshotFlash, onCountdownComplete }: CameraViewProps) {
  const { isActive, error, isLoading, startCamera, stopCamera, videoRef, canvasRef } = useCamera({
    facingMode: 'user',
    width: 1280,
    height: 720,
    quality: 0.6,
    format: 'image/jpeg',
  });

  const snapshotIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messageIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastCaptureTimeRef = useRef<number>(0);
  const messageCounterRef = useRef(0);
  const countdownCompleteRef = useRef(false);

  const [snapshotCount, setSnapshotCount] = useState(0);
  const [floatingMessages, setFloatingMessages] = useState<FloatingMessage[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Save snapshot to LocalStorage with rolling buffer
  const saveSnapshot = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !isActive) return;

    const now = Date.now();
    if (now - lastCaptureTimeRef.current < CAPTURE_THROTTLE_MS) return;
    lastCaptureTimeRef.current = now;

    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.5);

      const rawIndex = localStorage.getItem(SNAPSHOT_INDEX_KEY);
      const currentIndex = rawIndex ? parseInt(rawIndex, 10) : 0;
      const nextIndex = (currentIndex + 1) % SNAPSHOT_BUFFER_SIZE;

      const key = `${SNAPSHOT_KEY_PREFIX}${nextIndex}`;
      localStorage.setItem(key, dataUrl);
      localStorage.setItem(SNAPSHOT_INDEX_KEY, String(nextIndex));

      const rawCount = localStorage.getItem(SNAPSHOT_COUNT_KEY);
      const currentCount = rawCount ? parseInt(rawCount, 10) : 0;
      const newCount = Math.min(currentCount + 1, SNAPSHOT_BUFFER_SIZE);
      localStorage.setItem(SNAPSHOT_COUNT_KEY, String(newCount));

      setSnapshotCount(newCount);
      onSnapshotFlash();
    } catch (_e) {
      // Quota exceeded or other error — silently ignore
    }
  }, [isActive, videoRef, canvasRef, onSnapshotFlash]);

  // Spawn a floating message at a random position
  const spawnMessage = useCallback(() => {
    messageCounterRef.current += 1;
    const newMsg: FloatingMessage = {
      id: messageCounterRef.current,
      text: COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)],
      x: 3 + Math.random() * 80,
      y: 5 + Math.random() * 75,
      duration: 4 + Math.random() * 3,
      delay: Math.random() * 0.4,
      driftX: (Math.random() - 0.5) * 90,
    };
    setFloatingMessages((prev) => [...prev.slice(-18), newMsg]);
  }, []);

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start countdown when camera becomes active
  useEffect(() => {
    if (!isActive) return;

    setCountdown(COUNTDOWN_START);
    countdownCompleteRef.current = false;

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          // Countdown finished
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          if (!countdownCompleteRef.current) {
            countdownCompleteRef.current = true;
            // Navigate after a brief pause so user sees "1"
            setTimeout(() => {
              onCountdownComplete();
            }, 600);
          }
          return 1;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [isActive, onCountdownComplete]);

  // Set up snapshot interval
  useEffect(() => {
    if (isActive) {
      snapshotIntervalRef.current = setInterval(saveSnapshot, 1);
    }
    return () => {
      if (snapshotIntervalRef.current) {
        clearInterval(snapshotIntervalRef.current);
        snapshotIntervalRef.current = null;
      }
    };
  }, [isActive, saveSnapshot]);

  // Spawn floating messages continuously when camera is active
  useEffect(() => {
    if (!isActive) {
      setFloatingMessages([]);
      if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
      return;
    }

    // Spawn initial batch
    for (let i = 0; i < 8; i++) {
      setTimeout(() => spawnMessage(), i * 350);
    }

    // Keep spawning every 1.2s
    messageIntervalRef.current = setInterval(() => {
      spawnMessage();
    }, 1200);

    return () => {
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
        messageIntervalRef.current = null;
      }
    };
  }, [isActive, spawnMessage]);

  const handleClose = () => {
    if (snapshotIntervalRef.current) clearInterval(snapshotIntervalRef.current);
    if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    stopCamera();
    onClose();
  };

  // Determine countdown color based on value
  const getCountdownColor = (n: number) => {
    if (n <= 3) return 'rgba(255, 80, 120, 1)';
    if (n <= 6) return 'rgba(255, 140, 180, 1)';
    return 'rgba(255, 200, 220, 1)';
  };

  return (
    <div className="fixed inset-0 z-40" style={{ background: 'radial-gradient(ellipse at center, #1a0a1a 0%, #0d0010 100%)' }}>

      {/* Emoji Rain — full screen, behind messages but above background */}
      <EmojiRain active={isActive} />

      {/* Floating compliment message boxes */}
      {floatingMessages.map((msg) => (
        <div
          key={msg.id}
          className="absolute pointer-events-none select-none"
          style={{
            left: `${msg.x}%`,
            top: `${msg.y}%`,
            zIndex: 45,
            animation: `floatMessage ${msg.duration}s ease-in-out ${msg.delay}s forwards`,
            '--drift-x': `${msg.driftX}px`,
          } as React.CSSProperties}
          onAnimationEnd={() => {
            setFloatingMessages((prev) => prev.filter((m) => m.id !== msg.id));
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(255,105,180,0.85) 0%, rgba(255,20,147,0.75) 100%)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,182,193,0.6)',
              borderRadius: '999px',
              padding: '10px 22px',
              boxShadow: '0 4px 24px rgba(255,20,147,0.4), 0 0 12px rgba(255,105,180,0.3)',
              fontFamily: "'Dancing Script', cursive",
              fontWeight: 700,
              fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
              color: '#fff',
              whiteSpace: 'nowrap',
              textShadow: '0 1px 4px rgba(180,0,80,0.5)',
            }}
          >
            {msg.text}
          </div>
        </div>
      ))}

      {/* Centered round camera feed */}
      <div
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          height: 300,
          borderRadius: '50%',
          overflow: 'hidden',
          zIndex: 50,
          boxShadow: '0 0 0 4px rgba(255,105,180,0.6), 0 0 40px rgba(255,20,147,0.5), 0 0 80px rgba(255,105,180,0.3)',
          border: '3px solid rgba(255,182,193,0.8)',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scaleX(-1)',
            display: 'block',
          }}
        />
      </div>

      {/* Countdown Timer Overlay — centered above camera circle */}
      {isActive && countdown !== null && (
        <div
          className="absolute pointer-events-none select-none"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 300,
            height: 300,
            borderRadius: '50%',
          }}
        >
          <span
            key={countdown}
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontWeight: 700,
              fontSize: 'clamp(5rem, 18vw, 9rem)',
              color: getCountdownColor(countdown),
              textShadow: `
                0 0 20px rgba(255,20,147,0.9),
                0 0 40px rgba(255,105,180,0.7),
                0 0 80px rgba(255,20,147,0.5),
                0 2px 8px rgba(0,0,0,0.8)
              `,
              animation: 'countdownPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
              display: 'block',
              lineHeight: 1,
            }}
          >
            {countdown}
          </span>
        </div>
      )}

      {/* Hidden canvas for snapshots */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Loading state */}
      {isLoading && !isActive && (
        <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/80">
          <div className="w-16 h-16 rounded-full border-4 border-pink-400 border-t-transparent animate-spin mb-4" />
          <p className="text-pink-300 font-quicksand text-lg">Starting camera...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/90 px-6">
          <div className="bg-pink-950/80 border border-pink-500 rounded-2xl p-8 max-w-sm text-center">
            <p className="text-4xl mb-4">📷</p>
            <h3 className="text-pink-300 font-quicksand font-bold text-xl mb-2">Camera Error</h3>
            <p className="text-pink-400 font-quicksand text-sm mb-6">{error.message}</p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-quicksand font-semibold transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-[55] flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
          <span className="text-white/80 font-quicksand text-sm">
            {snapshotCount > 0 ? `${snapshotCount} memories captured` : 'Camera active'}
          </span>
        </div>
        <button
          onClick={handleClose}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
          aria-label="Close camera"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Bottom hint — show countdown label */}
      {isActive && (
        <div className="absolute bottom-6 left-0 right-0 z-[55] flex justify-center pointer-events-none">
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
            <Camera className="w-4 h-4 text-pink-300" />
            <span className="text-pink-200 font-quicksand text-xs">
              {countdown !== null
                ? `Secret Surprise in ${countdown}... ✨`
                : 'Capturing your beautiful moments ✨'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

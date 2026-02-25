import { useEffect, useState } from 'react';
import EmojiRain from '../components/EmojiRain';

const POEM_LINES = [
  'খুশি মানে ভোরের আলো',
  'খুশি মানে ভালো থাকা',
  '',
  'হৃদয় জুড়ে থাকুক তোমার',
  'আনন্দতেই ছবি আঁকা',
  '',
  'তোমার হাসির মিষ্টি রোদে',
  'মুছবে মনের সব কালো',
  '',
  'নামের মতোই থেকো তুমি',
  'সব সময় ভীষণ ভালো',
];

export default function PoemPage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in after mount
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4 py-12"
      style={{
        background: 'radial-gradient(ellipse at 30% 20%, #2a0a1f 0%, #0d0010 50%, #1a0520 100%)',
      }}
    >
      {/* Emoji rain for festive feel */}
      <EmojiRain active={true} />

      {/* Decorative blurred blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(255,105,180,0.6), transparent)' }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(255,20,147,0.5), transparent)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(255,182,193,0.8), transparent)' }}
        />
      </div>

      {/* Poem box */}
      <div
        className="relative z-10"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
          transition: 'opacity 1.2s ease-out, transform 1.2s cubic-bezier(0.34, 1.2, 0.64, 1)',
        }}
      >
        {/* Outer glow ring */}
        <div
          style={{
            position: 'absolute',
            inset: '-3px',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, rgba(255,105,180,0.8) 0%, rgba(255,20,147,0.6) 50%, rgba(255,182,193,0.8) 100%)',
            filter: 'blur(2px)',
            zIndex: -1,
          }}
        />

        {/* Main poem card */}
        <div
          style={{
            background: 'linear-gradient(160deg, rgba(40,5,30,0.92) 0%, rgba(20,0,20,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255,182,193,0.35)',
            borderRadius: '24px',
            padding: 'clamp(2rem, 6vw, 3.5rem) clamp(1.8rem, 7vw, 4rem)',
            boxShadow: `
              0 0 0 1px rgba(255,105,180,0.15),
              0 8px 40px rgba(255,20,147,0.35),
              0 20px 80px rgba(255,105,180,0.2),
              inset 0 1px 0 rgba(255,255,255,0.08)
            `,
            maxWidth: '520px',
            width: '100%',
            position: 'relative',
          }}
        >
          {/* Decorative top ornament */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span style={{ fontSize: '1.4rem' }}>🌸</span>
            <span
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontWeight: 700,
                fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                color: 'rgba(255,182,193,0.9)',
                letterSpacing: '0.08em',
                textShadow: '0 0 12px rgba(255,105,180,0.6)',
              }}
            >
              ✨ Secret Surprise ✨
            </span>
            <span style={{ fontSize: '1.4rem' }}>🌸</span>
          </div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,105,180,0.5), transparent)',
              marginBottom: '2rem',
            }}
          />

          {/* Poem lines */}
          <div
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontWeight: 600,
              fontSize: 'clamp(1.25rem, 4vw, 1.65rem)',
              lineHeight: 1.85,
              color: '#fff',
              textAlign: 'center',
              textShadow: '0 0 18px rgba(255,105,180,0.5), 0 1px 4px rgba(0,0,0,0.6)',
              letterSpacing: '0.01em',
            }}
          >
            {POEM_LINES.map((line, i) =>
              line === '' ? (
                <div key={i} style={{ height: '0.8em' }} />
              ) : (
                <div
                  key={i}
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateX(0)' : 'translateX(-12px)',
                    transition: `opacity 0.8s ease-out ${0.4 + i * 0.12}s, transform 0.8s ease-out ${0.4 + i * 0.12}s`,
                  }}
                >
                  {line}
                </div>
              )
            )}
          </div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,105,180,0.5), transparent)',
              marginTop: '2rem',
              marginBottom: '1.5rem',
            }}
          />

          {/* Bottom ornament */}
          <div className="flex items-center justify-center gap-2">
            <span style={{ fontSize: '1.2rem' }}>💖</span>
            <span
              style={{
                fontFamily: "'Quicksand', sans-serif",
                fontWeight: 600,
                fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
                color: 'rgba(255,182,193,0.7)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              With love, Akash
            </span>
            <span style={{ fontSize: '1.2rem' }}>💖</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 text-center z-10">
        <p className="text-xs font-quicksand" style={{ color: 'rgba(255,182,193,0.45)' }}>
          Built with{' '}
          <span style={{ color: 'rgba(255,105,180,0.7)' }}>♥</span>{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'surprise-website-khushi')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'rgba(255,105,180,0.7)', textDecoration: 'underline' }}
          >
            caffeine.ai
          </a>
          {' '}· © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

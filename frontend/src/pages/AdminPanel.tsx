import { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Trash2, Download, Eye, EyeOff, Lock, X } from 'lucide-react';

const SNAPSHOT_KEY_PREFIX = 'snapshot_';
const SNAPSHOT_INDEX_KEY = 'snapshot_index';
const SNAPSHOT_COUNT_KEY = 'snapshot_count';
const SNAPSHOT_BUFFER_SIZE = 20;

const ADMIN_EMAIL = 'admin@123';
const ADMIN_PASSWORD = 'admin@123';

interface AdminPanelProps {
  onBack: () => void;
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [snapshots, setSnapshots] = useState<string[]>([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadSnapshots = () => {
    const rawCount = localStorage.getItem(SNAPSHOT_COUNT_KEY);
    const count = rawCount ? parseInt(rawCount, 10) : 0;
    const rawIndex = localStorage.getItem(SNAPSHOT_INDEX_KEY);
    const latestIndex = rawIndex ? parseInt(rawIndex, 10) : -1;

    if (count === 0) {
      setSnapshots([]);
      return;
    }

    const loaded: string[] = [];
    // Load in reverse order (newest first)
    for (let i = 0; i < count; i++) {
      const idx = ((latestIndex - i) + SNAPSHOT_BUFFER_SIZE) % SNAPSHOT_BUFFER_SIZE;
      const key = `${SNAPSHOT_KEY_PREFIX}${idx}`;
      const data = localStorage.getItem(key);
      if (data) loaded.push(data);
    }
    setSnapshots(loaded);
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadSnapshots();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        setIsLoggedIn(true);
      } else {
        setLoginError('Invalid credentials. Please try again.');
      }
      setIsLoading(false);
    }, 600);
  };

  const handleClearAll = () => {
    for (let i = 0; i < SNAPSHOT_BUFFER_SIZE; i++) {
      localStorage.removeItem(`${SNAPSHOT_KEY_PREFIX}${i}`);
    }
    localStorage.removeItem(SNAPSHOT_INDEX_KEY);
    localStorage.removeItem(SNAPSHOT_COUNT_KEY);
    setSnapshots([]);
    setSelectedSnapshot(null);
  };

  const handleDownload = (dataUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `khushi-snapshot-${index + 1}.jpg`;
    link.click();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    setSnapshots([]);
    setSelectedSnapshot(null);
  };

  return (
    <div className="min-h-screen pink-gradient-bg">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-pink-200 shadow-pink">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-pink-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-pink-600" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-pink-600" />
              <h1 className="font-quicksand font-bold text-pink-700 text-lg">Admin Panel</h1>
            </div>
          </div>
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="text-sm font-quicksand text-pink-500 hover:text-pink-700 transition-colors flex items-center gap-1"
            >
              <Lock className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!isLoggedIn ? (
          /* Login Form */
          <div className="flex items-center justify-center min-h-[70vh]">
            <div
              className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-pink-lg border border-pink-200 p-8"
              style={{ animation: 'fadeInUp 0.5s ease-out forwards' }}
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 mb-4">
                  <Shield className="w-8 h-8 text-pink-600" />
                </div>
                <h2 className="font-dancing text-3xl font-bold text-pink-700 mb-1">Admin Access</h2>
                <p className="font-quicksand text-sm text-pink-400">Enter your credentials to continue</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block font-quicksand text-sm font-semibold text-pink-600 mb-1">
                    Email
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@123"
                    className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-pink-50/50 font-quicksand text-sm text-pink-800 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block font-quicksand text-sm font-semibold text-pink-600 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-pink-200 bg-pink-50/50 font-quicksand text-sm text-pink-800 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <p className="text-red-500 font-quicksand text-sm text-center bg-red-50 rounded-lg py-2 px-3">
                    {loginError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-quicksand font-bold rounded-xl transition-all shadow-pink hover:shadow-pink-lg flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Login
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Dashboard */
          <div style={{ animation: 'fadeInUp 0.4s ease-out forwards' }}>
            {/* Stats bar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="font-dancing text-3xl font-bold text-pink-700">
                  Snapshot Gallery
                </h2>
                <p className="font-quicksand text-sm text-pink-400 mt-1">
                  {snapshots.length} snapshot{snapshots.length !== 1 ? 's' : ''} captured
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadSnapshots}
                  className="px-4 py-2 bg-pink-100 hover:bg-pink-200 text-pink-700 font-quicksand font-semibold text-sm rounded-xl transition-colors"
                >
                  Refresh
                </button>
                {snapshots.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 font-quicksand font-semibold text-sm rounded-xl transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {snapshots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-6xl mb-4">📷</p>
                <h3 className="font-dancing text-2xl font-bold text-pink-400 mb-2">No snapshots yet</h3>
                <p className="font-quicksand text-sm text-pink-300">
                  Go back and open the surprise to capture memories!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {snapshots.map((snap, i) => (
                  <div
                    key={i}
                    className="relative group rounded-2xl overflow-hidden border-2 border-pink-200 hover:border-pink-400 transition-all shadow-pink hover:shadow-pink-lg cursor-pointer"
                    style={{ animation: `fadeInUp ${0.1 + i * 0.05}s ease-out forwards` }}
                    onClick={() => setSelectedSnapshot(snap)}
                  >
                    <div className="aspect-square">
                      <img
                        src={snap}
                        alt={`Snapshot ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                      <span className="text-white font-quicksand text-xs font-semibold">#{i + 1}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDownload(snap, i); }}
                        className="p-1 bg-white/20 rounded-lg hover:bg-white/40 transition-colors"
                        aria-label="Download snapshot"
                      >
                        <Download className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Lightbox */}
      {selectedSnapshot && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedSnapshot(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedSnapshot}
              alt="Snapshot preview"
              className="w-full rounded-2xl shadow-2xl border-2 border-pink-400"
            />
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={() => handleDownload(selectedSnapshot, snapshots.indexOf(selectedSnapshot))}
                className="p-2 bg-pink-500 hover:bg-pink-600 rounded-full text-white transition-colors shadow-lg"
                aria-label="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedSnapshot(null)}
                className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-6 mt-8">
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
    </div>
  );
}

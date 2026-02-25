import { useState } from 'react';
import HomePage from './pages/HomePage';
import AdminPanel from './pages/AdminPanel';
import PoemPage from './pages/PoemPage';

type AppView = 'home' | 'admin' | 'poem';

export default function App() {
  const [view, setView] = useState<AppView>('home');

  return (
    <div className="min-h-screen">
      {view === 'home' && (
        <HomePage
          onAdminClick={() => setView('admin')}
          onCountdownComplete={() => setView('poem')}
        />
      )}
      {view === 'admin' && (
        <AdminPanel onBack={() => setView('home')} />
      )}
      {view === 'poem' && (
        <PoemPage />
      )}
    </div>
  );
}

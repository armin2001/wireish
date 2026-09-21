'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Šifra za pristup sajtu
    if (password === 'wireish2026') {
      // Postavljamo kolačić koji traje 7 dana
      document.cookie = 'wireish_auth=authenticated_true; path=/; max-age=604800';
      // Trenutno osvježavanje stranice kako bi Navbar odmah učitao resurse i logo
      window.location.href = '/';
    } else {
      setError(true);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
      {/* Pozadinski glow efekat */}
      <div className="absolute w-[500px] h-[500px] bg-primary/15 rounded-full blur-[140px] -z-10" />

      <div className="max-w-md w-full glass p-8 md:p-10 border border-border/80 shadow-2xl rounded-3xl relative">
        
        {/* Header sa spojenim nazivom brenda */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="flex items-center mb-6">
            <span className="font-display text-2xl font-bold tracking-tight text-white">Wire</span>
            <span className="font-display text-2xl font-bold tracking-tight text-primary">ish</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
            <Lock className="w-3 h-3" /> Restricted Access
          </div>
          <h1 className="text-2xl font-bold text-white">Site Under Construction</h1>
          <p className="text-gray-400 text-sm mt-1">Enter the team password to preview Wireish.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter team password..." 
              className={`w-full px-4 py-3.5 rounded-2xl bg-background/50 border ${error ? 'border-red-500' : 'border-border'} focus:border-primary focus:outline-none text-white text-sm transition-all`}
            />
            {error && (
              <p className="text-red-400 text-xs mt-2 text-center">Incorrect password. Please try again.</p>
            )}
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-all shadow-[0_0_20px_var(--color-primary-glow)] cursor-pointer text-sm"
          >
            Access Preview
          </button>
        </form>

      </div>
    </main>
  );
}
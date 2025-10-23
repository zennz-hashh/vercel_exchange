import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function Signup({ onSwitch, onSuccess }: { onSwitch: () => void; onSuccess: () => void }) {
  const { signup } = useApp();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(username, email, password);
      onSuccess();
    } catch (err: any) {
      if (err instanceof Error && err.message) {
        setError(err.message);
      } else {
        setError('Signup failed. Please try again.');
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-4 gap-8 overflow-hidden">
      {/* Glowing blue-purple circular light effect */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute z-10 left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-blue-400 opacity-60 blur-3xl"
        style={{ filter: 'blur(120px)' }}
      />
      {/* Animated Jupiter-like planet background */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="planet-bg animate-spin-slow" />
      </div>
      {/* Welcome text with Bitcount font */}
      <div className="relative z-20 mb-4">
        <h2
          className="typewriter text-2xl md:text-3xl text-center drop-shadow-lg select-none"
          style={{
            color: '#a259ff',
            textShadow: '0 2px 16px #a259ff88',
            fontFamily: "'Bitcount Prop Double Ink', monospace",
            width: '100%',
            maxWidth: 480,
            margin: '0 auto',
            letterSpacing: '0.02em',
          }}
        >
          Welcome Trader No Risk No Lambo
        </h2>
      </div>
      <div className="relative z-10 bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Focused glowing circle behind signup card */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-purple-400 opacity-50 blur-2xl"
          style={{ filter: 'blur(60px)' }}
        />
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl">▴</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              VercelEX
            </h1>
          </div>
          <p className="text-gray-600 text-sm">Create your account to start trading</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold">Sign Up</button>
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl"><p className="text-red-600 text-sm">{error}</p></div>}
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">Already have an account?{' '}
          <button onClick={onSwitch} className="text-blue-600 hover:text-blue-700 font-semibold">Login</button>
        </p>
      </div>
      {/* Social Media Section */}
      <div className="relative z-20 w-full max-w-md mx-auto mt-8 flex flex-col items-center gap-2">
        <div className="flex gap-6 justify-center items-center">
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#1DA1F2"/>
              <path d="M24 11.5c-.6.3-1.2.5-1.9.6.7-.4 1.2-1 1.5-1.7-.7.4-1.4.7-2.2.9-.7-.7-1.7-1.1-2.7-1.1-2.1 0-3.7 2-3.2 4 .1.3.1.6.2.8-3-.2-5.7-1.6-7.5-3.8-.3.5-.5 1-.5 1.6 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.4-.4v.1c0 1.5 1.1 2.7 2.5 3-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.2 1.5 2.1 2.8 2.1-1 .8-2.2 1.3-3.5 1.3-.2 0-.4 0-.6-.1C9.7 22.3 11.3 23 13 23c6.1 0 9.5-5.1 9.5-9.5v-.4c.7-.5 1.2-1.1 1.5-1.8z" fill="#fff"/>
            </svg>
          </a>
          <a href="https://discord.com/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#5865F2"/>
              <path d="M22.7 12.1c-1.1-.5-2.2-.8-3.3-1-.2-.1-.4.1-.5.3-.1.2-.2.4-.3.6-1.2-.2-2.4-.2-3.6 0-.1-.2-.2-.4-.3-.6-.1-.2-.3-.4-.5-.3-1.1.2-2.2.5-3.3 1-.1 0-.2.1-.2.2-1.2 1.8-1.9 3.7-1.7 5.7 0 .1.1.2.2.2 1.4 1 2.8 1.7 4.3 2 .2.1.4-.1.5-.3.1-.2.2-.4.3-.6.6.1 1.2.1 1.8.1s1.2 0 1.8-.1c.1.2.2.4.3.6.1.2.3.4.5.3 1.5-.3 2.9-1 4.3-2 .1 0 .2-.1.2-.2.2-2-.5-3.9-1.7-5.7-.1-.1-.2-.2-.3-.2zm-8.1 5.2c-.4 0-.7-.4-.7-.8s.3-.8.7-.8.7.4.7.8-.3.8-.7.8zm5.8 0c-.4 0-.7-.4-.7-.8s.3-.8.7-.8.7.4.7.8-.3.8-.7.8z" fill="#fff"/>
            </svg>
          </a>
          <a href="https://tiktok.com/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#000"/>
              <path d="M21.5 13.2c-.7 0-1.3-.2-1.9-.5v4.2c0 2-1.6 3.6-3.6 3.6s-3.6-1.6-3.6-3.6 1.6-3.6 3.6-3.6c.2 0 .4 0 .6.1v1.5c-.2-.1-.4-.1-.6-.1-1.2 0-2.1 1-2.1 2.1s1 2.1 2.1 2.1 2.1-1 2.1-2.1v-7.2h1.5c.1.7.7 1.3 1.4 1.5v1.5z" fill="#fff"/>
            </svg>
          </a>
        </div>
        <p className="text-xs text-gray-500 mt-2">Follow us on social media</p>
      </div>
      {/* Footer Section */}
      <footer className="w-full text-center py-4 mt-8 text-xs text-gray-400">
        &copy; Vercel Exchange 2025
      </footer>
    </div>
  );
}

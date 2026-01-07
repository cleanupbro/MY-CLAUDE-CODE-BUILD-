import React, { useState } from 'react';
import { Card } from '../components/Card';
import { signIn } from '../services/authService';

interface AdminLoginViewProps {
  onLoginSuccess: (email: string) => void;
}

const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Normalize email to lowercase for matching
      const normalizedEmail = email.toLowerCase().trim();

      const result = await signIn(normalizedEmail, password);

      if (result.success) {
        onLoginSuccess(normalizedEmail);
      } else {
        setError(result.error || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* ADMIN PORTAL Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden bg-[#1A1A1A]">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1920)',
          }}
        />
        {/* Dark Professional Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A]/95 via-[#1A1A1A]/85 to-[#FF6B4A]/20" />

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />

        {/* Floating Orbs - Subtle for professional feel */}
        <div className="absolute top-20 right-20 w-48 h-48 rounded-full bg-[#FF6B4A]/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-[#FF6B4A]/15 blur-3xl" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 py-16">
          {/* Lock Icon */}
          <div className="mx-auto mb-6 w-20 h-20 rounded-2xl bg-[#FF6B4A]/20 border border-[#FF6B4A]/30 flex items-center justify-center backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#FF6B4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B4A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF6B4A]"></span>
            </span>
            <span className="text-[#FF6B4A] font-bold tracking-widest text-sm uppercase">
              Admin Portal
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
            Manage Your <span className="text-[#FF6B4A]">Business</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Secure access to your Clean Up Bros dashboard
          </p>
        </div>
      </section>

      {/* Login Form Section */}
      <div className="max-w-lg mx-auto px-4 py-12 -mt-8 relative z-20">
        <Card className="shadow-2xl">
          <h2 className="text-2xl font-bold text-center text-brand-navy mb-2">Sign In</h2>
          <p className="text-center text-gray-600 mb-6">
            Please sign in to continue.
          </p>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                placeholder="Enter your admin email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full btn-primary !mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminLoginView;

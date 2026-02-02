/**
 * Admin Layout - Clean Up Bros CRM
 * Simple, secure wrapper for all admin pages
 * 
 * Created: February 2, 2026
 */

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

// Whitelisted admin emails - ONLY these can access
// DO NOT add any other emails without owner permission
const ALLOWED_ADMINS = [
  'cleanupbros.au@gmail.com',
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentPage,
  onNavigate,
}) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
    
    // Auto-logout after 30 mins of inactivity
    let timeout: NodeJS.Timeout;
    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        handleLogout();
      }, 30 * 60 * 1000); // 30 minutes
    };
    
    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keypress', resetTimeout);
    resetTimeout();
    
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keypress', resetTimeout);
    };
  }, []);

  const checkAuth = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setError('Database not configured');
      setLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Check if user is in whitelist
      if (!ALLOWED_ADMINS.includes(user.email?.toLowerCase() || '')) {
        setError('Access denied. This email is not authorized.');
        await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(user);
      setLoading(false);
    } catch (err) {
      console.error('Auth check error:', err);
      setError('Authentication error');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    window.location.href = '/admin';
  };

  // Navigation items
  const navItems = [
    { id: 'today', label: '📊 Today', emoji: '📊' },
    { id: 'quotes', label: '📝 Quotes', emoji: '📝' },
    { id: 'jobs', label: '📅 Jobs', emoji: '📅' },
    { id: 'customers', label: '👥 Customers', emoji: '👥' },
    { id: 'money', label: '💰 Money', emoji: '💰' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onSuccess={checkAuth} error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧹</span>
            <span className="font-bold text-lg text-gray-800">Clean Up Bros</span>
          </div>

          {/* User info & logout */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-gray-600">
              {user.email?.split('@')[0]}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-white shadow-sm min-h-[calc(100vh-64px)] border-r border-gray-200">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-lg font-medium transition ${
                  currentPage === item.id
                    ? 'bg-teal-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">{item.emoji}</span>
                {item.label.split(' ')[1]}
              </button>
            ))}
          </nav>
        </aside>

        {/* Sidebar - Mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <span className="font-bold text-lg">Menu</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>
              <nav className="p-4 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-left text-xl font-medium transition ${
                      currentPage === item.id
                        ? 'bg-teal-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-3xl">{item.emoji}</span>
                    {item.label.split(' ')[1]}
                  </button>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition ${
                currentPage === item.id
                  ? 'text-teal-600'
                  : 'text-gray-500'
              }`}
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-xs mt-1">{item.label.split(' ')[1]}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="lg:hidden h-20" />
    </div>
  );
};

// Login Component
const AdminLogin: React.FC<{ onSuccess: () => void; error: string | null }> = ({
  onSuccess,
  error: initialError,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Check whitelist first
    if (!ALLOWED_ADMINS.includes(email.toLowerCase())) {
      setError('This email is not authorized to access the admin panel.');
      setLoading(false);
      return;
    }

    if (!supabase) {
      setError('Database not configured');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login')) {
          setError('Wrong email or password. Try again.');
        } else {
          setError(error.message);
        }
        setLoading(false);
        return;
      }

      onSuccess();
    } catch (err) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-6xl">🧹</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Clean Up Bros</h1>
          <p className="text-gray-500 mt-1">Admin Login</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="your@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-teal-500 text-white text-lg font-bold rounded-xl hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          🔒 Secure admin access only
        </p>
      </div>
    </div>
  );
};

export default AdminLayout;

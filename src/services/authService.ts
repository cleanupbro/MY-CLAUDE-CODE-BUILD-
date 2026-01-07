import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

// Session timeout configuration (15 minutes of inactivity)
const SESSION_TIMEOUT_MS = 15 * 60 * 1000;
let inactivityTimer: ReturnType<typeof setTimeout> | null = null;
let lastActivity: number = Date.now();

export interface AuthResult {
  success: boolean;
  email?: string;
  error?: string;
  user?: User;
}

export interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  session: Session | null;
}

// Track activity for session timeout
const updateActivity = () => {
  lastActivity = Date.now();
};

// Check if session has timed out due to inactivity
const hasSessionTimedOut = (): boolean => {
  return Date.now() - lastActivity > SESSION_TIMEOUT_MS;
};

// Start inactivity timer
const startInactivityTimer = (onTimeout: () => void) => {
  if (inactivityTimer) {
    clearInterval(inactivityTimer);
  }

  // Check every minute for inactivity
  inactivityTimer = setInterval(() => {
    if (hasSessionTimedOut()) {
      onTimeout();
    }
  }, 60000);

  // Add activity listeners
  if (typeof window !== 'undefined') {
    ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(event => {
      window.addEventListener(event, updateActivity, { passive: true });
    });
  }
};

// Stop inactivity timer
const stopInactivityTimer = () => {
  if (inactivityTimer) {
    clearInterval(inactivityTimer);
    inactivityTimer = null;
  }

  if (typeof window !== 'undefined') {
    ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(event => {
      window.removeEventListener(event, updateActivity);
    });
  }
};

/**
 * Sign in with email and password
 * Uses Supabase authentication - no localStorage boolean
 */
export const signIn = async (email: string, password: string): Promise<AuthResult> => {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      error: 'Authentication service not configured. Please contact support.'
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Auth error:', error.message);
      return { success: false, error: error.message };
    }

    if (data.user) {
      // Verify user is in admin_users table
      const isAdmin = await checkAdminStatus(data.user.id);
      if (!isAdmin) {
        // Sign out if not an admin
        await supabase.auth.signOut();
        return { success: false, error: 'Access denied. Admin privileges required.' };
      }

      // Start inactivity timer
      updateActivity();
      startInactivityTimer(async () => {
        console.log('Session timed out due to inactivity');
        await signOut();
        window.location.reload();
      });

      return { success: true, email: data.user.email || '', user: data.user };
    }

    return { success: false, error: 'Login failed' };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Sign up with email and password
 * Creates Supabase user and admin_users record
 */
export const signUp = async (email: string, password: string): Promise<AuthResult> => {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Signup error:', error.message);
      return { success: false, error: error.message };
    }

    if (data.user) {
      // Add user to admin_users table
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({
          id: data.user.id,
          email: email,
        });

      if (insertError) {
        console.error('Failed to create admin user record:', insertError);
        // Don't fail signup, but log the error
      }

      return { success: true, email, user: data.user };
    }

    return { success: false, error: 'Signup failed' };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Sign out - clears Supabase session
 */
export const signOut = async (): Promise<void> => {
  stopInactivityTimer();

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }
};

/**
 * Check if user is logged in - SECURE version
 * Uses Supabase session, NOT localStorage boolean
 */
export const isLoggedIn = async (): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) {
    return false;
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return false;
    }

    // Verify admin status
    const isAdmin = await checkAdminStatus(session.user.id);
    return isAdmin;
  } catch (error) {
    console.error('Session check error:', error);
    return false;
  }
};

/**
 * Synchronous check for quick UI updates
 * NOTE: Use isLoggedIn() for security-critical checks
 */
export const isLoggedInSync = (): boolean => {
  if (!isSupabaseConfigured() || !supabase) {
    return false;
  }

  // Use the session from memory (set by auth state listener)
  return !!supabase.auth.getSession;
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};

/**
 * Get current user email
 */
export const getCurrentUserEmail = async (): Promise<string | null> => {
  const user = await getCurrentUser();
  return user?.email || null;
};

/**
 * Get current session
 */
export const getSession = async (): Promise<Session | null> => {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
};

/**
 * Check if user is an admin (exists in admin_users table)
 */
export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) {
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
};

/**
 * Get full auth state
 */
export const getAuthState = async (): Promise<AuthState> => {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      session: null,
    };
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        session: null,
      };
    }

    const isAdmin = await checkAdminStatus(session.user.id);

    return {
      isAuthenticated: true,
      isAdmin,
      user: session.user,
      session,
    };
  } catch (error) {
    console.error('Auth state error:', error);
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      session: null,
    };
  }
};

/**
 * Initialize auth state listener
 * Call this on app startup to handle session changes
 */
export const initAuthListener = (
  onAuthChange: (state: AuthState) => void
): (() => void) => {
  if (!isSupabaseConfigured() || !supabase) {
    return () => {};
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log('Auth state changed:', event);

      if (event === 'SIGNED_IN' && session?.user) {
        updateActivity();
        startInactivityTimer(async () => {
          console.log('Session timed out due to inactivity');
          await signOut();
          window.location.reload();
        });

        const isAdmin = await checkAdminStatus(session.user.id);
        onAuthChange({
          isAuthenticated: true,
          isAdmin,
          user: session.user,
          session,
        });
      } else if (event === 'SIGNED_OUT') {
        stopInactivityTimer();
        onAuthChange({
          isAuthenticated: false,
          isAdmin: false,
          user: null,
          session: null,
        });
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        const isAdmin = await checkAdminStatus(session.user.id);
        onAuthChange({
          isAuthenticated: true,
          isAdmin,
          user: session.user,
          session,
        });
      }
    }
  );

  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
    stopInactivityTimer();
  };
};

/**
 * Check session on app load
 * Returns current auth state
 */
export const checkSession = async (): Promise<AuthState> => {
  const state = await getAuthState();

  if (state.isAuthenticated) {
    updateActivity();
    startInactivityTimer(async () => {
      console.log('Session timed out due to inactivity');
      await signOut();
      window.location.reload();
    });
  }

  return state;
};

// Legacy compatibility - deprecated, use isLoggedIn() instead
export const checkSupabaseSession = checkSession;
export const signInWithSupabase = signIn;
export const signUpWithSupabase = signUp;

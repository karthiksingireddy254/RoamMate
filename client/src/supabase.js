/**
 * Supabase Client Configuration & Local Auth Fallback Engine
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://udpldosarkdcgvdxglzu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummyKeyForDevFallback';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fallback session helper stored in localStorage
export const LocalAuthHelper = {
  getUser() {
    const raw = localStorage.getItem('roammate_auth_user');
    return raw ? JSON.parse(raw) : null;
  },
  setUser(user) {
    if (user) {
      localStorage.setItem('roammate_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('roammate_auth_user');
    }
  }
};

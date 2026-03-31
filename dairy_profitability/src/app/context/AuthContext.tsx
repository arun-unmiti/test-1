import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, getSelf as apiGetSelf } from '../services/api';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  role_id?: number;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('dairy_auth_user');
    if (stored) {
      try { return JSON.parse(stored); } catch { return null; }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('dairy_auth_token')
  );

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await apiLogin(email, password);

      const authToken: string =
        data.token ??
        data.access_token ??
        data.data?.token ??
        data.data?.access_token ??
        '';

      if (!authToken) return false;

      // Fetch full user profile with the token
      let authUser: AuthUser;
      try {
        const selfData = await apiGetSelf(authToken);
        const self = selfData.data ?? selfData;
        authUser = {
          id: String(self.user_id ?? self.id ?? ''),
          name: self.name ?? email.split('@')[0],
          email: self.email ?? email,
          role: self.role ?? 'field_officer',
          role_id: self.role_id ?? undefined,
        };
      } catch {
        // Fallback: build minimal user from login response
        const raw = data.user ?? data.data ?? {};
        authUser = {
          id: String(raw.id ?? raw.user_id ?? ''),
          name: raw.name ?? email.split('@')[0],
          email: raw.email ?? email,
          role: raw.role ?? 'field_officer',
        };
      }

      setToken(authToken);
      setUser(authUser);
      localStorage.setItem('dairy_auth_token', authToken);
      localStorage.setItem('dairy_auth_user', JSON.stringify(authUser));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('dairy_auth_user');
    localStorage.removeItem('dairy_auth_token');
  };

  useEffect(() => {
    const handleSessionExpired = () => {
      logout();
      window.location.replace('/#/login');
    };
    window.addEventListener('dairy:session-expired', handleSessionExpired);
    return () => window.removeEventListener('dairy:session-expired', handleSessionExpired);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

import React, { createContext, useContext, useState } from 'react';
import { login as apiLogin } from '../services/api';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
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

      // Handle various token field names the API might return
      const authToken: string =
        data.token ??
        data.access_token ??
        data.data?.token ??
        data.data?.access_token ??
        '';

      // Handle various user object shapes
      const raw = data.user ?? data.data ?? data;
      const authUser: AuthUser = {
        id: String(raw.id ?? ''),
        name: raw.name ?? email.split('@')[0],
        email: raw.email ?? email,
        role: raw.role ?? raw.role_name ?? raw.role?.name ?? 'field_officer',
      };

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

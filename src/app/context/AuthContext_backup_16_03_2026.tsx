import React, { createContext, useContext, useState } from 'react';

interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'supervisor' | 'field_officer';
    avatar?: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Array<AuthUser & { password: string }> = [
    { id: 'u1', name: 'Admin User', email: 'admin@dairypro.com', password: 'admin123', role: 'admin' },
    { id: 'u2', name: 'Jane Supervisor', email: 'jane@dairypro.com', password: 'jane123', role: 'supervisor' },
    { id: 'u3', name: 'Tom Field', email: 'tom@dairypro.com', password: 'tom123', role: 'field_officer' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => {
        const stored = localStorage.getItem('dairy_auth_user');
        if (stored) {
            try { return JSON.parse(stored); } catch { return null; }
        }
        return null;
    });

    const login = async (email: string, password: string): Promise<boolean> => {
        await new Promise(r => setTimeout(r, 800));
        const found = MOCK_USERS.find(u => u.email === email && u.password === password);
        if (found) {
            const { password: _pwd, ...authUser } = found;
            setUser(authUser);
            localStorage.setItem('dairy_auth_user', JSON.stringify(authUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('dairy_auth_user');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

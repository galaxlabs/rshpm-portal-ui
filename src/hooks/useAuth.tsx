import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getLoggedUser, login as frappeLogin, logout as frappeLogout } from '@/lib/frappe';

type AuthContextType = {
  user: string | null;
  loading: boolean;
  login: (usr: string, pwd: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLoggedUser()
      .then((u) => setUser(u || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      async login(usr, pwd) {
        await frappeLogin(usr, pwd);
        const u = await getLoggedUser();
        setUser(u);
      },
      async logout() {
        await frappeLogout();
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

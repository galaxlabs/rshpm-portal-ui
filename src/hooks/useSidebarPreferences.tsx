import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'rshpm_sidebar_visibility_v1';

type SidebarPreferenceContextType = {
  isVisible: (id: string) => boolean;
  setVisible: (id: string, visible: boolean) => void;
  reset: () => void;
};

const SidebarPreferenceContext = createContext<SidebarPreferenceContextType | undefined>(undefined);

function getInitialState(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, boolean>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function SidebarPreferencesProvider({ children }: { children: ReactNode }) {
  const [visibility, setVisibility] = useState<Record<string, boolean>>(getInitialState);

  function persist(next: Record<string, boolean>) {
    setVisibility(next);
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const value = useMemo<SidebarPreferenceContextType>(
    () => ({
      isVisible(id) {
        return visibility[id] !== false;
      },
      setVisible(id, visible) {
        persist({ ...visibility, [id]: visible });
      },
      reset() {
        persist({});
      },
    }),
    [visibility],
  );

  return <SidebarPreferenceContext.Provider value={value}>{children}</SidebarPreferenceContext.Provider>;
}

export function useSidebarPreferences() {
  const ctx = useContext(SidebarPreferenceContext);
  if (!ctx) throw new Error('useSidebarPreferences must be used within SidebarPreferencesProvider');
  return ctx;
}

import { type ReactNode, useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, FileText, LayoutDashboard, LogOut, ReceiptText, Settings2 } from 'lucide-react';
import { doctypes } from '@/lib/doctypeMeta';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useSidebarPreferences } from '@/hooks/useSidebarPreferences';
import { getSidebarOptions, isAdministrator } from '@/lib/sidebar';
import { toDoctypeSlug } from '@/lib/utils';

const iconByLabel: Record<string, ReactNode> = {
  Dashboard: <LayoutDashboard className="h-4 w-4" />,
  Analytics: <BarChart3 className="h-4 w-4" />,
  Reports: <ReceiptText className="h-4 w-4" />,
  'Print Center': <FileText className="h-4 w-4" />,
  'Sidebar Options': <Settings2 className="h-4 w-4" />,
};

function friendlyDoctypeLabel(name: string) {
  return name
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [setupSearch, setSetupSearch] = useState('');
  const [doctypeSearch, setDoctypeSearch] = useState('');
  const { isVisible } = useSidebarPreferences();
  const available = new Set(doctypes.map((d) => d.name));
  const admin = isAdministrator(user);
  const options = getSidebarOptions(available);
  const visibleOptions = options.filter((item) => {
    if (!isVisible(item.id)) return false;
    if (item.requiresAdmin && !admin) return false;
    return true;
  });

  const mainOptions = visibleOptions.filter((item) => item.group === 'main');
  const setupOptions = visibleOptions.filter((item) => item.group === 'setup');
  const coreOptions = visibleOptions.filter((item) => item.group === 'core');
  const otherDoctypes = useMemo(() => {
    const coreDoctypes = coreOptions.map((item) => item.doctype).filter(Boolean) as string[];
    const setupDoctypes = setupOptions.map((item) => item.doctype).filter(Boolean) as string[];
    const mainDoctypes = new Set([...coreDoctypes, ...setupDoctypes]);
    return doctypes
      .filter((d) => !mainDoctypes.has(d.name))
      .map((d) => ({
        name: d.name,
        label: friendlyDoctypeLabel(d.name),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [coreOptions, setupOptions]);

  const filteredSetupOptions = useMemo(() => {
    const q = setupSearch.trim().toLowerCase();
    if (!q) return setupOptions;
    return setupOptions.filter((item) => item.label.toLowerCase().includes(q) || (item.doctype || '').toLowerCase().includes(q));
  }, [setupOptions, setupSearch]);

  const filteredOtherDoctypes = useMemo(() => {
    const q = doctypeSearch.trim().toLowerCase();
    if (!q) return otherDoctypes;
    return otherDoctypes.filter((item) => item.label.toLowerCase().includes(q) || item.name.toLowerCase().includes(q));
  }, [otherDoctypes, doctypeSearch]);

  return (
    <div className="min-h-screen bg-app text-foreground">
      <div className="mx-auto grid min-h-screen max-w-[1800px] grid-cols-1 lg:grid-cols-[340px_1fr]">
        <aside className="border-r border-border/80 bg-slate-950/70 p-4 backdrop-blur-xl">
          <div className="mb-4 rounded-lg border border-border bg-slate-900/70 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">RSHPM Portal</p>
            <h1 className="mt-1 text-xl font-semibold">Operations Console</h1>
            <p className="mt-2 text-xs text-slate-400">
              Logged in as <span className="text-slate-200">{user || 'Guest'}</span>
            </p>
          </div>

          <nav className="space-y-1">
            {mainOptions.map((item) => (
              <NavLink
                key={item.id}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                    isActive ? 'bg-accent text-primary' : 'text-slate-300 hover:bg-slate-900/80'
                  }`
                }
              >
                {iconByLabel[item.label] ?? <LayoutDashboard className="h-4 w-4" />} {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 rounded-md border border-border bg-slate-900/50 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Setup</p>
            <Input
              placeholder="Search setup..."
              value={setupSearch}
              onChange={(e) => setSetupSearch(e.target.value)}
            />
            <Select
              className="mt-2 h-auto"
              size={Math.min(8, Math.max(4, filteredSetupOptions.length + 1))}
              defaultValue=""
              onChange={(e) => {
                const value = e.target.value;
                if (!value) return;
                void navigate(`/d/${toDoctypeSlug(value)}`);
                e.currentTarget.value = '';
              }}
            >
              <option value="">Select setup option...</option>
              {filteredSetupOptions.map((item) => (
                <option key={item.id} value={item.doctype || ''} disabled={!item.available}>
                  {item.label}
                  {item.available ? '' : ' (Not Available)'}
                </option>
              ))}
            </Select>
          </div>

          <div className="mt-3 rounded-md border border-border bg-slate-900/50 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">All Other Doctypes</p>
            <Input
              placeholder="Search doctype..."
              value={doctypeSearch}
              onChange={(e) => setDoctypeSearch(e.target.value)}
            />
            <Select
              className="mt-2 h-auto"
              size={Math.min(12, Math.max(6, filteredOtherDoctypes.length))}
              defaultValue=""
              onChange={(e) => {
                const value = e.target.value;
                if (!value) return;
                void navigate(`/d/${toDoctypeSlug(value)}`);
                e.currentTarget.value = '';
              }}
            >
              <option value="">Choose doctype...</option>
              {filteredOtherDoctypes.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="mt-4 max-h-[55vh] space-y-1 overflow-y-auto pr-1">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Core Components
            </p>
            {coreOptions.map((item) => (
              <NavLink
                key={item.id}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-sm ${
                    isActive ? 'bg-accent text-primary' : 'text-slate-300 hover:bg-slate-900/80'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-4 rounded-md border border-border bg-slate-900/70 p-3 text-xs text-slate-400">
            <p>Client UI Mode</p>
            <p>Only key modules + reports</p>
          </div>
          <div className="mt-3 flex gap-2">
            <Link className="text-xs text-primary underline" to="/login">
              Switch User
            </Link>
            <Button size="sm" variant="secondary" onClick={() => void logout()}>
              <LogOut className="mr-1 h-3 w-3" /> Logout
            </Button>
          </div>
        </aside>

        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

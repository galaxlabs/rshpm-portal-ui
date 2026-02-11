import { useMemo, useState, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BarChart3, FileText, LayoutDashboard, LogOut, Search } from 'lucide-react';
import { doctypes, generatedAt, groupDoctypesByCategory } from '@/lib/doctypeMeta';
import { toDoctypeSlug } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => doctypes.filter((dt) => dt.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );
  const grouped = useMemo(() => groupDoctypesByCategory(filtered), [filtered]);

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

          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="pl-8"
              placeholder="Search DocTypes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <nav className="space-y-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                  isActive ? 'bg-accent text-primary' : 'text-slate-300 hover:bg-slate-900/80'
                }`
              }
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                  isActive ? 'bg-accent text-primary' : 'text-slate-300 hover:bg-slate-900/80'
                }`
              }
            >
              <BarChart3 className="h-4 w-4" /> Analytics
            </NavLink>
            <NavLink
              to="/print-center"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                  isActive ? 'bg-accent text-primary' : 'text-slate-300 hover:bg-slate-900/80'
                }`
              }
            >
              <FileText className="h-4 w-4" /> Print Center
            </NavLink>
          </nav>

          <div className="mt-4 max-h-[55vh] space-y-3 overflow-y-auto pr-1">
            {grouped.map((group) => (
              <div key={group.name}>
                <p className="mb-1 px-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {group.name}
                </p>
                <div className="space-y-1">
                  {group.items.map((dt) => (
                    <NavLink
                      key={dt.name}
                      to={`/d/${toDoctypeSlug(dt.name)}`}
                      className={({ isActive }) =>
                        `block rounded-md px-3 py-2 text-sm ${
                          isActive ? 'bg-accent text-primary' : 'text-slate-300 hover:bg-slate-900/80'
                        }`
                      }
                    >
                      {dt.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-md border border-border bg-slate-900/70 p-3 text-xs text-slate-400">
            <p>DocTypes: {doctypes.length}</p>
            <p>Metadata: {new Date(generatedAt).toLocaleString()}</p>
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

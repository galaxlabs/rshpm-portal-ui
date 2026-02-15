import { useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useSidebarPreferences } from '@/hooks/useSidebarPreferences';
import { doctypes } from '@/lib/doctypeMeta';
import { getSidebarOptions, isAdministrator, type SidebarOption } from '@/lib/sidebar';

function grouped(options: SidebarOption[]) {
  return {
    main: options.filter((x) => x.group === 'main'),
    setup: options.filter((x) => x.group === 'setup'),
    core: options.filter((x) => x.group === 'core'),
  };
}

function Section({
  title,
  options,
  isVisible,
  setVisible,
}: {
  title: string;
  options: SidebarOption[];
  isVisible: (id: string) => boolean;
  setVisible: (id: string, visible: boolean) => void;
}) {
  if (!options.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {options.map((item) => (
            <label
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-slate-900/50 p-3"
            >
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-slate-400">
                  {item.available ? item.to : 'Not available in doctype list'}
                </p>
              </div>
              <input
                type="checkbox"
                checked={isVisible(item.id)}
                onChange={(e) => setVisible(item.id, e.target.checked)}
                className="h-4 w-4 accent-cyan-400"
              />
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminSidebarOptionsPage() {
  const { user } = useAuth();
  const { isVisible, setVisible, reset } = useSidebarPreferences();

  const available = useMemo(() => new Set(doctypes.map((d) => d.name)), []);
  const options = useMemo(
    () => getSidebarOptions(available).filter((item) => item.configurable !== false),
    [available],
  );
  const { main, setup, core } = grouped(options);
  const admin = isAdministrator(user);

  if (!admin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Administrator Access Required</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-300">
            This page is only for `Administrator` to hide/show sidebar options.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-slate-950/55 p-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">Administration</p>
          <h2 className="text-2xl font-semibold">Sidebar Options</h2>
          <p className="text-xs text-slate-400">Hide or show menu items for this browser session profile.</p>
        </div>
        <Button size="sm" variant="secondary" onClick={reset}>
          <RotateCcw className="mr-1 h-3 w-3" />
          Reset Defaults
        </Button>
      </div>

      <Section title="Main Navigation" options={main} isVisible={isVisible} setVisible={setVisible} />
      <Section title="Setup (Property / Company / Main On Boarding Profile / Profile)" options={setup} isVisible={isVisible} setVisible={setVisible} />
      <Section title="Core Components" options={core} isVisible={isVisible} setVisible={setVisible} />
    </div>
  );
}

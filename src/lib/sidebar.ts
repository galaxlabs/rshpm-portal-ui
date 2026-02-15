import { CORE_MODULES } from '@/lib/dashboard';
import { toDoctypeSlug } from '@/lib/utils';

export type SidebarOptionGroup = 'main' | 'setup' | 'core';

export type SidebarOption = {
  id: string;
  label: string;
  to: string;
  group: SidebarOptionGroup;
  doctype?: string;
  available: boolean;
  configurable?: boolean;
  requiresAdmin?: boolean;
};

type SetupDefinition = {
  id: string;
  label: string;
  candidates: string[];
};

const setupDefinitions: SetupDefinition[] = [
  { id: 'setup-property', label: 'Property', candidates: ['Property'] },
  { id: 'setup-company', label: 'Company', candidates: ['Company', 'Property Company'] },
  {
    id: 'setup-main-on-boarding-profile',
    label: 'Main On Boarding Profile',
    candidates: ['Main On Boarding Profile', 'Main Onboarding Profile', 'On Boarding Profile'],
  },
  { id: 'setup-profile', label: 'Profile', candidates: ['Profile', 'User Profile'] },
];

function resolveFirstAvailable(candidates: string[], available: Set<string>) {
  return candidates.find((name) => available.has(name));
}

export function isAdministrator(user: string | null | undefined) {
  const value = (user || '').trim().toLowerCase();
  return value === 'administrator' || value === 'admin';
}

export function getSidebarOptions(available: Set<string>): SidebarOption[] {
  const setupOptions = setupDefinitions.map<SidebarOption>((def) => {
    const doctype = resolveFirstAvailable(def.candidates, available);
    return {
      id: def.id,
      label: def.label,
      to: doctype ? `/d/${toDoctypeSlug(doctype)}` : '#',
      group: 'setup',
      doctype,
      available: Boolean(doctype),
    };
  });

  const coreOptions = CORE_MODULES.map<SidebarOption>((moduleName) => ({
    id: `core-${toDoctypeSlug(moduleName)}`,
    label: moduleName,
    to: `/d/${toDoctypeSlug(moduleName)}`,
    group: 'core',
    doctype: moduleName,
    available: available.has(moduleName),
  })).filter((item) => item.available);

  const mainOptions: SidebarOption[] = [
    { id: 'main-dashboard', label: 'Dashboard', to: '/', group: 'main', available: true },
    { id: 'main-analytics', label: 'Analytics', to: '/analytics', group: 'main', available: true },
    { id: 'main-reports', label: 'Reports', to: '/reports', group: 'main', available: true },
    { id: 'main-print-center', label: 'Print Center', to: '/print-center', group: 'main', available: true },
    {
      id: 'admin-sidebar-options',
      label: 'Sidebar Options',
      to: '/admin/sidebar-options',
      group: 'main',
      available: true,
      configurable: false,
      requiresAdmin: true,
    },
  ];

  return [...mainOptions, ...setupOptions, ...coreOptions];
}

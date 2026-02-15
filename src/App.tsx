import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { AppShell } from '@/components/layout/AppShell';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { DoctypeCrudPage } from '@/pages/DoctypeCrudPage';
import { PrintCenterPage } from '@/pages/PrintCenterPage';
import { AdminSidebarOptionsPage } from '@/pages/AdminSidebarOptionsPage';
import { Spinner } from '@/components/ui/spinner';
import { SidebarPreferencesProvider } from '@/hooks/useSidebarPreferences';

function Protected() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-app flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <AppShell>
      <Routes>
        <Route element={<DashboardPage />} path="/" />
        <Route element={<AnalyticsPage />} path="/analytics" />
        <Route element={<ReportsPage />} path="/reports" />
        <Route element={<PrintCenterPage />} path="/print-center" />
        <Route element={<AdminSidebarOptionsPage />} path="/admin/sidebar-options" />
        <Route element={<DoctypeCrudPage />} path="/d/:slug" />
      </Routes>
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SidebarPreferencesProvider>
        <Routes>
          <Route element={<LoginPage />} path="/login" />
          <Route element={<Protected />} path="/*" />
        </Routes>
      </SidebarPreferencesProvider>
    </AuthProvider>
  );
}

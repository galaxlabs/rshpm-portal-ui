import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { AppShell } from '@/components/layout/AppShell';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { DoctypeCrudPage } from '@/pages/DoctypeCrudPage';
import { PrintCenterPage } from '@/pages/PrintCenterPage';
import { Spinner } from '@/components/ui/spinner';

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
        <Route element={<PrintCenterPage />} path="/print-center" />
        <Route element={<DoctypeCrudPage />} path="/d/:slug" />
      </Routes>
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<LoginPage />} path="/login" />
        <Route element={<Protected />} path="/*" />
      </Routes>
    </AuthProvider>
  );
}

import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [usr, setUsr] = useState('Administrator');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(usr, pwd);
      navigate('/');
    } catch (err: unknown) {
      const raw = err as { response?: { data?: { message?: string; exception?: string } } };
      setError(raw.response?.data?.message || raw.response?.data?.exception || 'Login failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-app flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>RSHPM Portal Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={onSubmit}>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Username</label>
              <Input value={usr} onChange={(e) => setUsr(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Password</label>
              <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} required />
            </div>
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <Button className="w-full" disabled={busy} type="submit">{busy ? 'Signing in...' : 'Sign In'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

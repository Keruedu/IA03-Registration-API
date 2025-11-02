import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { authService } from '@/lib/api';
import { clearTokens } from '@/lib/auth';

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery(['me'], () => authService.me(), {
    retry: 1,
  });

  const logout = () => {
    clearTokens();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1f2e] via-[#1f2937] to-[#2a3142] p-4">
      <Card className="w-full max-w-md shadow-2xl bg-[#2b3544] border border-[#3f4756]">
        <CardHeader className="text-center pb-3">
          <CardTitle className="text-3xl font-bold text-white">Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-gray-300">Loading...</p>}
          {isError && <p className="text-destructive">Failed to load user data</p>}
          {data && (
            <div className="space-y-4">
              <p className="text-gray-300">Signed in as <strong className="text-white">{data.user.email}</strong></p>
              <Button onClick={logout} className="w-full">Logout</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

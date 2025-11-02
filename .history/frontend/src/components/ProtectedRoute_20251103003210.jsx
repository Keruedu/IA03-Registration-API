import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAccessToken, getRefreshToken, setAccessToken, clearTokens } from '@/lib/auth';
import { authService } from '@/lib/api';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function check() {
      const access = getAccessToken();
      if (access) {
        if (mounted) {
          setAuthorized(true);
          setLoading(false);
        }
        return;
      }

      const refresh = getRefreshToken();
      if (!refresh) {
        if (mounted) {
          setAuthorized(false);
          setLoading(false);
        }
        return;
      }

      // Try refreshing
      try {
        const res = await authService.refresh(refresh);
        setAccessToken(res.accessToken);
        if (mounted) setAuthorized(true);
      } catch (e) {
        clearTokens();
        if (mounted) setAuthorized(false);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    check();
    return () => (mounted = false);
  }, []);

  if (loading) return null;
  if (!authorized) return <Navigate to="/login" replace />;
  return children;
}

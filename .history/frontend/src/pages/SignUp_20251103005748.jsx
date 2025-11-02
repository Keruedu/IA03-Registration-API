import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { authService } from '@/lib/api';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: (data) => authService.register(data),
    onSuccess: () => {
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    },
  });

  const onSubmit = (data) => {
    // Normalize email to avoid case/whitespace mismatches
    const email = (data.email || '').trim().toLowerCase();
    const password = data.password;
    // debug
    // eslint-disable-next-line no-console
    console.debug('[SignUp] submitting', { email });
    mutation.mutate({ email, password });
  };

  const password = watch('password');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1f2e] via-[#1f2937] to-[#2a3142] p-4">
      <Card className="w-full max-w-md shadow-2xl bg-[#2b3544] border border-[#3f4756]">
        <CardHeader className="pb-3">
          <CardTitle className="text-3xl font-bold text-white">Create an account</CardTitle>
          <CardDescription className="text-gray-300">
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {mutation.isSuccess && (
              <Alert variant="success" className="bg-primary/10 border-primary/20">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertTitle className="text-foreground">Success!</AlertTitle>
                <AlertDescription className="text-foreground">
                  {mutation.data.message} Redirecting to login...
                </AlertDescription>
              </Alert>
            )}

            {mutation.isError && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
                <XCircle className="h-4 w-4 text-destructive" />
                <AlertTitle className="text-foreground">Error</AlertTitle>
                <AlertDescription className="text-foreground">
                  {mutation.error?.response?.data?.message || 'Failed to register. Please try again.'}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="bg-[#1f2937] border-[#3f4756] text-white placeholder:text-gray-400"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-white">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-[#1f2937] border-[#3f4756] text-white placeholder:text-gray-400"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-white">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="bg-[#1f2937] border-[#3f4756] text-white placeholder:text-gray-400"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full font-bold text-base shadow-lg hover:shadow-xl transition-all"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-[#58CC02] hover:text-[#89E219] font-semibold transition-colors">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

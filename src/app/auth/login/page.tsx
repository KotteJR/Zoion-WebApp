'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from 'aws-amplify/auth';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useAuthStore } from '@/store/auth-store';
import { getApolloClient } from '@/lib/apollo-client';

export default function LoginPage() {
  const router = useRouter();
  const { setToken, setIsAuthenticated } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { isSignedIn } = await signIn({
        username: email,
        password,
      });

      if (isSignedIn) {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();

        if (token) {
          setToken(token);
          setIsAuthenticated(true);
          
            // Update Apollo client with new token
            getApolloClient();
          
          router.push('/home');
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sidebar px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl border border-gray-200/50 shadow-sm p-8">
          {/* Zoion Logo at the top */}
          <div className="text-center mb-8">
            <div className="w-auto h-14 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Image
                src="/assets/images/png/zoionplatform.png"
                alt="Zoion Logo"
                width={32}
                height={32}
                className="w-24 h-auto"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to continue to Zoion</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="text-right">
              <Link
                href="/auth/reset-password"
                className="text-sm text-[#3d7c6f] hover:text-[#175c51]"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-black hover:bg-gray-800">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-[#3d7c6f] hover:text-[#175c51] font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



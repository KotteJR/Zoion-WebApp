'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { resetPassword } from 'aws-amplify/auth';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const output = await resetPassword({ username: email });
      
      if (output.nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
        setSuccess('Password reset code sent to your email!');
        setTimeout(() => {
          router.push(`/auth/new-password?email=${encodeURIComponent(email)}`);
        }, 2000);
      }
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.message || 'Kunde inte skicka återställningskod. Vänligen försök igen.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <Image
              src="/assets/icons/zoionAppIcon.png"
              alt="Zoion Logo"
              width={80}
              height={80}
              className="mx-auto rounded-xl mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-800">Reset Password</h1>
            <p className="text-gray-600 mt-2">
              Enter your email to receive a password reset code
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              Send Reset Code
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-primary hover:text-primary-dark font-medium">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}



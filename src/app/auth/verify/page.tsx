'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      if (isSignUpComplete) {
        setSuccess('Email verified successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.message || 'Failed to verify code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setSuccess('');

    try {
      await resendSignUpCode({ username: email });
      setSuccess('Verification code resent to your email');
    } catch (err: any) {
      console.error('Resend error:', err);
      setError(err.message || 'Failed to resend code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sidebar px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl border border-gray-200/50 shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#3d7c6f] rounded-lg flex items-center justify-center mx-auto mb-6">
              <Image
                src="/assets/images/svg/zoionLogo.svg"
                alt="Zoion Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Verify Email</h1>
            <p className="text-gray-600 mt-2">
              We sent a verification code to
              <br />
              <span className="font-medium">{email}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <Input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                maxLength={6}
                className="text-center text-2xl tracking-widest w-full"
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

            <Button type="submit" disabled={isLoading} className="w-full bg-black hover:bg-gray-800">
              Verify Email
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResendCode}
                className="text-[#3d7c6f] hover:text-[#175c51] font-medium"
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-sidebar px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl border border-gray-200/50 shadow-sm p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3d7c6f] rounded-lg flex items-center justify-center mx-auto mb-6">
                <Image
                  src="/assets/images/svg/zoionLogo.svg"
                  alt="Zoion Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Loading...</h1>
            </div>
          </div>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}



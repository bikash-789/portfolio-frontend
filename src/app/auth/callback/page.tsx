'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleCallback = () => {
      const token = searchParams.get('token');
      const refreshToken = searchParams.get('refreshToken');
      const userParam = searchParams.get('user');
      const error = searchParams.get('error');

      if (error) {
        setMessage(`Authentication failed: ${error}`);
        setTimeout(() => router.push('/login'), 3000);
        return;
      }

      if (!token) {
        setMessage('No authentication token received');
        setTimeout(() => router.push('/login'), 3000);
        return;
      }

      localStorage.setItem('jwt_token', token);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }

      if (userParam) {
        try {
          const decodedUser = decodeURIComponent(userParam);
          let userObj;
          
          try {
            userObj = JSON.parse(decodedUser);
          } catch {
            userObj = {
              name: decodedUser,
              email: '',
              role: 'ADMIN',
              emailVerified: true
            };
          }

          if (!userObj.role) userObj.role = 'ADMIN';
          if (userObj.emailVerified === undefined) userObj.emailVerified = true;

          localStorage.setItem('user_data', JSON.stringify(userObj));
        } catch (error) {
          console.error('Error processing user data:', error);
        }
      }

      setMessage('Authentication successful! Redirecting...');
      const redirectTo = sessionStorage.getItem('redirectAfterAuth') || '/admin';
      sessionStorage.removeItem('redirectAfterAuth');
      
      setTimeout(() => {
        router.replace(redirectTo);
      }, 500);
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-dark-950 dark:to-dark-900">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-card dark:shadow-dark-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-secondary-800 dark:text-white mb-2">
            Authentication
          </h2>
          <p className="text-secondary-600 dark:text-dark-300">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-dark-950 dark:to-dark-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
} 
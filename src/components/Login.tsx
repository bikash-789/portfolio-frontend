'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { ADMIN_CONFIG, ADMIN_UI_TEXT, ADMIN_STYLES } from '../constants';

const LoginIcon = () => (
  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const LoadingSpinner = ({ size = 'h-12 w-12' }: { size?: string }) => (
  <div className={`animate-spin rounded-full ${size} border-b-2 border-primary-500`}></div>
);

export default function Login() {
  const router = useRouter();
  const { isAuthenticated, isLoading, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push(ADMIN_CONFIG.ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, isLoading, router]);

  const renderLoadingState = () => (
    <div className={`min-h-screen flex items-center justify-center ${ADMIN_STYLES.GRADIENT_BG}`}>
      <LoadingSpinner />
    </div>
  );

  const renderRedirectingState = () => (
    <div className={`min-h-screen flex items-center justify-center ${ADMIN_STYLES.GRADIENT_BG}`}>
      <div className="text-center">
        <LoadingSpinner size="h-8 w-8" />
        <p className="text-secondary-600 dark:text-dark-300 mt-4">
          {ADMIN_UI_TEXT.LOGIN.REDIRECTING}
        </p>
      </div>
    </div>
  );

  if (isLoading) return renderLoadingState();
  if (isAuthenticated) return renderRedirectingState();

  return (
    <div className={`min-h-screen flex items-center justify-center ${ADMIN_STYLES.GRADIENT_BG} px-4`}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mb-6">
            <LoginIcon />
          </div>
          <h2 className="text-3xl font-bold text-secondary-800 dark:text-white mb-2">
            {ADMIN_UI_TEXT.LOGIN.TITLE}
          </h2>
          <p className="text-secondary-600 dark:text-dark-300">
            {ADMIN_UI_TEXT.LOGIN.SUBTITLE}
          </p>
        </div>

        <div className={`${ADMIN_STYLES.CARD_BG} rounded-2xl ${ADMIN_STYLES.SHADOW} p-8`}>
          <button
            onClick={login}
            className="w-full flex justify-center items-center py-3 px-4 border border-secondary-300 dark:border-dark-600 rounded-lg shadow-sm text-sm font-medium text-secondary-700 dark:text-dark-300 bg-white dark:bg-dark-700 hover:bg-secondary-50 dark:hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 transform hover:scale-[1.02]"
          >
            <GoogleIcon />
            Sign in with Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs text-secondary-500 dark:text-dark-400">
              Secure admin login for portfolio management
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
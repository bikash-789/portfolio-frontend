'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import StatusManager from '@/components/admin/StatusManager';
import { ADMIN_STYLES, ADMIN_CONFIG } from '@/constants';

const LoadingView = () => (
  <div className={`min-h-screen flex items-center justify-center ${ADMIN_STYLES.GRADIENT_BG}`}>
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
      <p className="text-secondary-600 dark:text-dark-300">Loading status management...</p>
    </div>
  </div>
);

const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className={ADMIN_STYLES.BACK_BUTTON}>
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </button>
);

export default function AdminStatus() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(ADMIN_CONFIG.ROUTES.LOGIN);
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return <LoadingView />;
  }

  return (
    <div className={`min-h-screen ${ADMIN_STYLES.GRADIENT_BG}`}>
      <header className={ADMIN_STYLES.HEADER}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <BackButton onClick={() => router.back()} />
              <h1 className="text-xl font-bold text-secondary-800 dark:text-white">
                Status Management
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-secondary-800 dark:text-white mb-2">
            Live Status Updates
          </h2>
          <p className="text-secondary-600 dark:text-dark-300">
            Manage your GitHub-like live status that appears on your portfolio. Set your current activity, mood, or availability status.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <StatusManager />
          </div>
        </div>
      </main>
    </div>
  );
} 
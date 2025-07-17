'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { personalApi, PersonalInfo } from '@/lib/api/services/personal';
import ProfileForm from '@/components/admin/ProfileForm';

import { ADMIN_STYLES, ADMIN_PAGES, MESSAGE_TIMING } from '@/constants';

const LoadingView = () => (
  <div className={`min-h-screen flex items-center justify-center ${ADMIN_STYLES.GRADIENT_BG}`}>
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
      <p className="text-secondary-600 dark:text-dark-300">Loading profile...</p>
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

const SuccessMessage = ({ message }: { message: string }) => (
  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span className="text-sm font-medium">{message}</span>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span className="text-sm font-medium">{message}</span>
  </div>
);

export default function AdminProfile() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await personalApi.getPersonalInfo();
        setPersonalInfo(data);
      } catch {
        setError('Failed to load personal information. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPersonalInfo();
    }
  }, [isAuthenticated]);

  const handleSubmit = async (data: PersonalInfo) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const updatedData = await personalApi.updatePersonalInfo(data);
      setPersonalInfo(updatedData);
      setSuccess('Profile updated successfully!');
      
      setTimeout(() => setSuccess(null), MESSAGE_TIMING.SUCCESS_HIDE_DELAY);
    } catch {
      setError('Failed to update profile. Please try again.');
      setTimeout(() => setError(null), MESSAGE_TIMING.ERROR_HIDE_DELAY);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
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
                {ADMIN_PAGES.PROFILE.TITLE}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {success && <SuccessMessage message={success} />}
              {error && <ErrorMessage message={error} />}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full overflow-hidden">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-secondary-800 dark:text-white mb-2">
            {ADMIN_PAGES.PROFILE.SUBTITLE}
          </h2>
          <p className="text-secondary-600 dark:text-dark-300">
            {ADMIN_PAGES.PROFILE.DESCRIPTION}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <ProfileForm
            onSubmit={handleSubmit}
            loading={saving}
            initialData={personalInfo || undefined}
          />
        </div>
      </main>
    </div>
  );
} 
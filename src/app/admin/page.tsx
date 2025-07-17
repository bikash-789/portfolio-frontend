'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_CONFIG, ADMIN_UI_TEXT, ADMIN_STYLES } from '../../constants';

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  color: 'blue' | 'green' | 'teal' | 'purple' | 'orange';
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  icon, 
  title, 
  description, 
  buttonText, 
  onClick, 
  color 
}) => {
  const colorClasses = {
    blue: { 
      iconBg: 'bg-blue-100 dark:bg-blue-900/20', 
      iconColor: 'text-blue-600 dark:text-blue-400',
      button: 'bg-blue-600 hover:bg-blue-700'
    },
    green: { 
      iconBg: 'bg-green-100 dark:bg-green-900/20', 
      iconColor: 'text-green-600 dark:text-green-400',
      button: 'bg-green-600 hover:bg-green-700'
    },
    teal: { 
      iconBg: 'bg-teal-100 dark:bg-teal-900/20', 
      iconColor: 'text-teal-600 dark:text-teal-400',
      button: 'bg-teal-600 hover:bg-teal-700'
    },
    purple: { 
      iconBg: 'bg-purple-100 dark:bg-purple-900/20', 
      iconColor: 'text-purple-600 dark:text-purple-400',
      button: 'bg-purple-600 hover:bg-purple-700'
    },
    orange: { 
      iconBg: 'bg-orange-100 dark:bg-orange-900/20', 
      iconColor: 'text-orange-600 dark:text-orange-400',
      button: 'bg-orange-600 hover:bg-orange-700'
    },
  };

  const classes = colorClasses[color];

  return (
    <div className={`${ADMIN_STYLES.CARD_BG} rounded-xl ${ADMIN_STYLES.SHADOW} p-6 hover:shadow-hover dark:hover:shadow-dark-hover transition-shadow duration-300`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className={`h-10 w-10 ${classes.iconBg} rounded-lg flex items-center justify-center`}>
          <div className={`h-6 w-6 ${classes.iconColor}`}>
            {icon}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-secondary-800 dark:text-white">
          {title}
        </h3>
      </div>
      <p className="text-secondary-600 dark:text-dark-300 mb-4">
        {description}
      </p>
      <button 
        onClick={onClick}
        className={`w-full px-4 py-2 ${classes.button} text-white rounded-lg transition-colors duration-300`}
      >
        {buttonText}
      </button>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className={`min-h-screen flex items-center justify-center ${ADMIN_STYLES.GRADIENT_BG}`}>
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
      <p className="text-secondary-600 dark:text-dark-300">{ADMIN_UI_TEXT.LOGIN.LOADING_DASHBOARD}</p>
    </div>
  </div>
);

const AdminIcon = () => (
  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ADMIN_CONFIG.ROUTES.LOGIN);
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleViewPortfolio = () => {
    window.open('/', '_blank');
  };

  const dashboardCards = [
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: 'Projects',
      description: 'Manage your portfolio projects, add new ones, and update existing content.',
      buttonText: ADMIN_UI_TEXT.DASHBOARD.MANAGE_PROJECTS,
      onClick: () => router.push(ADMIN_CONFIG.ROUTES.PROJECTS),
      color: 'blue' as const,
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Messages',
      description: 'View and respond to contact form submissions from visitors.',
      buttonText: ADMIN_UI_TEXT.DASHBOARD.MANAGE_CONTACT,
      onClick: () => router.push(ADMIN_CONFIG.ROUTES.CONTACT),
      color: 'green' as const,
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Quick Actions',
      description: 'Quick access to common admin tasks and shortcuts.',
      buttonText: ADMIN_UI_TEXT.DASHBOARD.ADD_PROJECT,
      onClick: () => router.push(ADMIN_CONFIG.ROUTES.NEW_PROJECT),
      color: 'teal' as const,
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: 'Profile Management',
      description: 'Update your personal information, images, and social media links.',
      buttonText: ADMIN_UI_TEXT.DASHBOARD.EDIT_PROFILE,
      onClick: () => router.push(ADMIN_CONFIG.ROUTES.PROFILE),
      color: 'purple' as const,
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'Skills Management',
      description: 'Manage your technical skills, proficiency levels, and categories.',
      buttonText: ADMIN_UI_TEXT.DASHBOARD.MANAGE_SKILLS,
      onClick: () => router.push(ADMIN_CONFIG.ROUTES.SKILLS),
      color: 'orange' as const,
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      title: 'Status Management',
      description: 'Manage your live status updates that appear on your portfolio homepage.',
      buttonText: ADMIN_UI_TEXT.DASHBOARD.MANAGE_STATUS,
      onClick: () => router.push(ADMIN_CONFIG.ROUTES.STATUS),
      color: 'purple' as const,
    },
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className={`min-h-screen ${ADMIN_STYLES.GRADIENT_BG}`}>
      <header className={`${ADMIN_STYLES.CARD_BG} ${ADMIN_STYLES.SHADOW}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <AdminIcon />
              </div>
              <h1 className="text-xl font-bold text-secondary-800 dark:text-white">
                {ADMIN_UI_TEXT.DASHBOARD.TITLE}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-secondary-600 dark:text-dark-300">
                {ADMIN_UI_TEXT.DASHBOARD.WELCOME}, {user?.name || 'Admin'}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300"
              >
                {ADMIN_UI_TEXT.DASHBOARD.LOGOUT}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
          
          <div className={`${ADMIN_STYLES.CARD_BG} rounded-xl ${ADMIN_STYLES.SHADOW} p-6`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-secondary-100 dark:bg-secondary-900/20 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-800 dark:text-white">
                Portfolio Preview
              </h3>
            </div>
            <p className="text-secondary-600 dark:text-dark-300 mb-4">
              View your live portfolio as visitors see it.
            </p>
            <button 
              onClick={handleViewPortfolio}
              className="w-full px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg transition-colors duration-300"
            >
              {ADMIN_UI_TEXT.DASHBOARD.VIEW_PORTFOLIO}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 
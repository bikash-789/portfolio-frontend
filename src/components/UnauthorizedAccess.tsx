import React from 'react';
import { ShieldExclamation } from 'react-bootstrap-icons';

interface UnauthorizedAccessProps {
  message?: string;
  showReturnButton?: boolean;
  onReturn?: () => void;
}

const UnauthorizedAccess: React.FC<UnauthorizedAccessProps> = ({
  message = 'Access denied. Only authorized users can access this area.',
  showReturnButton = true,
  onReturn
}) => {
  const handleReturn = () => {
    if (onReturn) {
      onReturn();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-dark-950 dark:to-dark-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-8">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
            <ShieldExclamation className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-red-800 dark:text-red-400 mb-4">
            Access Denied
          </h2>
          
          <p className="text-red-600 dark:text-red-300 mb-6 leading-relaxed">
            {message}
          </p>
          
          {showReturnButton && (
            <button
              onClick={handleReturn}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              Return to Home
            </button>
          )}
          
          <div className="mt-6 text-xs text-red-500 dark:text-red-400">
            If you believe this is an error, please contact the administrator.
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedAccess; 

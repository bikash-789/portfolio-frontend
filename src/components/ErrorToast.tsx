'use client';

import React, { useEffect, useState } from 'react';
import { ExclamationTriangle, X, InfoCircle, CheckCircle, ExclamationCircle } from 'react-bootstrap-icons';

export type ToastType = 'error' | 'warning' | 'info' | 'success';

export interface ErrorToastProps {
  isVisible: boolean;
  onClose: () => void;
  message: string;
  type?: ToastType;
  duration?: number;
  showCloseButton?: boolean;
  className?: string;
}

const ErrorToast: React.FC<ErrorToastProps> = ({
  isVisible,
  onClose,
  message,
  type = 'error',
  duration = 5000,
  showCloseButton = true,
  className = '',
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      
      if (duration > 0) {
        const timer = setTimeout(() => {
          onClose();
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <ExclamationTriangle className="text-red-500" />;
      case 'warning':
        return <ExclamationCircle className="text-yellow-500" />;
      case 'info':
        return <InfoCircle className="text-blue-500" />;
      case 'success':
        return <CheckCircle className="text-green-500" />;
      default:
        return <ExclamationTriangle className="text-red-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      default:
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    }
  };

  if (!isVisible && !isAnimating) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div
        className={`
          transform transition-all duration-300 ease-in-out
          ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
          ${getBgColor()}
          border rounded-lg shadow-lg p-4 ${className}
        `}
        onTransitionEnd={() => {
          if (!isVisible) {
            setIsAnimating(false);
          }
        }}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {message}
            </p>
          </div>

          {showCloseButton && (
            <button
              onClick={onClose}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="text-lg" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorToast; 
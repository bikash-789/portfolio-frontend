'use client';

import React from 'react';
import { ExclamationTriangle, X, ArrowCounterclockwise, Bug } from 'react-bootstrap-icons';

export interface ErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  error?: Error | unknown;
  showDetails?: boolean;
  onRetry?: () => void;
  onReport?: () => void;
  retryLabel?: string;
  className?: string;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({
  isOpen,
  onClose,
  title = 'Error',
  message,
  error,
  showDetails = false,
  onRetry,
  onReport,
  retryLabel = 'Try Again',
  className = '',
}) => {
  const [showErrorDetails, setShowErrorDetails] = React.useState(false);

  if (!isOpen) return null;

  const getErrorDetails = () => {
    if (!error) return null;
    
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }
    
    return { raw: JSON.stringify(error, null, 2) };
  };

  const errorDetails = getErrorDetails();

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className={`bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-md w-full mx-4 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center space-x-3">
            <ExclamationTriangle className="text-red-500 text-xl" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {message}
          </p>

          {/* Error Details Toggle */}
          {showDetails && errorDetails && (
            <div className="mt-4">
              <button
                onClick={() => setShowErrorDetails(!showErrorDetails)}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center space-x-1"
              >
                <Bug className="text-sm" />
                <span>{showErrorDetails ? 'Hide' : 'Show'} technical details</span>
              </button>

              {showErrorDetails && (
                <div className="mt-3 p-3 bg-gray-100 dark:bg-dark-700 rounded border text-xs font-mono text-gray-600 dark:text-gray-300 max-h-32 overflow-auto">
                  {errorDetails.name && <div><strong>Name:</strong> {errorDetails.name}</div>}
                  {errorDetails.message && <div><strong>Message:</strong> {errorDetails.message}</div>}
                  {errorDetails.stack && <div><strong>Stack:</strong><pre className="whitespace-pre-wrap mt-1">{errorDetails.stack}</pre></div>}
                  {errorDetails.raw && <div><strong>Details:</strong><pre className="whitespace-pre-wrap mt-1">{errorDetails.raw}</pre></div>}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-6 pt-0">
          {onReport && (
            <button
              onClick={onReport}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors"
            >
              Report Issue
            </button>
          )}
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center space-x-2"
            >
              <ArrowCounterclockwise />
              <span>{retryLabel}</span>
            </button>
          )}
          
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDialog; 
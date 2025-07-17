'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ExclamationTriangle, ArrowCounterclockwise, House } from 'react-bootstrap-icons';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    console.error('ErrorBoundary caught an error:', error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-dark-800 rounded-lg shadow-xl p-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                <ExclamationTriangle className="text-red-500 text-2xl" />
              </div>
            </div>

            <h1 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
              Something went wrong
            </h1>

            <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
              We encountered an unexpected error. Please try refreshing the page or go back to the homepage.
            </p>

            {this.props.showDetails && process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 dark:bg-dark-700 rounded border">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Error Details (Development Only)
                </h3>
                <div className="text-xs font-mono text-gray-600 dark:text-gray-300 max-h-32 overflow-auto">
                  <div><strong>Error:</strong> {this.state.error.message}</div>
                  {this.state.error.stack && (
                    <div className="mt-2">
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">{this.state.error.stack}</pre>
                    </div>
                  )}
                  {this.state.errorInfo && (
                    <div className="mt-2">
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">{this.state.errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </div>
            )}
    
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <ArrowCounterclockwise />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                <House />
                <span>Go Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 
'use client';

import { useState, useCallback } from 'react';
import { errorUtils } from '../lib/api/utils';

export interface ErrorState {
  message: string;
  error?: Error | unknown;
  timestamp: number;
}

export interface UseErrorReturn {
  toastError: ErrorState | null;
  showToast: (message: string, error?: Error | unknown) => void;
  hideToast: () => void;
  dialogError: ErrorState | null;
  showDialog: (message: string, error?: Error | unknown) => void;
  hideDialog: () => void;
  
  handleError: (error: unknown, showToast?: boolean, showDialog?: boolean) => void;
  clearAllErrors: () => void;
}

export const useError = (): UseErrorReturn => {
  const [toastError, setToastError] = useState<ErrorState | null>(null);
  const [dialogError, setDialogError] = useState<ErrorState | null>(null);

  const showToast = useCallback((message: string, error?: Error | unknown) => {
    setToastError({
      message,
      error,
      timestamp: Date.now(),
    });
  }, []);

  const hideToast = useCallback(() => {
    setToastError(null);
  }, []);

  const showDialog = useCallback((message: string, error?: Error | unknown) => {
    setDialogError({
      message,
      error,
      timestamp: Date.now(),
    });
  }, []);

  const hideDialog = useCallback(() => {
    setDialogError(null);
  }, []);

  const handleError = useCallback((
    error: unknown, 
    showToastNotification = true, 
    showDialogNotification = false
  ) => {
    const userMessage = errorUtils.getErrorMessage(error);
    
    errorUtils.logError(error, 'useError hook');

    if (showToastNotification) {
      showToast(userMessage, error);
    }
    
    if (showDialogNotification) {
      showDialog(userMessage, error);
    }
  }, [showToast, showDialog]);

  const clearAllErrors = useCallback(() => {
    setToastError(null);
    setDialogError(null);
  }, []);

  return {
    toastError,
    showToast,
    hideToast,
    dialogError,
    showDialog,
    hideDialog,
    handleError,
    clearAllErrors,
  };
};

export default useError; 
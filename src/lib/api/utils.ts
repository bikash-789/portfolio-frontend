import { ApiError } from './client';


export const sessionUtils = {
  generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  getSessionId(): string {
    if (typeof window === 'undefined') return '';
    
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = sessionUtils.generateSessionId();
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  },

  clearSession(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('sessionId');
    }
  }
};

export const errorUtils = {
  isNetworkError(error: unknown): boolean {
    return error instanceof ApiError && error.status === 0;
  },

  isTimeoutError(error: unknown): boolean {
    return error instanceof ApiError && error.message.includes('timeout');
  },

  isServerError(error: unknown): boolean {
    return error instanceof ApiError && error.status >= 500;
  },

  isClientError(error: unknown): boolean {
    return error instanceof ApiError && error.status >= 400 && error.status < 500;
  },

  getErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
      switch (error.status) {
        case 400:
          return 'Invalid request. Please check your input.';
        case 401:
          return 'You are not authorized to perform this action.';
        case 403:
          return 'Access denied. You don\'t have permission for this action.';
        case 404:
          return 'The requested resource was not found.';
        case 409:
          return 'This resource already exists.';
        case 422:
          return 'Validation failed. Please check your input.';
        case 429:
          return 'Too many requests. Please try again later.';
        case 500:
          return 'Server error. Please try again later.';
        case 503:
          return 'Service temporarily unavailable. Please try again later.';
        default:
          return error.message || 'An unexpected error occurred.';
      }
    }
    
    if (error instanceof Error) {
      return error.message;
    }
    
    return 'An unexpected error occurred.';
  },

  logError(error: unknown, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.error(`API Error${context ? ` (${context})` : ''}:`, error);
    }
  }
};

export const dataUtils = {
  parseDate(dateString: string): Date {
    return new Date(dateString);
  },

  formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    });
  },

  formatDateTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  throttle<T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle = false;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
};

export const validationUtils = {
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  validateRequired(data: Record<string, unknown>, requiredFields: string[]): string[] {
    const errors: string[] = [];
    
    requiredFields.forEach(field => {
      if (!data[field] || (typeof data[field] === 'string' && (data[field] as string).trim() === '')) {
        errors.push(`${field} is required`);
      }
    });
    
    return errors;
  },

  validateLength(value: string, min: number, max: number): boolean {
    return value.length >= min && value.length <= max;
  }
};

export const cacheUtils = {
  cache: new Map<string, { data: unknown; timestamp: number; ttl: number }>(),

  set(key: string, data: unknown, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  },

  get(key: string): unknown | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > item.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  },

  clear(): void {
    this.cache.clear();
  },

  remove(key: string): void {
    this.cache.delete(key);
  }
}; 
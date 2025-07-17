import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, API_ENDPOINTS } from './config/environment';

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private client: AxiosInstance;
  private retryCount = 0;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getAuthToken();
        if (token) {
          if (!config.headers) config.headers = new axios.AxiosHeaders();
          (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: unknown) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = (error.config || {}) as { _retry?: boolean; headers?: Record<string, string> };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshToken();
            const token = this.getAuthToken();
            if (token) {
              if (!originalRequest.headers) originalRequest.headers = {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest as AxiosRequestConfig);
            }
          } catch {
            this.clearAuth();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('jwt_token');
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  }

  private clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
        { refreshToken }
      );

      const { token, refreshToken: newRefreshToken } = response.data;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('refresh_token', newRefreshToken);
      }
    } catch {
      throw new Error('Token refresh failed');
    }
  }

  private async request<T>(
    config: AxiosRequestConfig,
    retries = API_CONFIG.MAX_RETRIES
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client(config);
      return response.data;
    } catch (error: unknown) {
      if (retries > 0 && this.shouldRetry(error)) {
        await this.delay(API_CONFIG.RETRY_DELAY);
        return this.request(config, retries - 1);
      }
      throw this.handleError(error);
    }
  }

  private shouldRetry(error: unknown): boolean {
    if (axios.isAxiosError(error)) {
      return !!(
        error.code === 'ECONNABORTED' ||
        error.code === 'ERR_NETWORK' ||
        (error.response && error.response.status >= 500)
      );
    }
    return false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private handleError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return new ApiError(
          error.response.status,
          (error.response.data as { message?: string })?.message || error.response.statusText,
          error.response.data
        );
      } else if (error.request) {
        return new ApiError(
          0,
          'No response from server. Please check your internet connection.',
          error.request
        );
      } else {
        return new ApiError(
          0,
          error.message || 'An unexpected error occurred.',
          error
        );
      }
    }
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return new ApiError(0, message, error);
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async upload<T>(url: string, file: File, config?: AxiosRequestConfig): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<T>({
      ...config,
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async download(url: string, filename?: string): Promise<void> {
    try {
      const response = await this.client.get(url, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }
}

export const apiClient = new ApiClient();

export type { AxiosRequestConfig, AxiosResponse }; 
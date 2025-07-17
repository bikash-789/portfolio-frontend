import { API_ENDPOINTS } from '../config/environment';

export interface User {
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  emailVerified: boolean;
}

export const authService = {
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  },

  getUser(): User | null {
    const userData = localStorage.getItem('user_data');
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'ADMIN';
  },

  clearAuth(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  },

  async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  },

  async getUserProfile(): Promise<User> {
    const response = await this.makeAuthenticatedRequest(API_ENDPOINTS.AUTH.PROFILE);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    
    return response.json();
  },
}; 
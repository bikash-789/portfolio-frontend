import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config/environment';

export interface TestEmailRequest {
  email: string;
  type?: 'verification' | 'reset' | 'contact';
}

export interface TestEmailResponse {
  message: string;
  email: string;
  type: string;
}

export interface HealthCheckResponse {
  status: string;
  service: string;
  timestamp: string;
}

export const testApi = {
  async sendTestEmail(data: TestEmailRequest): Promise<TestEmailResponse> {
    const response = await apiClient.post<TestEmailResponse>(API_ENDPOINTS.TEST.EMAIL, data);
    return response;
  },

  async healthCheck(): Promise<HealthCheckResponse> {
    const response = await apiClient.get<HealthCheckResponse>(API_ENDPOINTS.TEST.HEALTH);
    return response;
  }
}; 
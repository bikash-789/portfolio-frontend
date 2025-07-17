import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config/environment';

// Personal information interface
export interface PersonalInfo {
  name: string;
  title: string;
  description: string;
  email: string;
  phone?: string;
  location?: string;
  profileImage?: string;
  heroImage?: string;
  socialLinks?: {
    name: string;
    url: string;
    icon?: string;
  }[];
}

// Personal API service
export const personalApi = {
  // Get personal information (admin only)
  async getPersonalInfo(): Promise<PersonalInfo> {
    const response = await apiClient.get<PersonalInfo>(API_ENDPOINTS.AUTH.PROFILE);
    return response;
  },

  // Update personal information (admin only)
  async updatePersonalInfo(data: Partial<PersonalInfo>): Promise<PersonalInfo> {
    const response = await apiClient.put<PersonalInfo>(API_ENDPOINTS.AUTH.PROFILE, data);
    return response;
  }
}; 
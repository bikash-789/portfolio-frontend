import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config/environment';
import { STATUS_SERVICE } from '@/constants';

export interface UserStatus {
  id: string;
  emoji: string;
  message: string;
  isActive: boolean;
  predefinedStatusId?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStatusRequest {
  emoji: string;
  message: string;
  predefinedStatusId?: string;
  clearAfter?: number | 'today' | 'week' | 'never';
}

export interface UpdateStatusRequest {
  emoji?: string;
  message?: string;
  predefinedStatusId?: string;
  isActive?: boolean;
  clearAfter?: number | 'today' | 'week' | 'never';
}

export interface PublicStatus {
  emoji: string;
  message: string;
  isActive: boolean;
  lastUpdated: string;
}

export const statusApi = {
  async getCurrentStatus(): Promise<PublicStatus | null> {
    try {
      const response = await apiClient.get<PublicStatus>(API_ENDPOINTS.STATUS.CURRENT);
      return response;
    } catch {
      return null;
    }
  },

  async getMyStatus(): Promise<UserStatus | null> {
    try {
      const response = await apiClient.get<UserStatus>(API_ENDPOINTS.STATUS.MY_STATUS);
      return response;
    } catch {
      return null;
    }
  },

  async setStatus(data: CreateStatusRequest): Promise<UserStatus> {
    const response = await apiClient.post<UserStatus>(API_ENDPOINTS.STATUS.SET, data);
    return response;
  },

  async updateStatus(statusId: string, data: UpdateStatusRequest): Promise<UserStatus> {
    const response = await apiClient.put<UserStatus>(API_ENDPOINTS.STATUS.UPDATE(statusId), data);
    return response;
  },

  async clearStatus(): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.STATUS.CLEAR);
  },

  async getStatusHistory(limit: number = STATUS_SERVICE.DEFAULT_HISTORY_LIMIT): Promise<UserStatus[]> {
    const response = await apiClient.get<UserStatus[]>(`${API_ENDPOINTS.STATUS.HISTORY}?limit=${limit}`);
    return response;
  },
}; 
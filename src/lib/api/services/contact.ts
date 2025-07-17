import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config/environment';

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  ipAddress?: string;
  userAgent?: string;
  notes?: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFilters {
  page?: number;
  limit?: number;
  status?: 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED';
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ContactsResponse {
  messages: Contact[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ContactStats {
  total: number;
  unread: number;
  read: number;
  replied: number;
  archived: number;
  thisWeek: number;
  thisMonth: number;
}

export const contactApi = {
  async submitContact(data: ContactSubmission): Promise<Contact> {
    const response = await apiClient.post<Contact>(API_ENDPOINTS.CONTACT.SUBMIT, data);
    return response;
  },

  async getContacts(filters?: ContactFilters): Promise<ContactsResponse> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    
    const queryString = params.toString();
    const url = queryString ? `${API_ENDPOINTS.CONTACT.LIST}?${queryString}` : API_ENDPOINTS.CONTACT.LIST;
    
    const response = await apiClient.get<ContactsResponse>(url);
    return response;
  },

  async getContactById(id: string): Promise<Contact> {
    const response = await apiClient.get<Contact>(API_ENDPOINTS.CONTACT.BY_ID(id));
    return response;
  },

  async updateContact(id: string, data: Partial<Pick<Contact, 'status' | 'notes'>>): Promise<Contact> {
    const response = await apiClient.put<Contact>(API_ENDPOINTS.CONTACT.UPDATE(id), data);
    return response;
  },

  async deleteContact(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(API_ENDPOINTS.CONTACT.DELETE(id));
    return response;
  },

  async getContactStats(): Promise<ContactStats> {
    const response = await apiClient.get<ContactStats>(API_ENDPOINTS.CONTACT.STATS);
    return response;
  },

  async markAsRead(id: string): Promise<Contact> {
    const response = await apiClient.put<Contact>(API_ENDPOINTS.CONTACT.MARK_READ(id), {});
    return response;
  },

  async markAsReplied(id: string): Promise<Contact> {
    const response = await apiClient.put<Contact>(API_ENDPOINTS.CONTACT.MARK_REPLIED(id), {});
    return response;
  },

  async archiveContact(id: string): Promise<Contact> {
    const response = await apiClient.put<Contact>(API_ENDPOINTS.CONTACT.ARCHIVE(id), {});
    return response;
  }
}; 
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config/environment';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  features?: string[];
  slug: string;
  category?: string;
  featured: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  longDescription?: string;
  image?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  features?: string[];
  slug: string;
  category?: string;
  featured?: boolean;
  startDate?: string;
  endDate?: string;
}

export type UpdateProjectRequest = Partial<CreateProjectRequest>;

export interface ProjectFilters {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const projectsApi = {
  async getProjects(filters?: ProjectFilters): Promise<ProjectsResponse> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.category) params.append('category', filters.category);
    if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters?.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    const url = queryString ? `${API_ENDPOINTS.PROJECTS.LIST}?${queryString}` : API_ENDPOINTS.PROJECTS.LIST;
    
    const response = await apiClient.get<ProjectsResponse>(url);
    return response;
  },

  async getProjectById(id: string): Promise<Project> {
    const response = await apiClient.get<Project>(API_ENDPOINTS.PROJECTS.BY_ID(id));
    return response;
  },

  async getProjectBySlug(slug: string): Promise<Project> {
    const response = await apiClient.get<Project>(API_ENDPOINTS.PROJECTS.BY_SLUG(slug));
    return response;
  },

  async createProject(data: CreateProjectRequest): Promise<Project> {
    const response = await apiClient.post<Project>(API_ENDPOINTS.PROJECTS.CREATE, data);
    return response;
  },

  async updateProject(id: string, data: UpdateProjectRequest): Promise<Project> {
    const response = await apiClient.put<Project>(API_ENDPOINTS.PROJECTS.UPDATE(id), data);
    return response;
  },

  async deleteProject(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(API_ENDPOINTS.PROJECTS.DELETE(id));
    return response;
  },

  async getFeaturedProjects(): Promise<Project[]> {
    const response = await apiClient.get<Project[]>(API_ENDPOINTS.PROJECTS.FEATURED);
    return response;
  },

  async getProjectsByCategory(category: string, page?: number, limit?: number): Promise<ProjectsResponse> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString();
    const url = queryString ? `${API_ENDPOINTS.PROJECTS.BY_CATEGORY(category)}?${queryString}` : API_ENDPOINTS.PROJECTS.BY_CATEGORY(category);
    
    const response = await apiClient.get<ProjectsResponse>(url);
    return response;
  },

  async searchProjects(query: string, page?: number, limit?: number): Promise<ProjectsResponse> {
    const params = new URLSearchParams({ q: query });
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const url = `${API_ENDPOINTS.PROJECTS.SEARCH}?${params.toString()}`;
    const response = await apiClient.get<ProjectsResponse>(url);
    return response;
  }
}; 
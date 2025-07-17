import { apiClient } from '../client';

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  icon?: string;
  description?: string;
  yearsOfExperience?: number;
  featured?: boolean;
}

export interface CreateSkillRequest {
  name: string;
  category: string;
  level: Skill['level'];
  icon?: string;
  description?: string;
  yearsOfExperience?: number;
  featured?: boolean;
}

export interface UpdateSkillRequest {
  name: string;
  category: string;
  level: Skill['level'];
  icon?: string;
  description?: string;
  yearsOfExperience?: number;
  featured?: boolean;
}

export const skillsApi = {
  async getSkills(): Promise<Skill[]> {
    const response = await apiClient.get<Skill[] | { data?: Skill[]; skills?: Skill[] }>('/skills');
    console.log('Skills API response:', response);
    
    if (response && typeof response === 'object' && !Array.isArray(response)) {
      if (Array.isArray(response.data)) {
        return response.data;
      }
      if (Array.isArray(response.skills)) {
        return response.skills;
      }
    }
    
    if (Array.isArray(response)) {
      return response;
    }
    
    console.error('Unexpected response structure:', response);
    return [];
  },

  async getSkillsByCategory(category: string): Promise<Skill[]> {
    const response = await apiClient.get<Skill[]>(`/skills/category/${category}`);
    return response;
  },

  async createSkill(skill: CreateSkillRequest): Promise<Skill> {
    const response = await apiClient.post<Skill>('/skills', skill);
    return response;
  },

  async updateSkill(id: string, skill: UpdateSkillRequest): Promise<Skill> {
    const response = await apiClient.put<Skill>(`/skills/${id}`, skill);
    return response;
  },

  async deleteSkill(id: string): Promise<void> {
    await apiClient.delete(`/skills/${id}`);
  }
}; 
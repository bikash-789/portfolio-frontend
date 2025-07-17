export { API_CONFIG, API_ENDPOINTS } from './config/environment';

export { apiClient, ApiError } from './client';

export { projectsApi } from './services/projects';
export type { 
  Project, 
  CreateProjectRequest, 
  UpdateProjectRequest, 
  ProjectFilters,
  ProjectsResponse 
} from './services/projects';

export { contactApi } from './services/contact';
export type { 
  Contact, 
  ContactSubmission, 
  ContactFilters, 
  ContactsResponse, 
  ContactStats 
} from './services/contact';

export { personalApi } from './services/personal';
export type { PersonalInfo } from './services/personal';

export { testApi } from './services/test';
export type { 
  TestEmailRequest, 
  TestEmailResponse, 
  HealthCheckResponse 
} from './services/test';


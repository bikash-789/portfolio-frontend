'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { projectsApi, Project, ProjectFilters } from '@/lib/api/services/projects';
import DynamicImage from '@/components/DynamicImage';
import { ADMIN_STYLES, ADMIN_PAGES, STATUS_COLORS } from '@/constants';

type CategoryFilter = 'all' | string;

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

interface FilterState {
  searchTerm: string;
  selectedCategory: CategoryFilter;
  showFeaturedOnly: boolean;
}

const useProjectsManagement = () => {
  const isInitialMount = useRef(true);
  const [state, setState] = useState<ProjectState>({
    projects: [],
    loading: true,
    error: null,
  });

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedCategory: 'all',
    showFeaturedOnly: false,
  });

  const fetchProjects = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const apiFilters: ProjectFilters = {
        search: filters.searchTerm || undefined,
        category: filters.selectedCategory !== 'all' ? filters.selectedCategory : undefined,
        featured: filters.showFeaturedOnly ? true : undefined,
      };
      
      const data = await projectsApi.getProjects(apiFilters);
      setState(prev => ({ 
        ...prev, 
        projects: data?.projects || [], 
        loading: false 
      }));
    } catch (err) {
      console.error('Error fetching projects:', err);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to load projects', 
        projects: [], 
        loading: false 
      }));
    }
  }, [filters.searchTerm, filters.selectedCategory, filters.showFeaturedOnly]);

  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timeoutId = setTimeout(fetchProjects, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchProjects]);

  return {
    ...state,
    filters,
    updateFilters,
    fetchProjects,
  };
};

const useProjectActions = (refetchProjects: () => void) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleEditProject = useCallback((project: Project) => {
    return `/admin/projects/edit/${project.id}`;
  }, []);

  const handleDeleteProject = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!selectedProject) return;
    
    try {
      await projectsApi.deleteProject(selectedProject.id);
      setSelectedProject(null);
      refetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }, [selectedProject, refetchProjects]);

  const resetModals = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return {
    selectedProject,
    handleEditProject,
    handleDeleteProject,
    confirmDelete,
    resetModals,
  };
};

const getDurationText = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months !== 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(diffDays / 365);
    const remainingMonths = Math.floor((diffDays % 365) / 30);
    if (remainingMonths > 0) {
      return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
};

const LoadingView = () => (
  <div className={`min-h-screen flex items-center justify-center ${ADMIN_STYLES.GRADIENT_BG}`}>
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
      <p className="text-secondary-600 dark:text-dark-300">Loading...</p>
    </div>
  </div>
);

const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className={ADMIN_STYLES.BACK_BUTTON}>
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </button>
);

const AddProjectButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-300 flex items-center space-x-2"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
    <span>Add Project</span>
  </button>
);

const SearchInput = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-2">
      Search Projects
    </label>
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={ADMIN_PAGES.PROJECTS.SEARCH_PLACEHOLDER}
        className="w-full px-4 py-2 border border-secondary-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-secondary-900 dark:text-white placeholder-secondary-500 dark:placeholder-dark-400"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-secondary-400 dark:text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  </div>
);

const CategoryFilter = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <div>
    <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-2">
      Category
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border border-secondary-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-secondary-900 dark:text-white"
    >
      {ADMIN_PAGES.PROJECTS.CATEGORIES.map(category => (
        <option key={category} value={category}>
          {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
        </option>
      ))}
    </select>
  </div>
);

const FeaturedFilter = ({ value, onChange }: { value: boolean; onChange: (value: boolean) => void }) => (
  <div>
    <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-2">
      Filter
    </label>
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="featured-only"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 dark:border-dark-600 rounded"
      />
      <label htmlFor="featured-only" className="text-sm text-secondary-700 dark:text-dark-300">
        Featured Only
      </label>
    </div>
  </div>
);

const ProjectTableLoading = () => (
  <div className="p-8 text-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
    <p className="text-secondary-600 dark:text-dark-300">Loading projects...</p>
  </div>
);

const ProjectTableError = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="p-8 text-center">
    <p className="text-red-600 dark:text-red-400">Error loading projects: {error}</p>
    <button
      onClick={onRetry}
      className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-300"
    >
      Try Again
    </button>
  </div>
);

const ProjectTableEmpty = ({ onAddProject }: { onAddProject: () => void }) => (
  <div className="p-8 text-center">
    <svg className="mx-auto h-12 w-12 text-secondary-400 dark:text-dark-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
    <p className="text-secondary-600 dark:text-dark-300">No projects found</p>
    <button
      onClick={onAddProject}
      className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-300"
    >
      Add Your First Project
    </button>
  </div>
);

const ProjectActions = ({ project, onEdit, onDelete }: { 
  project: Project; 
  onEdit: (project: Project) => void; 
  onDelete: (project: Project) => void; 
}) => (
  <div className="flex items-center space-x-2">
    <button
      onClick={() => onEdit(project)}
      className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 transition-colors duration-300"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </button>
    <button
      onClick={() => onDelete(project)}
      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-300"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>
);

const DeleteModal = ({ project, onConfirm, onCancel }: { 
  project: Project | null; 
  onConfirm: () => void; 
  onCancel: () => void; 
}) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${ADMIN_STYLES.CARD_BG} rounded-xl p-6 max-w-md w-full mx-4`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-10 w-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Delete Project
          </h3>
        </div>
        <p className="text-secondary-600 dark:text-dark-300 mb-6">
          Are you sure you want to delete &quot;{project.title}&quot;? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-secondary-700 dark:text-dark-300 hover:text-secondary-900 dark:hover:text-white transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ icon, label, value, colorClass }: { 
  icon: React.ReactNode; 
  label: string; 
  value: number; 
  colorClass: string; 
}) => (
  <div className={`${ADMIN_STYLES.CARD_BG} rounded-xl ${ADMIN_STYLES.SHADOW} p-6`}>
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <div className={`h-8 w-8 ${colorClass} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-secondary-500 dark:text-dark-400">{label}</p>
        <p className="text-2xl font-semibold text-secondary-900 dark:text-white">{value}</p>
      </div>
    </div>
  </div>
);

export default function ProjectsManagement() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { projects, loading, error, filters, updateFilters, fetchProjects } = useProjectsManagement();
  const { selectedProject, handleEditProject, handleDeleteProject, confirmDelete, resetModals } = useProjectActions(fetchProjects);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated, authLoading, router, fetchProjects]);

  if (authLoading) {
    return <LoadingView />;
  }

  const activeProjects = projects.filter(p => !p.endDate || new Date() <= new Date(p.endDate));
  const featuredProjects = projects.filter(p => p.featured);
  const categories = new Set(projects.map(p => p.category));

  const onEditProject = (project: Project) => {
    const editPath = handleEditProject(project);
    router.push(editPath);
  };

  return (
    <div className={`min-h-screen ${ADMIN_STYLES.GRADIENT_BG}`}>
      <header className={ADMIN_STYLES.HEADER}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <BackButton onClick={() => router.back()} />
              <h1 className="text-xl font-bold text-secondary-800 dark:text-white">
                {ADMIN_PAGES.PROJECTS.TITLE}
              </h1>
            </div>
            
            <AddProjectButton onClick={() => router.push('/admin/projects/new')} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`${ADMIN_STYLES.CARD_BG} rounded-xl ${ADMIN_STYLES.SHADOW} p-6 mb-6`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SearchInput value={filters.searchTerm} onChange={(value) => updateFilters({ searchTerm: value })} />
            <CategoryFilter value={filters.selectedCategory} onChange={(value) => updateFilters({ selectedCategory: value })} />
            <FeaturedFilter value={filters.showFeaturedOnly} onChange={(value) => updateFilters({ showFeaturedOnly: value })} />
          </div>
        </div>

        <div className={`${ADMIN_STYLES.CARD_BG} rounded-xl ${ADMIN_STYLES.SHADOW} overflow-hidden`}>
          {loading ? (
            <ProjectTableLoading />
          ) : error ? (
            <ProjectTableError error={error} onRetry={fetchProjects} />
          ) : projects.length === 0 ? (
            <ProjectTableEmpty onAddProject={() => router.push('/admin/projects/new')} />
          ) : (
            <div className="overflow-x-auto scrollbar-hide">
              <table className="min-w-full divide-y divide-secondary-200 dark:divide-dark-700">
                <thead className={ADMIN_STYLES.TABLE_HEADER}>
                  <tr>
                    {Object.values(ADMIN_PAGES.PROJECTS.TABLE_COLUMNS).map((column) => (
                      <th key={column} className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-dark-400 uppercase tracking-wider">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`${ADMIN_STYLES.CARD_BG} divide-y divide-secondary-200 dark:divide-dark-700`}>
                  {projects.map((project) => (
                    <tr key={project.id} className={ADMIN_STYLES.TABLE_ROW_HOVER}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            <DynamicImage
                              src={project.image || '/placeholder-project.png'}
                              alt={project.title}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-lg object-cover"
                              fallbackName={project.title}
                              fallbackShape="square"
                              fallbackSize={48}
                              fallback="/placeholder-project.png"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-secondary-900 dark:text-white">
                              {project.title}
                            </div>
                            <div className="text-sm text-secondary-500 dark:text-dark-400">
                              {project.description.substring(0, 60)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
                          {project.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 3).map((tech, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-secondary-100 dark:bg-secondary-900/20 text-secondary-800 dark:text-secondary-200"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-secondary-100 dark:bg-secondary-900/20 text-secondary-800 dark:text-secondary-200">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-secondary-600 dark:text-dark-300">
                          {project.startDate && project.endDate ? (
                            <div>
                              <div className="font-medium text-secondary-900 dark:text-white">
                                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-secondary-500 dark:text-dark-400">
                                {getDurationText(project.startDate, project.endDate)}
                              </div>
                            </div>
                          ) : project.startDate ? (
                            <div>
                              <div className="font-medium text-secondary-900 dark:text-white">
                                Started: {new Date(project.startDate).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-secondary-500 dark:text-dark-400">
                                Ongoing
                              </div>
                            </div>
                          ) : (
                            <span className="text-secondary-400 dark:text-dark-500">Not specified</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {project.featured && (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS.featured}`}>
                              Featured
                            </span>
                          )}
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS.active}`}>
                            Active
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <ProjectActions 
                          project={project} 
                          onEdit={onEditProject} 
                          onDelete={handleDeleteProject} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            icon={<svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
            label="Total Projects"
            value={projects.length}
            colorClass="bg-blue-100 dark:bg-blue-900/20"
          />
          <StatsCard
            icon={<svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
            label="Featured"
            value={featuredProjects.length}
            colorClass="bg-yellow-100 dark:bg-yellow-900/20"
          />
          <StatsCard
            icon={<svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            label="Active"
            value={activeProjects.length}
            colorClass="bg-green-100 dark:bg-green-900/20"
          />
          <StatsCard
            icon={<svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
            label="Categories"
            value={categories.size}
            colorClass="bg-purple-100 dark:bg-purple-900/20"
          />
        </div>
      </main>

      <DeleteModal 
        project={selectedProject} 
        onConfirm={confirmDelete} 
        onCancel={resetModals} 
      />
    </div>
  );
} 

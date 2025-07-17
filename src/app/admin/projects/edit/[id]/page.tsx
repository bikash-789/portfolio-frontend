'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { projectsApi, CreateProjectRequest, UpdateProjectRequest, Project } from '@/lib/api/services/projects';
import ProjectForm from '@/components/admin/ProjectForm';
import { ADMIN_STYLES, ADMIN_PAGES } from '@/constants';

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

const LoadingView = () => (
  <div className={`min-h-screen flex items-center justify-center ${ADMIN_STYLES.GRADIENT_BG}`}>
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
      <p className="text-secondary-600 dark:text-dark-300">Loading...</p>
    </div>
  </div>
);

const ProjectLoadingView = () => (
  <div className={`min-h-screen flex items-center justify-center ${ADMIN_STYLES.GRADIENT_BG}`}>
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
      <p className="text-secondary-600 dark:text-dark-300">Loading project...</p>
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

export default function EditProject({ params }: EditProjectPageProps) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await projectsApi.getProjectById(id);
        setProject(projectData);
      } catch {
        router.push('/admin/projects');
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id, router]);

  if (authLoading) {
    return <LoadingView />;
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (data: CreateProjectRequest | UpdateProjectRequest) => {
    setLoading(true);
    try {
      await projectsApi.updateProject(id, data as UpdateProjectRequest);
      router.push('/admin/projects');
    } catch {
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return <ProjectLoadingView />;
  }

  return (
    <div className={`min-h-screen ${ADMIN_STYLES.GRADIENT_BG}`}>
      <header className={ADMIN_STYLES.HEADER}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <BackButton onClick={() => router.back()} />
              <h1 className="text-xl font-bold text-secondary-800 dark:text-white">
                {ADMIN_PAGES.PROJECTS.EDIT_TITLE}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectForm
          project={project}
          mode="edit"
          onSubmit={handleSubmit}
          loading={loading}
        />
      </main>
    </div>
  );
} 
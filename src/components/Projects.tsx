'use client';

import React, { useEffect, useState } from 'react';
import { projectsApi, Project } from '../lib/api/services/projects';
import DynamicImage from './DynamicImage';
import Link from 'next/link';
import { 
  ANIMATION_CONFIG, 
  UI_TEXT, 
  LIMITS, 
  SIZES,
  SITE_CONFIG,
  ERROR_MESSAGES 
} from '../constants';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('aos').then((AOS) => {
        AOS.default.init({
          duration: ANIMATION_CONFIG.AOS.DURATION,
          once: ANIMATION_CONFIG.AOS.ONCE,
        });
      });
    }
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await projectsApi.getProjects({ 
          limit: LIMITS.PROJECTS_PER_PAGE,
          page: 1 
        });
        setProjects(response.projects);
        setFilteredProjects(response.projects);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(ERROR_MESSAGES.LOAD_ERROR);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const categories = ['all', ...Array.from(new Set(projects.map((project: Project) => project.category || 'other').filter(Boolean)))];

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter((project: Project) => (project.category || 'other') === category));
    }
  };

  const renderActionButton = (url: string, ariaLabel: string, icon: React.ReactElement) => (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="bg-white text-secondary-800 p-2 rounded-full hover:bg-primary-500 hover:text-white transition-colors duration-300"
      aria-label={ariaLabel}
    >
      {icon}
    </a>
  );

  const renderTechnologies = (technologies: string[]) => (
    <div className="flex flex-wrap gap-2 mb-4">
      {technologies.slice(0, LIMITS.TECHNOLOGIES_PREVIEW).map((tech, techIndex) => (
        <span
          key={techIndex}
          className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-2 py-1 rounded-full text-xs font-medium"
        >
          {tech}
        </span>
      ))}
      {technologies.length > LIMITS.TECHNOLOGIES_PREVIEW && (
        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
          +{technologies.length - LIMITS.TECHNOLOGIES_PREVIEW} more
        </span>
      )}
    </div>
  );

  return (
    <section
      id="projects"
      className="bg-white dark:bg-dark-900 py-20 transition-colors duration-300"
    >
      <div className="container px-4 lg:px-8 mx-auto">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-secondary-800 dark:text-white mb-4">
            {UI_TEXT.SECTIONS.PROJECTS}
          </h2>
          <div className="w-20 h-1 bg-primary-500 mx-auto"></div>
          <p className="mt-6 text-secondary-600 dark:text-dark-300 max-w-2xl mx-auto">
            Here are some of my recent projects. Each one represents a unique challenge and learning experience.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12" data-aos="fade-up" data-aos-delay="50">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-secondary-50 dark:bg-dark-800 text-secondary-600 dark:text-dark-300 hover:bg-primary-50 dark:hover:bg-dark-700'
              }`}
            >
              {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-300"
            >
              {UI_TEXT.BUTTONS.RETRY}
            </button>
          </div>
        )}

        {!loading && !error && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-white dark:bg-dark-800 rounded-xl overflow-hidden shadow-lg dark:shadow-dark-card hover:shadow-xl dark:hover:shadow-dark-hover transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <DynamicImage
                    src={project.image || SITE_CONFIG.FALLBACK_PROJECT_IMAGE}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    fallbackName={project.title}
                    fallbackShape="square"
                    fallbackSize={SIZES.PROJECT_IMAGE}
                    fallback={SITE_CONFIG.FALLBACK_PROJECT_IMAGE}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {project.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {UI_TEXT.FEATURED}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {project.liveUrl && renderActionButton(
                      project.liveUrl,
                      UI_TEXT.BUTTONS.VIEW_LIVE,
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    )}
                    {project.githubUrl && renderActionButton(
                      project.githubUrl,
                      UI_TEXT.BUTTONS.VIEW_SOURCE,
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-secondary-800 dark:text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-secondary-600 dark:text-dark-300 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {renderTechnologies(project.technologies)}

                  <Link
                    href={`/project/${project.slug}`}
                    className="inline-flex items-center text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 font-medium transition-colors duration-300"
                  >
                    {UI_TEXT.BUTTONS.VIEW_DETAILS}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-secondary-600 dark:text-dark-300 mb-4">
              {UI_TEXT.NO_DATA}{selectedCategory !== 'all' ? ` in ${selectedCategory} category` : ''}.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects; 
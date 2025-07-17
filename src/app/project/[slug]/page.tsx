import { projectsApi } from '@/lib/api/services/projects';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  
  let project;
  try {
    project = await projectsApi.getProjectBySlug(slug);
  } catch (error) {
    console.error('Error fetching project:', error);
    notFound();
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="bg-white dark:bg-dark-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/profile.jpeg"
                  alt="Logo"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <span className="text-xl font-bold text-secondary-800 dark:text-white">Bikash</span>
            </Link>
            <Link 
              href="/"
              className="text-secondary-600 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors duration-300"
            >
              ← Back to Portfolio
            </Link>
          </div>
        </div>
      </nav>

      {/* Project Details */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Project Image */}
          <div className="relative">
            <div className="aspect-video rounded-xl overflow-hidden shadow-xl">
              <Image
                src={project.image || '/placeholder-project.png'}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Project Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-secondary-800 dark:text-white mb-4">
                {project.title}
              </h1>
              <p className="text-lg text-secondary-600 dark:text-dark-300 mb-6">
                {project.description}
              </p>
            </div>

            {/* Project Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-secondary-800 dark:text-white mb-2">
                  Project Overview
                </h3>
                <p className="text-secondary-600 dark:text-dark-300">
                  {project.longDescription || project.description}
                </p>
              </div>

              {/* Technologies */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-800 dark:text-white mb-3">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              {project.features && project.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-secondary-800 dark:text-white mb-3">
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-primary-500 dark:text-primary-400 mt-1">•</span>
                        <span className="text-secondary-600 dark:text-dark-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Links */}
              <div className="flex flex-wrap gap-4 pt-4">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-300 font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                    View Live
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center px-6 py-3 border border-secondary-300 dark:border-dark-600 text-secondary-700 dark:text-dark-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-dark-700 transition-colors duration-300 font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                    </svg>
                    View Code
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
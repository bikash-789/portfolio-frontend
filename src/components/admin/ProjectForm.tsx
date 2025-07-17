'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '@/lib/api/services/projects';
import { ProjectFormService, ProjectFormData, ValidationErrors } from '@/utils/projectFormService';
import { ADMIN_FORM_CONFIG, ADMIN_UI_TEXT, ADMIN_STYLES } from '@/constants';

interface ProjectFormProps {
  project?: Project;
  mode: 'create' | 'edit';
  onSubmit: (data: CreateProjectRequest | UpdateProjectRequest) => Promise<void>;
  loading?: boolean;
}

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  type?: 'text' | 'url' | 'date' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  rows?: number;
  min?: string;
  options?: Array<{ value: string; label: string }>;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  required,
  rows,
  min,
  options
}) => {
  const baseClasses = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300 ${ADMIN_STYLES.INPUT}`;
  const errorClasses = error ? 'border-red-500 dark:border-red-400' : 'border-secondary-300 dark:border-dark-600';

  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          className={`${baseClasses} ${errorClasses}`}
          placeholder={placeholder}
        />
      );
    }

    if (type === 'select' && options) {
      return (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`${baseClasses} ${errorClasses}`}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        className={`${baseClasses} ${errorClasses}`}
        placeholder={placeholder}
      />
    );
  };

  return (
    <div>
      <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-2">
        {label} {required && '*'}
      </label>
      {renderInput()}
      {error && (
        <p className={`mt-1 text-sm ${ADMIN_STYLES.ERROR_TEXT}`}>{error}</p>
      )}
    </div>
  );
};

interface TagInputProps {
  label: string;
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder: string;
  buttonText: string;
}

const TagInput: React.FC<TagInputProps> = ({
  label,
  tags,
  onAdd,
  onRemove,
  placeholder,
  buttonText
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className={`${ADMIN_STYLES.CARD_BG} rounded-xl ${ADMIN_STYLES.SHADOW} p-6`}>
      <h3 className="text-lg font-semibold text-secondary-800 dark:text-white mb-4">
        {label}
      </h3>
      <div className="space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className={`flex-1 ${ADMIN_STYLES.INPUT}`}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={handleAdd}
            className={`px-4 py-2 ${ADMIN_STYLES.BUTTON_PRIMARY} rounded-lg transition-colors duration-300`}
          >
            {buttonText}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemove(tag)}
                className="ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  mode,
  onSubmit,
  loading = false
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    longDescription: '',
    image: '',
    technologies: [],
    features: [],
    githubUrl: '',
    liveUrl: '',
    slug: '',
    category: 'web',
    featured: false,
    startDate: '',
    endDate: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (project && mode === 'edit') {
      setFormData({
        title: project.title,
        description: project.description,
        longDescription: project.longDescription || '',
        image: project.image || '',
        technologies: project.technologies || [],
        features: project.features || [],
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        slug: project.slug,
        category: project.category,
        featured: project.featured || false,
        startDate: project.startDate || '',
        endDate: project.endDate || '',
      });
    }
  }, [project, mode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
      
      if (name === 'title' && value) {
        newData.slug = ProjectFormService.generateSlug(value);
      }
      
      return newData;
    });
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const preparedData = ProjectFormService.formatFormData(formData);
    const validationErrors = ProjectFormService.validateAllFields(preparedData);
    
    if (!ProjectFormService.isFormValid(preparedData)) {
      setErrors(validationErrors);
      return;
    }

    setFormData(preparedData);
    
    try {
      await onSubmit(preparedData);
    } catch (error) {
      console.error('Form submission failed:', error);
      alert('Failed to save project. Please check the console for details.');
    }
  };

  const addTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: [...prev.technologies, tech]
    }));
  };

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const addFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), feature]
    }));
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: (prev.features || []).filter(f => f !== feature)
    }));
  };

  const categories = ADMIN_FORM_CONFIG.PROJECT.CATEGORIES.map(cat => ({
    value: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')
  }));

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={`${ADMIN_STYLES.CARD_BG} rounded-xl ${ADMIN_STYLES.SHADOW} p-6`}>
          <h3 className="text-lg font-semibold text-secondary-800 dark:text-white mb-4">
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Project Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              error={errors.title}
              placeholder="Enter project title"
              required
            />

            <FormField
              label="URL Slug"
              name="slug"
              value={formData.slug || ''}
              onChange={handleInputChange}
              error={errors.slug}
              placeholder="auto-generated-from-title"
              required
            />

            <FormField
              label="Category"
              name="category"
              value={formData.category || 'web'}
              onChange={handleInputChange}
              error={errors.category}
              type="select"
              options={categories}
              required
            />

            <FormField
              label="Start Date"
              name="startDate"
              value={formData.startDate || ''}
              onChange={handleInputChange}
              type="date"
            />

            <FormField
              label="End Date"
              name="endDate"
              value={formData.endDate || ''}
              onChange={handleInputChange}
              type="date"
              min={formData.startDate || ''}
            />

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 dark:border-dark-600 rounded"
              />
              <label className="text-sm font-medium text-secondary-700 dark:text-dark-300">
                Featured Project
              </label>
            </div>
          </div>
        </div>

        <div className={`${ADMIN_STYLES.CARD_BG} rounded-xl ${ADMIN_STYLES.SHADOW} p-6`}>
          <h3 className="text-lg font-semibold text-secondary-800 dark:text-white mb-4">
            Description
          </h3>
          
          <div className="space-y-4">
            <FormField
              label="Short Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              error={errors.description}
              type="textarea"
              rows={3}
              placeholder="Brief description of the project"
              required
            />

            <FormField
              label="Detailed Description"
              name="longDescription"
              value={formData.longDescription || ''}
              onChange={handleInputChange}
              type="textarea"
              rows={6}
              placeholder="Detailed description of the project, features, and implementation details"
            />
          </div>
        </div>

        <div className={`${ADMIN_STYLES.CARD_BG} rounded-xl ${ADMIN_STYLES.SHADOW} p-6`}>
          <h3 className="text-lg font-semibold text-secondary-800 dark:text-white mb-4">
            Media & Links
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Project Image URL"
              name="image"
              value={formData.image || ''}
              onChange={handleInputChange}
              error={errors.image}
              type="url"
              placeholder="https://example.com/image.jpg"
              required
            />

            <FormField
              label="GitHub Repository"
              name="githubUrl"
              value={formData.githubUrl || ''}
              onChange={handleInputChange}
              error={errors.githubUrl}
              type="url"
              placeholder="https://github.com/username/repo"
            />

            <FormField
              label="Live Demo URL"
              name="liveUrl"
              value={formData.liveUrl || ''}
              onChange={handleInputChange}
              error={errors.liveUrl}
              type="url"
              placeholder="https://project-demo.com"
            />
          </div>
        </div>

        <TagInput
          label="Technologies"
          tags={formData.technologies}
          onAdd={addTechnology}
          onRemove={removeTechnology}
          placeholder="Add technology (e.g., React, Node.js, MongoDB)"
          buttonText={ADMIN_UI_TEXT.FORMS.ADD}
        />

        <TagInput
          label="Key Features"
          tags={formData.features || []}
          onAdd={addFeature}
          onRemove={removeFeature}
          placeholder="Add feature (e.g., User authentication, Real-time chat)"
          buttonText={ADMIN_UI_TEXT.FORMS.ADD}
        />

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 text-secondary-700 dark:text-dark-300 hover:text-secondary-900 dark:hover:text-white transition-colors duration-300"
          >
            {ADMIN_UI_TEXT.FORMS.CANCEL}
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 ${ADMIN_STYLES.BUTTON_PRIMARY} rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <span>
                {mode === 'create' ? ADMIN_UI_TEXT.FORMS.CREATE : ADMIN_UI_TEXT.FORMS.UPDATE} Project
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm; 
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PersonalInfo } from '../../lib/api/services/personal';
import { validationUtils } from '../../lib/api/utils';

interface ProfileFormProps {
  onSubmit: (data: PersonalInfo) => Promise<void>;
  loading?: boolean;
  initialData?: PersonalInfo;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  onSubmit,
  loading = false,
  initialData
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<PersonalInfo>({
    name: '',
    title: '',
    description: '',
    email: '',
    phone: '',
    location: '',
    profileImage: '',
    heroImage: '',
    socialLinks: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newSocialLink, setNewSocialLink] = useState({
    name: '',
    url: '',
    icon: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        title: initialData.title || '',
        description: initialData.description || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        location: initialData.location || '',
        profileImage: initialData.profileImage || '',
        heroImage: initialData.heroImage || '',
        socialLinks: initialData.socialLinks || []
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.title?.trim()) newErrors.title = 'Title is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    else if (!validationUtils.isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.profileImage && !validationUtils.isValidUrl(formData.profileImage)) {
      newErrors.profileImage = 'Please enter a valid profile image URL';
    }
    if (formData.heroImage && !validationUtils.isValidUrl(formData.heroImage)) {
      newErrors.heroImage = 'Please enter a valid hero image URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch {
    }
  };

  const addSocialLink = () => {
    if (newSocialLink.name.trim() && newSocialLink.url.trim()) {
      if (!validationUtils.isValidUrl(newSocialLink.url)) {
        alert('Please enter a valid URL');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        socialLinks: [...(prev.socialLinks || []), newSocialLink]
      }));
      setNewSocialLink({ name: '', url: '', icon: '' });
    }
  };

  const removeSocialLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-card dark:shadow-dark-card p-6">
          <h3 className="text-lg font-semibold text-secondary-800 dark:text-white mb-4">
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300 ${
                  errors.name 
                    ? 'border-red-500 dark:border-red-400' 
                    : 'border-secondary-300 dark:border-dark-600'
                } bg-white dark:bg-dark-700 text-secondary-900 dark:text-white placeholder-secondary-500 dark:placeholder-dark-400`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300 ${
                  errors.title 
                    ? 'border-red-500 dark:border-red-400' 
                    : 'border-secondary-300 dark:border-dark-600'
                } bg-white dark:bg-dark-700 text-secondary-900 dark:text-white placeholder-secondary-500 dark:placeholder-dark-400`}
                placeholder="e.g., Full Stack Developer"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300 ${
                  errors.email 
                    ? 'border-red-500 dark:border-red-400' 
                    : 'border-secondary-300 dark:border-dark-600'
                } bg-white dark:bg-dark-700 text-secondary-900 dark:text-white placeholder-secondary-500 dark:placeholder-dark-400`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-secondary-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300 bg-white dark:bg-dark-700 text-secondary-900 dark:text-white placeholder-secondary-500 dark:placeholder-dark-400"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-secondary-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300 bg-white dark:bg-dark-700 text-secondary-900 dark:text-white placeholder-secondary-500 dark:placeholder-dark-400"
                placeholder="e.g., San Francisco, CA"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-card dark:shadow-dark-card p-6">
          <h3 className="text-lg font-semibold text-secondary-800 dark:text-white mb-4">
            Description
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-2">
              Bio/Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300 ${
                errors.description 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-secondary-300 dark:border-dark-600'
              } bg-white dark:bg-dark-700 text-secondary-900 dark:text-white placeholder-secondary-500 dark:placeholder-dark-400`}
              placeholder="Brief description about yourself..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-card dark:shadow-dark-card p-6">
          <h3 className="text-lg font-semibold text-secondary-800 dark:text-white mb-4">
            Images
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-2">
                Profile Image URL
              </label>
              <input
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300 ${
                  errors.profileImage 
                    ? 'border-red-500 dark:border-red-400' 
                    : 'border-secondary-300 dark:border-dark-600'
                } bg-white dark:bg-dark-700 text-secondary-900 dark:text-white placeholder-secondary-500 dark:placeholder-dark-400`}
                placeholder="https://example.com/profile.jpg"
              />
              {errors.profileImage && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.profileImage}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-2">
                Hero Background Image URL
              </label>
              <input
                type="url"
                name="heroImage"
                value={formData.heroImage}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300 ${
                  errors.heroImage 
                    ? 'border-red-500 dark:border-red-400' 
                    : 'border-secondary-300 dark:border-dark-600'
                } bg-white dark:bg-dark-700 text-secondary-900 dark:text-white placeholder-secondary-500 dark:placeholder-dark-400`}
                placeholder="https://example.com/hero.jpg"
              />
              {errors.heroImage && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.heroImage}</p>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-card dark:shadow-dark-card p-6">
          <h3 className="text-lg font-semibold text-secondary-800 dark:text-white mb-4">
            Social Links
          </h3>
          
          {/* Add Social Link */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              value={newSocialLink.name}
              onChange={(e) => setNewSocialLink(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Platform name (e.g., GitHub)"
              className="px-4 py-2 border border-secondary-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-secondary-900 dark:text-white placeholder-secondary-500 dark:placeholder-dark-400"
            />
            <input
              type="url"
              value={newSocialLink.url}
              onChange={(e) => setNewSocialLink(prev => ({ ...prev, url: e.target.value }))}
              placeholder="Profile URL"
              className="px-4 py-2 border border-secondary-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-secondary-900 dark:text-white placeholder-secondary-500 dark:placeholder-dark-400"
            />
            <div className="flex gap-2">
              <input
                type="url"
                value={newSocialLink.icon}
                onChange={(e) => setNewSocialLink(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="Icon URL (optional)"
                className="flex-1 px-4 py-2 border border-secondary-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-secondary-900 dark:text-white placeholder-secondary-500 dark:placeholder-dark-400"
              />
              <button
                type="button"
                onClick={addSocialLink}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-300"
              >
                Add
              </button>
            </div>
          </div>

          {/* Social Links List */}
          <div className="space-y-2">
            {(formData.socialLinks || []).map((link, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-dark-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {link.icon && (
                    <Image src={link.icon} alt={link.name} width={20} height={20} className="w-5 h-5" />
                  )}
                  <div>
                    <span className="font-medium text-secondary-900 dark:text-white">{link.name}</span>
                    <p className="text-sm text-secondary-600 dark:text-dark-300">{link.url}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeSocialLink(index)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 text-secondary-700 dark:text-dark-300 hover:text-secondary-900 dark:hover:text-white transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
              <span>Save Profile</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm; 
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { skillsApi, Skill, CreateSkillRequest } from '../../../lib/api/services/skills';
import DynamicImage from '@/components/DynamicImage';

export default function SkillsManagement() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<CreateSkillRequest>({
    name: '',
    category: '',
    level: 'BEGINNER',
    icon: '',
    description: '',
    yearsOfExperience: 0,
    featured: false
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await skillsApi.getSkills();
        
        if (Array.isArray(data)) {
          setSkills(data);
        } else {
          console.error('API response is not an array:', data);
          setSkills([]);
          setError('Invalid data format received from server');
        }
      } catch (err) {
        console.error('Error fetching skills:', err);
        setError('Failed to load skills');
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSkills();
    }
  }, [isAuthenticated]);

  const categories = ['all', ...Array.from(new Set((skills || []).map(skill => skill.category)))];

  const filteredSkills = (skills || []).filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newSkill = await skillsApi.createSkill(formData);
      setSkills([...(skills || []), newSkill]);
      setShowAddModal(false);
      resetForm();
    } catch {
      setError('Failed to add skill');
    }
  };

  const handleEditSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkill) return;
    
    try {
      const updatedSkill = await skillsApi.updateSkill(selectedSkill.id, formData);
      setSkills((skills || []).map(skill => skill.id === selectedSkill.id ? updatedSkill : skill));
      setShowEditModal(false);
      setSelectedSkill(null);
      resetForm();
    } catch {
      setError('Failed to update skill');
    }
  };

  const handleDeleteSkill = async () => {
    if (!selectedSkill) return;
    
    try {
      await skillsApi.deleteSkill(selectedSkill.id);
      setSkills((skills || []).filter(skill => skill.id !== selectedSkill.id));
      setShowDeleteModal(false);
      setSelectedSkill(null);
    } catch {
      setError('Failed to delete skill');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      level: 'BEGINNER',
      icon: '',
      description: '',
      yearsOfExperience: 0,
      featured: false
    });
  };

  const openEditModal = (skill: Skill) => {
    setSelectedSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon || '',
      description: skill.description || '',
      yearsOfExperience: skill.yearsOfExperience || 0,
      featured: skill.featured || false
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (skill: Skill) => {
    setSelectedSkill(skill);
    setShowDeleteModal(true);
  };

  const getLevelColor = (level: Skill['level']) => {
    switch (level) {
      case 'EXPERT': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'ADVANCED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'BEGINNER': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatLevel = (level: Skill['level']) => {
    return level.charAt(0) + level.slice(1).toLowerCase();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-dark-950 dark:to-dark-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-dark-300">Loading skills...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-dark-950 dark:to-dark-900">
      {/* Header */}
      <div className="bg-white dark:bg-dark-800 shadow-sm border-b border-secondary-200 dark:border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="text-secondary-600 dark:text-dark-300 hover:text-secondary-900 dark:hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Skills Management</h1>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Add New Skill
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-secondary-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-secondary-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSkills.map((skill) => (
            <div key={skill.id} className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  {skill.icon ? (
                    <DynamicImage
                      src={skill.icon}
                      alt={skill.name}
                      width={32}
                      height={32}
                      className="dark:invert"
                      fallbackName={skill.name}
                      fallbackShape="square"
                      fallbackSize={32}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon') as HTMLElement;
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-8 h-8 bg-secondary-200 dark:bg-dark-600 rounded-lg flex items-center justify-center fallback-icon ${skill.icon ? 'hidden' : 'flex'}`}
                  >
                    <span className="text-sm font-semibold text-secondary-600 dark:text-dark-300">
                      {skill.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(skill)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => openDeleteModal(skill)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                    {skill.name}
                  </h3>
                  {skill.featured && (
                    <span className="text-yellow-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </span>
                  )}
                </div>
                <p className="text-sm text-secondary-600 dark:text-dark-300">
                  {skill.category}
                </p>
                {skill.description && (
                  <p className="text-xs text-secondary-500 dark:text-dark-400 line-clamp-2">
                    {skill.description}
                  </p>
                )}
                <div className="flex justify-center space-x-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                    {formatLevel(skill.level)}
                  </span>
                  {skill.yearsOfExperience && skill.yearsOfExperience > 0 && (
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200">
                      {skill.yearsOfExperience}y
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-secondary-600 dark:text-dark-300">No skills found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">
              {showAddModal ? 'Add New Skill' : 'Edit Skill'}
            </h2>
            <form onSubmit={showAddModal ? handleAddSkill : handleEditSkill} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-1">
                  Level *
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value as Skill['level']})}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white"
                  required
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-1">
                  Icon URL
                </label>
                <input
                  type="url"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({...formData, yearsOfExperience: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white"
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="mr-2 rounded border-secondary-300 dark:border-dark-600 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-secondary-700 dark:text-dark-300">
                    Featured Skill
                  </span>
                </label>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-secondary-700 dark:text-dark-300 hover:text-secondary-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  {showAddModal ? 'Add Skill' : 'Update Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">
              Delete Skill
            </h2>
            <p className="text-secondary-600 dark:text-dark-300 mb-6">
              Are you sure you want to delete &quot;{selectedSkill.name}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedSkill(null);
                }}
                className="px-4 py-2 text-secondary-700 dark:text-dark-300 hover:text-secondary-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSkill}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
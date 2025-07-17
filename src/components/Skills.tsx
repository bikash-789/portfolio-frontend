'use client';

import React, { useEffect, useState } from 'react';
import { skillsApi, Skill } from '../lib/api/services/skills';
import DynamicImage from './DynamicImage';
import { 
  ANIMATION_CONFIG, 
  UI_TEXT, 
  SKILL_LEVELS, 
  SPECIAL_SKILLS,
  SIZES,
  ERROR_MESSAGES 
} from '../constants';

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
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
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await skillsApi.getSkills();
        
        if (Array.isArray(data)) {
          setSkills(data);
          setFilteredSkills(data);
        } else {
          console.error('API response is not an array:', data);
          setSkills([]);
          setFilteredSkills([]);
          setError(ERROR_MESSAGES.LOAD_ERROR);
        }
      } catch (err) {
        console.error('Error fetching skills:', err);
        setError(ERROR_MESSAGES.LOAD_ERROR);
        setSkills([]);
        setFilteredSkills([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const categories = ['all', ...Array.from(new Set((skills || []).map(skill => skill.category)))];

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredSkills(skills || []);
    } else {
      setFilteredSkills((skills || []).filter(skill => skill.category === category));
    }
  };

  const getSkillLevelConfig = (level: string) => {
    return SKILL_LEVELS[level as keyof typeof SKILL_LEVELS] || SKILL_LEVELS.BEGINNER;
  };

  const isLargeIcon = (skillName: string) => {
    return (SPECIAL_SKILLS.LARGE_ICONS as readonly string[]).includes(skillName);
  };

  return (
    <section
      id="skills"
      className="bg-secondary-50 dark:bg-dark-800 py-20 transition-colors duration-300"
    >
      <div className="container px-4 lg:px-8 mx-auto">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-secondary-800 dark:text-white mb-4">
            {UI_TEXT.SECTIONS.SKILLS}
          </h2>
          <div className="w-20 h-1 bg-primary-500 mx-auto"></div>
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
              className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              {UI_TEXT.BUTTONS.RETRY}
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex flex-wrap justify-center gap-4 mb-12" data-aos="fade-up" data-aos-delay="50">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-white dark:bg-dark-700 text-secondary-600 dark:text-dark-300 hover:bg-primary-50 dark:hover:bg-dark-600'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            <div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {filteredSkills.map((skill) => {
                const levelConfig = getSkillLevelConfig(skill.level);
                return (
                  <div
                    key={skill.id}
                    className="group relative bg-white dark:bg-dark-700 rounded-xl p-6 shadow-lg dark:shadow-dark-card hover:shadow-xl dark:hover:shadow-dark-hover transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-16 h-16 flex items-center justify-center">
                        {skill.icon ? (
                          <DynamicImage
                            src={skill.icon}
                            alt={skill.name}
                            width={SIZES.SKILL_ICON}
                            height={SIZES.SKILL_ICON}
                            className={`group-hover:scale-110 transition-transform duration-300 ${
                              isLargeIcon(skill.name) ? "scale-125" : ""
                            } ${SPECIAL_SKILLS.DARK_MODE_INVERT ? "dark:invert" : ""}`}
                            fallbackName={skill.name}
                            fallbackShape="square"
                            fallbackSize={SIZES.SKILL_ICON}
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
                          className={`w-12 h-12 bg-secondary-200 dark:bg-dark-600 rounded-lg flex items-center justify-center fallback-icon ${skill.icon ? 'hidden' : 'flex'}`}
                        >
                          <span className="text-lg font-semibold text-secondary-600 dark:text-dark-300">
                            {skill.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <h3 className="text-secondary-800 dark:text-white font-semibold">
                          {skill.name}
                        </h3>
                        <span className="text-sm text-primary-500 dark:text-primary-400">
                          {skill.category}
                        </span>
                        <div className="mt-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${levelConfig.classes}`}>
                            {levelConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-500 dark:group-hover:border-primary-400 rounded-xl transition-colors duration-300"></div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Skills; 
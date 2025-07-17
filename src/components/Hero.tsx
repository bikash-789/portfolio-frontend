'use client';

import React, { useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { ChevronDoubleDown } from 'react-bootstrap-icons';
import { personalApi, PersonalInfo } from '../lib/api/services/personal';
import DynamicImage from './DynamicImage';
import StatusDisplay from './StatusDisplay';
import { 
  ANIMATION_CONFIG, 
  SITE_CONFIG, 
  SIZES, 
  TYPE_ANIMATION_SEQUENCE,
  UI_TEXT 
} from '../constants';

const Hero: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

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
    const fetchPersonalInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await personalApi.getPersonalInfo();
        setPersonalInfo(data);
      } catch (err) {
        console.error('Error fetching personal info:', err);
        setError('Failed to load personal information');
        setPersonalInfo({
          name: SITE_CONFIG.NAME,
          title: SITE_CONFIG.DEFAULT_TITLE,
          description: SITE_CONFIG.DEFAULT_DESCRIPTION,
          email: SITE_CONFIG.DEFAULT_EMAIL,
          profileImage: SITE_CONFIG.FALLBACK_PROFILE_IMAGE,
          heroImage: SITE_CONFIG.FALLBACK_HERO_IMAGE,
          socialLinks: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, []);

  const scrollToNextSection = () => {
    const nextSection = document.getElementById('skills');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary-900/90 via-secondary-900/80 to-secondary-900/90 dark:from-dark-900/95 dark:via-dark-900/85 dark:to-dark-900/95 backdrop-blur-sm z-10"></div>
        <DynamicImage
          src={personalInfo?.heroImage || SITE_CONFIG.FALLBACK_HERO_IMAGE}
          alt="background"
          fill
          className="object-cover"
          priority
          fallbackName="Portfolio"
          fallbackShape="square"
          fallbackSize={SIZES.HERO_IMAGE}
          fallback={SITE_CONFIG.FALLBACK_HERO_IMAGE}
        />
      </div>

      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div
          className="text-center space-y-8"
          data-aos="fade-up"
          data-aos-duration={ANIMATION_CONFIG.AOS.DURATION}
        >
          <div className="relative inline-block group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-300 dark:from-primary-400 dark:to-primary-200 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto">
              <DynamicImage
                src={personalInfo?.profileImage || SITE_CONFIG.FALLBACK_PROFILE_IMAGE}
                alt="profile"
                fill
                className="rounded-full object-cover border-4 border-white dark:border-dark-800 shadow-xl transform group-hover:scale-105 transition-transform duration-300"
                fallbackName={personalInfo?.name || SITE_CONFIG.NAME}
                fallbackShape="circle"
                fallbackSize={SIZES.PROFILE.DESKTOP}
                fallback={SITE_CONFIG.FALLBACK_PROFILE_IMAGE}
              />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-white to-blue-200 bg-clip-text text-transparent tracking-tight">
            {personalInfo?.name || SITE_CONFIG.NAME}
          </h1>

          <div className="flex justify-center">
            <StatusDisplay className="animate-bounce-gentle" />
          </div>

          <div className="h-16 flex items-center justify-center">
            <TypeAnimation
              sequence={TYPE_ANIMATION_SEQUENCE as unknown as (string | number)[]}
              wrapper="span"
              speed={ANIMATION_CONFIG.TYPE_ANIMATION.SPEED}
              repeat={Infinity}
              className="text-xl md:text-2xl text-primary-300 dark:text-primary-200"
            />
          </div>

          <div className="flex items-center justify-center gap-6 mt-8">
            {personalInfo?.socialLinks?.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="group relative"
                aria-label={social.name}
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-primary-500 to-primary-300 dark:from-primary-400 dark:to-primary-200 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                <div className="relative bg-secondary-800/50 dark:bg-dark-800 backdrop-blur-sm rounded-lg p-3 transform transition duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                  <DynamicImage
                    src={social.icon || SITE_CONFIG.FALLBACK_SKILL_ICON}
                    alt={social.name}
                    width={24}
                    height={24}
                    className="brightness-0 invert opacity-90 group-hover:opacity-100"
                    fallbackName={social.name}
                    fallbackShape="square"
                    fallbackSize={24}
                    fallback={SITE_CONFIG.FALLBACK_SKILL_ICON}
                  />
                </div>
              </a>
            )) || []}
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <button
              onClick={scrollToNextSection}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
              aria-label={UI_TEXT.BUTTONS.SCROLL_DOWN}
            >
              <ChevronDoubleDown className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(20,157,221,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(20,157,221,0.05),transparent_50%)] z-10"></div>
    </section>
  );
};

export default Hero; 
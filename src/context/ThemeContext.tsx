"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { THEME_CONFIG } from "@/constants";

type Theme = typeof THEME_CONFIG.THEMES.LIGHT | typeof THEME_CONFIG.THEMES.DARK;

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(THEME_CONFIG.DEFAULT);
  const [mounted, setMounted] = useState(false);

  const getInitialTheme = (): Theme => {
    if (typeof window === "undefined") return THEME_CONFIG.DEFAULT;

    const savedTheme = localStorage.getItem(THEME_CONFIG.STORAGE_KEY) as Theme;
    const prefersDark = window.matchMedia(THEME_CONFIG.MEDIA_QUERY).matches;

    if (savedTheme) {
      return savedTheme;
    }

    return prefersDark ? THEME_CONFIG.THEMES.DARK : THEME_CONFIG.THEMES.LIGHT;
  };

  const updateDocumentTheme = (currentTheme: Theme) => {
    if (typeof window === "undefined") return;

    const { classList } = document.documentElement;

    if (currentTheme === THEME_CONFIG.THEMES.DARK) {
      classList.add(THEME_CONFIG.CSS_CLASS);
    } else {
      classList.remove(THEME_CONFIG.CSS_CLASS);
    }

    localStorage.setItem(THEME_CONFIG.STORAGE_KEY, currentTheme);
  };

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      updateDocumentTheme(theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === THEME_CONFIG.THEMES.LIGHT
        ? THEME_CONFIG.THEMES.DARK
        : THEME_CONFIG.THEMES.LIGHT
    );
  };

  if (!mounted) {
    return (
      <ThemeContext.Provider
        value={{ theme: THEME_CONFIG.DEFAULT, toggleTheme }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

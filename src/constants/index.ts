export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1",
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
  },
} as const;

export const TIMING = {
  DEBOUNCE_DELAY: 300,
  LOADING_DELAY: 500,
  ANIMATION_DURATION: 300,
  TRANSITION_DURATION: 200,
  RETRY_DELAY: 1000,
  AUTH_CHECK_INTERVAL: 1000,
} as const;

export const SIZES = {
  AVATAR: {
    SMALL: 32,
    MEDIUM: 48,
    LARGE: 64,
    EXTRA_LARGE: 96,
  },
  PROFILE: {
    MOBILE: 160,
    DESKTOP: 192,
  },
  HERO_IMAGE: 400,
  PROJECT_IMAGE: 200,
  SKILL_ICON: 48,
} as const;

export const COLORS = {
  FALLBACK_AVATARS: [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
  ],
} as const;

export const AVATAR_COLORS = [
  { bg: "#3B82F6", text: "#FFFFFF" },
  { bg: "#EF4444", text: "#FFFFFF" },
  { bg: "#10B981", text: "#FFFFFF" },
  { bg: "#F59E0B", text: "#FFFFFF" },
  { bg: "#8B5CF6", text: "#FFFFFF" },
  { bg: "#EC4899", text: "#FFFFFF" },
  { bg: "#06B6D4", text: "#FFFFFF" },
  { bg: "#84CC16", text: "#FFFFFF" },
] as const;

export const VALIDATION = {
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_MESSAGE_LENGTH: 10,
  MAX_MESSAGE_LENGTH: 1000,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
} as const;

export const FORM_VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL_REGEX: /^https?:\/\/.+/,
  SLUG_REGEX: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

export const NAVIGATION_ITEMS = [
  { href: "#hero", label: "Home" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
] as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  GENERIC_ERROR: "Something went wrong. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  SUBMIT_ERROR: "Failed to submit. Please try again.",
  LOAD_ERROR: "Failed to load data. Please try again later.",
} as const;

export const SUCCESS_MESSAGES = {
  FORM_SUBMITTED: "Thank you for your message! I'll get back to you soon.",
  DATA_SAVED: "Data saved successfully!",
  DATA_UPDATED: "Data updated successfully!",
  DATA_DELETED: "Data deleted successfully!",
} as const;

export const SITE_CONFIG = {
  NAME: "Bikash Chauhan",
  DEFAULT_TITLE: "Software Engineer",
  DEFAULT_DESCRIPTION: "Welcome to my portfolio",
  DEFAULT_EMAIL: "chauhanbikash789@gmail.com",
  FALLBACK_PROFILE_IMAGE:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjM0I4MkY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE2MCIgcj0iNjAiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTEwMCAzNDBDMTAwIDI4MCAxNDAgMjQwIDIwMCAyNDBDMjYwIDI0MCAzMDAgMjgwIDMwMCAzNDBIMTAwWiIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4K",
  FALLBACK_HERO_IMAGE:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiBmaWxsPSIjMUYyOTM3Ii8+Cjx0ZXh0IHg9Ijk2MCIgeT0iNTQwIiBmb250LWZhbWlseT0iXEJyaWFuIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5GdWxsIFN0YWNrIERldmVsb3BlcjwvdGV4dD4KPC9zdmc+Cg==",
  FALLBACK_PROJECT_IMAGE:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiBmaWxsPSIjM0I4MkY2Ii8+CjxjaXJjbGUgY3g9IjUxMiIgY3k9IjUxMiIgcj0iMzg0IiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik01MTIgMjA0QzY0LjUgMjA0IDAgMjY4LjUgMCAzNDRjMCA3NS41IDY0LjUgMTQwIDE0MCAxNDBzMTQwLTY0LjUgMTQwLTE0MFM1ODcuNSAyMDQgNTAgMjA0bTAgMjA4Yy02MS41IDAtMTIwLTQ5LTE0MS43LTEyMEw1MTIgNjRjMTEuOCAyMC43IDUxLjIgNjQgMTAxLjcgNjRzODkuOS00My4zIDEwMS43LTY0bC0yMDIuNyA2MkMzOTEgMjU1IDMzMi41IDIwNCAyNjQgMjA0bTAgMjA4Yy02MS41IDAtMTIwLTQ5LTE0MS43LTEyMEw1MTIgNjRjMTEuOCAyMC43IDUxLjIgNjQgMTAxLjcgNjRzODkuOS00My4zIDEwMS43LTY0bC0yMDIuNyA2MkMzOTEgMjU1IDMyOS41IDIwNCAyNjQgMjA0bTAgMjA4Yy02MS41IDAtMTIwLTQ5LTE0MS43LTEyMEw1MTIgNjRjMTEuOCAyMC43IDUxLjIgNjQgMTAxLjcgNjRzODkuOS00My4zIDEwMS43LTY0bC0yMDIuNyA2MkMzOTEgMjU1IDMyOS41IDIwNCAyNjQgMjA0bTAgMjA4Yy02MS41IDAtMTIwLTQ5LTE0MS43LTEyMEw1MTIgNjRjMTEuOCAyMC43IDUxLjIgNjQgMTAxLjcgNjRzODkuOS00My4zIDEwMS43LTY0bC0yMDIuNyA2MkMzOTEgMjU1IDMyOS41IDIwNCAyNjQgMjA0bTAgMjA4Yy02MS41IDAtMTIwLTQ5LTE0MS43LTEyMEw1MTIgNjRjMTEuOCAyMC43IDUxLjIgNjQgMTAxLjcgNjRzODkuOS00My4zIDEwMS43LTY0bC0yMDIuNyA2MkMzOTEgMjU1IDMyOS41IDIwNCAyNjQgMjA0bTAgMjA4Yy02MS41IDAtMTIwLTQ5LTE0MS43LTEyMEw1MTIgNjRjMTEuOCAyMC43IDUxLjIgNjQgMTAxLjcgNjRzODkuOS00My4zIDEwMS43LTY0bC0yMDIuNyA2MkMzOTEgMjU1IDMyOS41IDIwNCAyNjQgMjA0bTAgMjA4Yy02MS41IDAtMTIwLTQ5LTE0MS43LTEyMEw1MTIgNjRjMTEuOCAyMC43IDUxLjIgNjQgMTAxLjcgNjRzODkuOS00My4zIDEwMS43LTY0bC0yMDIuNyA2MkMzOTEgMjU1IDMyOS41IDIwNCAyNjQgMjA0bTAgMjA4Yy02MS41IDAtMTIwLTQ5LTE0MS43LTEyMEw1MTIgNjRjMTEuOCAyMC43IDUxLjIgNjQgMTAxLjcgNjRzODkuOS00My4zIDEwMS43LTY0bC0yMDIuNyA2MkMzOTEgMjU1IDMyOS41IDIwNCAyNjQgMjA0bTAgMjA4Yy02MS41IDAtMTIwLTQ5LTE0MS43LTEyMEw1MTIgNjRjMTEuOCAyMC43IDUxLjIgNjQgMTAxLjcgNjRzODkuOS00My4zIDEwMS43LTY0bC0yMDIuNyA2MkMzOTEgMjU1IDMyOS41IDIwNCAyNjQgMjA0bTAgMjA4Yy02MS41IDAtMTIwLTQ5LTE0MS43LTEyMEw1MTIgNjRjMTEuOCAyMC43IDUxLjIgNjQgMTAxLjcgNjRzODkuOS00My4zIDEwMS43LTY0bC0yMDIuNyA2MkMzOTEgMjU1IDMyOS41IDIwNCAyNjQgMjA0bTAgMjA4Yy02MS41IDAtMTIwLTQ5LTE0MS43LTEyMEw1MTIgNjRjMTEuOCAyMC43IDUxLjIgNjQgMTAxLjcgNjRzODkuOS00My4zIDEwMS43LTY0bC0yMDIuNyA2MkMzOTEgMjU1IDMy",
  FALLBACK_SKILL_ICON:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjM0I4MkY2Ii8+CjxjaXJjbGUgY3g9IjI0IiBjeT0iMjQiIHI9IjE2IiBmaWxsPSIjRkZGRkZGIi8+Cjwvc3ZnPgo=",
} as const;

export const ANIMATION_CONFIG = {
  AOS: {
    DURATION: 1000,
    ONCE: true,
  },
  TYPE_ANIMATION: {
    SPEED: 20,
    PAUSE_DURATION: 1000,
  },
  HOVER_SCALE: 1.1,
  HOVER_LIFT: -8,
} as const;

export const UI_TEXT = {
  SECTIONS: {
    SKILLS: "Skills",
    PROJECTS: "Projects",
    CONTACT: "Contact",
  },
  BUTTONS: {
    RETRY: "Retry",
    VIEW_DETAILS: "View Details",
    VIEW_LIVE: "View live project",
    VIEW_SOURCE: "View source code",
    SCROLL_DOWN: "Scroll to next section",
  },
  LOADING: "Loading...",
  ERROR_RETRY: "Retry",
  NO_DATA: "No data available",
  FEATURED: "Featured",
} as const;

export const LIMITS = {
  PROJECTS_PER_PAGE: 50,
  SKILLS_DISPLAYED: 20,
  TECHNOLOGIES_PREVIEW: 3,
  SOCIAL_LINKS_MAX: 6,
} as const;

export const TYPE_ANIMATION_SEQUENCE = [
  "Computer Science Graduate",
  ANIMATION_CONFIG.TYPE_ANIMATION.PAUSE_DURATION,
  "Full-Stack Web Developer",
  ANIMATION_CONFIG.TYPE_ANIMATION.PAUSE_DURATION,
  "UI/UX Designer",
  ANIMATION_CONFIG.TYPE_ANIMATION.PAUSE_DURATION,
  "Software Engineer",
  ANIMATION_CONFIG.TYPE_ANIMATION.PAUSE_DURATION,
] as const;

export const FOOTER_SECTIONS = {
  QUICK_LINKS: "Quick Links",
  CONTACT_INFO: "Contact Info",
  BUILT_WITH: "Built with Next.js, TypeScript, and Tailwind CSS",
} as const;

export const SKILL_LEVELS = {
  EXPERT: {
    label: "Expert",
    classes:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  ADVANCED: {
    label: "Advanced",
    classes: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  INTERMEDIATE: {
    label: "Intermediate",
    classes:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  BEGINNER: {
    label: "Beginner",
    classes: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  },
} as const;

export const SPECIAL_SKILLS = {
  LARGE_ICONS: ["MongoDB", "NodeJS", "MySQL"],
  DARK_MODE_INVERT: true,
} as const;

export const METADATA_CONFIG = {
  DEFAULT_TITLE: "Portfolio | Software Engineer",
  DEFAULT_DESCRIPTION:
    "Portfolio website showcasing projects and skills as a software engineer",
  DEFAULT_KEYWORDS: [
    "Software Engineer",
    "Golang",
    "Java",
    "React",
    "Next.js",
    "Tailwind CSS",
    "JavaScript",
    "TypeScript",
    "Portfolio",
  ],
  SITE_URL: "https://portfolcio.vercel.app",
  OG_IMAGE: "/images/og-image.jpg",
  OG_IMAGE_WIDTH: 1200,
  OG_IMAGE_HEIGHT: 630,
  TWITTER_HANDLE: "@cbikash789",
  GOOGLE_VERIFICATION: "google-site-verification=1234567890",
  LOCALE: "en_US",
} as const;

export const SEO_CONFIG = {
  ROBOTS: {
    INDEX: true,
    FOLLOW: true,
    GOOGLE_BOT: {
      INDEX: true,
      FOLLOW: true,
      MAX_VIDEO_PREVIEW: -1,
      MAX_IMAGE_PREVIEW: "large" as const,
      MAX_SNIPPET: -1,
    },
  },
  FORMAT_DETECTION: {
    EMAIL: false,
    ADDRESS: false,
    TELEPHONE: false,
  },
} as const;

export const ADMIN_CONFIG = {
  ROUTES: {
    LOGIN: "/login",
    DASHBOARD: "/admin",
    PROJECTS: "/admin/projects",
    NEW_PROJECT: "/admin/projects/new",
    EDIT_PROJECT: "/admin/projects/edit",
    CONTACT: "/admin/contact",
    SKILLS: "/admin/skills",
    PROFILE: "/admin/profile",
    STATUS: "/admin/status",
  },
  ROLES: ["admin", "user"] as const,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000,
} as const;

export const ADMIN_UI_TEXT = {
  LOGIN: {
    TITLE: "Admin Login",
    SUBTITLE: "Sign in to access the admin dashboard",
    LOADING: "Signing you in...",
    REDIRECTING: "Redirecting...",
    LOADING_DASHBOARD: "Loading admin dashboard...",
  },
  DASHBOARD: {
    TITLE: "Admin Dashboard",
    WELCOME: "Welcome back",
    LOGOUT: "Logout",
    VIEW_PORTFOLIO: "View Portfolio",
    ADD_PROJECT: "Add New Project",
    MANAGE_PROJECTS: "Manage Projects",
    MANAGE_SKILLS: "Manage Skills",
    MANAGE_CONTACT: "View Messages",
    EDIT_PROFILE: "Edit Profile",
    MANAGE_STATUS: "Manage Status",
  },
  FORMS: {
    SAVE: "Save",
    CANCEL: "Cancel",
    DELETE: "Delete",
    ADD: "Add",
    EDIT: "Edit",
    CREATE: "Create",
    UPDATE: "Update",
    REMOVE: "Remove",
    REQUIRED: "Required",
    OPTIONAL: "Optional",
  },
  PROJECTS: {
    TITLE: "Project Management",
    ADD_NEW: "Add New Project",
    EDIT_PROJECT: "Edit Project",
    DELETE_PROJECT: "Delete Project",
    NO_PROJECTS: "No projects found",
    CONFIRM_DELETE: "Are you sure you want to delete this project?",
  },
} as const;

export const ADMIN_FORM_CONFIG = {
  PROJECT: {
    CATEGORIES: ["web", "mobile", "full-stack", "ui-ux", "other"] as const,
    MIN_TITLE_LENGTH: 3,
    MAX_TITLE_LENGTH: 100,
    MIN_DESCRIPTION_LENGTH: 10,
    MAX_DESCRIPTION_LENGTH: 500,
    MIN_TECHNOLOGIES: 1,
    MAX_TECHNOLOGIES: 20,
    MIN_FEATURES: 0,
    MAX_FEATURES: 10,
  },
  VALIDATION_MESSAGES: {
    TITLE_REQUIRED: "Title is required",
    DESCRIPTION_REQUIRED: "Description is required",
    IMAGE_REQUIRED: "Project image is required",
    CATEGORY_REQUIRED: "Category is required",
    SLUG_REQUIRED: "Slug is required",
    TECHNOLOGIES_REQUIRED: "At least one technology is required",
    INVALID_URL: "Please enter a valid URL",
    INVALID_GITHUB_URL: "Please enter a valid GitHub URL",
    INVALID_LIVE_URL: "Please enter a valid live URL",
    INVALID_IMAGE_URL: "Please enter a valid image URL",
    TITLE_TOO_SHORT: "Title must be at least 3 characters",
    TITLE_TOO_LONG: "Title must be less than 100 characters",
    DESCRIPTION_TOO_SHORT: "Description must be at least 10 characters",
    DESCRIPTION_TOO_LONG: "Description must be less than 500 characters",
  },
} as const;

export const ADMIN_METADATA = {
  LOGIN: {
    TITLE: "Admin Login - Portfolio",
    DESCRIPTION: "Secure admin login for portfolio management",
    ROBOTS: "noindex, nofollow",
  },
  DASHBOARD: {
    TITLE: "Admin Dashboard - Portfolio",
    DESCRIPTION: "Portfolio admin dashboard for content management",
    ROBOTS: "noindex, nofollow",
  },
  PROJECTS: {
    TITLE: "Project Management - Admin",
    DESCRIPTION: "Manage portfolio projects",
    ROBOTS: "noindex, nofollow",
  },
} as const;

export const ADMIN_STYLES = {
  GRADIENT_BG:
    "bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-dark-950 dark:to-dark-900",
  CARD_BG: "bg-white dark:bg-dark-800",
  SHADOW: "shadow-card dark:shadow-dark-card",
  BUTTON_PRIMARY: "bg-primary-500 hover:bg-primary-600 text-white",
  BUTTON_SECONDARY:
    "bg-secondary-100 hover:bg-secondary-200 dark:bg-dark-700 dark:hover:bg-dark-600 text-secondary-700 dark:text-dark-300",
  BUTTON_DANGER: "bg-red-500 hover:bg-red-600 text-white",
  INPUT:
    "border border-secondary-300 dark:border-dark-600 rounded-lg px-3 py-2 bg-white dark:bg-dark-700 text-secondary-900 dark:text-white",
  ERROR_TEXT: "text-red-600 dark:text-red-400",
  BACK_BUTTON:
    "p-2 rounded-lg bg-secondary-100 dark:bg-dark-700 text-secondary-600 dark:text-dark-300 hover:bg-secondary-200 dark:hover:bg-dark-600 transition-colors duration-300",
  HEADER: "bg-white dark:bg-dark-800 shadow-card dark:shadow-dark-card",
  TABLE_HEADER: "bg-secondary-50 dark:bg-dark-700",
  TABLE_ROW_HOVER:
    "hover:bg-secondary-50 dark:hover:bg-dark-700 transition-colors duration-200",
} as const;

export const ADMIN_PAGES = {
  CONTACT: {
    TITLE: "Contact Messages",
    SEARCH_PLACEHOLDER: "Search by name, email, subject, or message...",
    FILTERS: {
      STATUS: {
        ALL: "all",
        UNREAD: "unread",
        READ: "read",
        REPLIED: "replied",
        ARCHIVED: "archived",
      },
      SORT_BY: {
        CREATED_AT: "createdAt",
        NAME: "name",
        EMAIL: "email",
        STATUS: "status",
      },
    },
    MODALS: {
      DELETE_TITLE: "Delete Message",
      MESSAGE_DETAIL_TITLE: "Message Details",
    },
  },
  PROJECTS: {
    TITLE: "Projects Management",
    NEW_TITLE: "Add New Project",
    EDIT_TITLE: "Edit Project",
    SEARCH_PLACEHOLDER: "Search by title, description, or technologies...",
    CATEGORIES: ["all", "web", "mobile", "full-stack", "ui-ux", "other"],
    TABLE_COLUMNS: {
      PROJECT: "Project",
      CATEGORY: "Category",
      TECHNOLOGIES: "Technologies",
      DURATION: "Duration",
      STATUS: "Status",
      ACTIONS: "Actions",
    },
  },
  PROFILE: {
    TITLE: "Profile Management",
    SUBTITLE: "Personal Information",
    DESCRIPTION:
      "Manage your personal information that appears on your portfolio website.",
  },
} as const;

export const STATUS_COLORS = {
  UNREAD: "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200",
  READ: "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200",
  REPLIED:
    "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200",
  ARCHIVED: "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200",
  featured:
    "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200",
  active:
    "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200",
} as const;

export const MESSAGE_TIMING = {
  SUCCESS_HIDE_DELAY: 3000,
  ERROR_HIDE_DELAY: 5000,
} as const;

export const STATUS_CONFIG = {
  PREDEFINED_STATUSES: [
    {
      id: "busy",
      emoji: "💼",
      label: "Busy",
      description: "Working on something important",
    },
    {
      id: "focusing",
      emoji: "🎯",
      label: "Focusing",
      description: "Deep work mode, minimal interruptions",
    },
    {
      id: "available",
      emoji: "✅",
      label: "Available",
      description: "Available for collaboration",
    },
    {
      id: "away",
      emoji: "🏃",
      label: "Away",
      description: "Away from Keyboard",
    },
    {
      id: "coding",
      emoji: "👨‍💻",
      label: "Coding",
      description: "In the zone, writing code",
    },
    {
      id: "meeting",
      emoji: "📅",
      label: "In a meeting",
      description: "Currently in a meeting",
    },
    {
      id: "lunch",
      emoji: "🍽️",
      label: "Out to lunch",
      description: "Taking a lunch break",
    },
    {
      id: "learning",
      emoji: "📚",
      label: "Learning",
      description: "Studying or learning something new",
    },
    {
      id: "debugging",
      emoji: "🐛",
      label: "Debugging",
      description: "Fixing bugs and issues",
    },
    {
      id: "designing",
      emoji: "🎨",
      label: "Designing",
      description: "Working on UI/UX design",
    },
    { id: "sleeping", emoji: "💤", label: "Sleeping", description: "Sleeping" },
    {
      id: "gym",
      emoji: "🏋️",
      label: "Gym",
      description: "Working out at the gym",
    },
    {
      id: "shopping",
      emoji: "🛒",
      label: "Shopping",
      description: "Shopping at the mall",
    },
    {
      id: "watching",
      emoji: "🎥",
      label: "Watching",
      description: "Watching a movie",
    },
    {
      id: "reading",
      emoji: "📚",
      label: "Reading",
      description: "Reading a book",
    },
    {
      id: "traveling",
      emoji: "🌍",
      label: "Traveling",
      description: "Traveling to a new place",
    },
    {
      id: "cleaning",
      emoji: "🧹",
      label: "Cleaning",
      description: "Cleaning the house",
    },
    {
      id: "cooking",
      emoji: "🍳",
      label: "Cooking",
      description: "Cooking a meal",
    },
  ] as const,

  CLEAR_OPTIONS: [
    { label: "Never", value: "never" },
    { label: "In 30 minutes", value: 30 },
    { label: "In 1 hour", value: 60 },
    { label: "In 4 hours", value: 240 },
    { label: "Today", value: "today" },
    { label: "This week", value: "week" },
  ] as const,

  DEFAULT_EMOJI: "😊",
  MAX_MESSAGE_LENGTH: 80,

  POPULAR_EMOJIS: [
    "😊",
    "🎯",
    "💼",
    "✅",
    "🏃",
    "👨‍💻",
    "📅",
    "🍽️",
    "📚",
    "🐛",
    "🎨",
    "🚀",
    "💡",
    "⚡",
    "🔥",
    "🌟",
    "💪",
    "🎉",
    "🤔",
    "😴",
    "☕",
    "🏠",
    "✈️",
    "🎵",
    "📱",
    "💻",
    "🖥️",
    "⌨️",
    "🖱️",
    "🎮",
  ] as const,
} as const;

export const STATUS_STYLES = {
  CONTAINER:
    "inline-flex items-start px-4 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-md border backdrop-blur-sm",
  ONLINE:
    "bg-green-50 dark:bg-green-900/10 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700/50 hover:bg-green-100 dark:hover:bg-green-900/20",
  BUSY: "bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700/50 hover:bg-red-100 dark:hover:bg-red-900/20",
  AWAY: "bg-yellow-50 dark:bg-yellow-900/10 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700/50 hover:bg-yellow-100 dark:hover:bg-yellow-900/20",
  OFFLINE:
    "bg-gray-50 dark:bg-gray-900/10 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-900/20",
  EMOJI: "text-lg leading-none",
  MESSAGE: "text-secondary-700 dark:text-secondary-200",
  INDICATOR: "w-2 h-2 rounded-full",
  PULSE_INDICATOR:
    "absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-sm",
  HISTORY_ITEM:
    "flex items-center justify-between p-3 bg-secondary-50 dark:bg-dark-700 rounded-lg",
  LOADING_SKELETON:
    "w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse",
} as const;

export const STATUS_SERVICE = {
  REFRESH_INTERVAL: 30000,
  DEFAULT_HISTORY_LIMIT: 10,
  TIME_FORMAT_OPTIONS: {
    year: "numeric" as const,
    month: "short" as const,
    day: "numeric" as const,
    hour: "2-digit" as const,
    minute: "2-digit" as const,
  },
  STATUS_CATEGORIES: {
    BUSY_TYPES: ["busy", "focusing", "meeting"],
    AWAY_TYPES: ["away", "lunch"],
    ACTIVE_TYPES: ["available", "coding", "learning", "debugging", "designing"],
  },
} as const;

export const AUTH_CONFIG = {
  STORAGE_KEYS: {
    JWT_TOKEN: "jwt_token",
    REFRESH_TOKEN: "refresh_token",
    USER_DATA: "user_data",
    REDIRECT_AFTER_AUTH: "redirectAfterAuth",
  },
  ENDPOINTS: {
    GOOGLE_AUTH: "/api/v1/auth/google",
  },
  ROUTES: {
    DEFAULT_REDIRECT: "/admin",
  },
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
} as const;

export const THEME_CONFIG = {
  STORAGE_KEY: "theme",
  DEFAULT: "light" as const,
  THEMES: {
    LIGHT: "light" as const,
    DARK: "dark" as const,
  },
  MEDIA_QUERY: "(prefers-color-scheme: dark)",
  CSS_CLASS: "dark",
} as const;

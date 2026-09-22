export type ThemeId = 'ocean' | 'slate' | 'purple';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  subtitle: string;
  emoji: string;
  type: 'dark';
  previewColors: [string, string, string]; // background, card, accent
}

export const THEMES: ThemeOption[] = [
  {
    id: 'ocean',
    name: 'Bleu Nuit Océan',
    subtitle: 'Marine profond & or (Par défaut)',
    emoji: '🧭',
    type: 'dark',
    previewColors: ['#0A192F', '#0F2342', '#FB923C'],
  },
  {
    id: 'slate',
    name: 'Ardoise Titane',
    subtitle: 'Gris neutre & moderne',
    emoji: '🗺️',
    type: 'dark',
    previewColors: ['#0F172A', '#1E293B', '#38BDF8'],
  },
  {
    id: 'purple',
    name: 'Violet Vintage',
    subtitle: 'Ambiance arcade rétro',
    emoji: '👾',
    type: 'dark',
    previewColors: ['#1A1443', '#28206C', '#FB923C'],
  },
];

const THEME_STORAGE_KEY = 'capitale_quiz_theme';

export function getSavedTheme(): ThemeId {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    // If user had travel or no valid choice, default to ocean
    if (saved === 'ocean' || saved === 'slate' || saved === 'purple') {
      return saved as ThemeId;
    }
  } catch (e) {
    // Ignore storage errors
  }
  // Default theme is Bleu Nuit Océan
  return 'ocean';
}

export function applyTheme(themeId: ThemeId) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  } catch (e) {
    // Ignore storage errors
  }

  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', themeId);
    
    // Update theme-color meta tag for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      let color = '#0A192F';
      if (themeId === 'slate') color = '#0F172A';
      else if (themeId === 'purple') color = '#1A1443';
      metaThemeColor.setAttribute('content', color);
    }
  }
}


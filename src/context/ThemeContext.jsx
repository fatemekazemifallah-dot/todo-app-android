import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  light: {
    name: 'روشن',
    bg: '#f5f7fa',
    card: '#ffffff',
    text: '#1a1a2e',
    primary: '#6C63FF',
    primaryLight: '#EEEEFF',
    accent: '#FF6B6B',
    shadow: '0 4px 20px rgba(0,0,0,0.06)',
    border: '#e8e8f0',
    logoColor: '#6C63FF',
    gradient: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
  },
  dark: {
    name: 'تاریک',
    bg: '#0d0d14',
    card: '#181825',
    text: '#e8e8f0',
    primary: '#4FC3F7',
    primaryLight: '#1a2a3a',
    accent: '#FF6B6B',
    shadow: '0 4px 20px rgba(0,0,0,0.5)',
    border: '#2a2a3a',
    logoColor: '#4FC3F7',
    gradient: 'linear-gradient(135deg, #4FC3F7, #0288D1)',
  },
  purple: {
    name: 'بنفش',
    bg: '#f5f0ff',
    card: '#ffffff',
    text: '#2a1a4a',
    primary: '#7B1FA2',
    primaryLight: '#f0e6ff',
    accent: '#E040FB',
    shadow: '0 4px 20px rgba(123,31,162,0.12)',
    border: '#e6d6f5',
    logoColor: '#7B1FA2',
    gradient: 'linear-gradient(135deg, #7B1FA2, #4A148C)',
  },
  blue: {
    name: 'آبی',
    bg: '#f0f5ff',
    card: '#ffffff',
    text: '#0a1a3a',
    primary: '#1565C0',
    primaryLight: '#e6eeff',
    accent: '#42A5F5',
    shadow: '0 4px 20px rgba(21,101,192,0.12)',
    border: '#d6e6f5',
    logoColor: '#1565C0',
    gradient: 'linear-gradient(135deg, #1565C0, #0D47A1)',
  },
  green: {
    name: 'سبز',
    bg: '#f0faf0',
    card: '#ffffff',
    text: '#0a2a1a',
    primary: '#2E7D32',
    primaryLight: '#e6f5e6',
    accent: '#66BB6A',
    shadow: '0 4px 20px rgba(46,125,50,0.12)',
    border: '#d6f0d6',
    logoColor: '#2E7D32',
    gradient: 'linear-gradient(135deg, #2E7D32, #1B5E20)',
  },
  gold: {
    name: 'نارنجی',
    bg: '#faf8f0',
    card: '#ffffff',
    text: '#3a2a0a',
    primary: '#F9A825',
    primaryLight: '#fef8e6',
    accent: '#FFD54F',
    shadow: '0 4px 20px rgba(249,168,37,0.15)',
    border: '#f5edd6',
    logoColor: '#F9A825',
    gradient: 'linear-gradient(135deg, #F9A825, #F57F17)',
  },
  pink: {
    name: 'صورتی',
    bg: '#fef0f5',
    card: '#ffffff',
    text: '#3a1a2a',
    primary: '#C2185B',
    primaryLight: '#fce6ee',
    accent: '#EC407A',
    shadow: '0 4px 20px rgba(194,24,91,0.12)',
    border: '#f5d6e6',
    logoColor: '#C2185B',
    gradient: 'linear-gradient(135deg, #C2185B, #880E4F)',
  },
  silver: {
    name: 'طوسی',
    bg: '#f5f5f7',
    card: '#ffffff',
    text: '#2a2a3a',
    primary: '#78909C',
    primaryLight: '#e8ecee',
    accent: '#B0BEC5',
    shadow: '0 4px 20px rgba(120,144,156,0.10)',
    border: '#e0e4e8',
    logoColor: '#78909C',
    gradient: 'linear-gradient(135deg, #78909C, #546E7A)',
  },
  navy: {
    name: 'سورمه‌ای',
    bg: '#f0f2f8',
    card: '#ffffff',
    text: '#0a1628',
    primary: '#1A2A4A',
    primaryLight: '#e8ecf5',
    accent: '#4A6A8A',
    shadow: '0 4px 20px rgba(26,42,74,0.12)',
    border: '#d6dce8',
    logoColor: '#1A2A4A',
    gradient: 'linear-gradient(135deg, #1A2A4A, #2A4A6A)',
  },
  barbie: {
    name: 'صورتی باربی',
    bg: '#fef0f6',
    card: '#ffffff',
    text: '#3a0a1a',
    primary: '#E91E8C',
    primaryLight: '#fce6f0',
    accent: '#F06292',
    shadow: '0 4px 20px rgba(233,30,140,0.12)',
    border: '#f5d6e6',
    logoColor: '#E91E8C',
    gradient: 'linear-gradient(135deg, #E91E8C, #C2185B)',
  },
  lime: {
    name: 'سبز لیمویی',
    bg: '#f2faf0',
    card: '#ffffff',
    text: '#1a2a0a',
    primary: '#7CB342',
    primaryLight: '#e8f5e6',
    accent: '#AED581',
    shadow: '0 4px 20px rgba(124,179,66,0.12)',
    border: '#d6e8d6',
    logoColor: '#7CB342',
    gradient: 'linear-gradient(135deg, #7CB342, #558B2F)',
  },
  beige: {
    name: 'بژ',
    bg: '#f8f5f0',
    card: '#ffffff',
    text: '#3a2a1a',
    primary: '#D4A574',
    primaryLight: '#f5ede6',
    accent: '#E8C9A0',
    shadow: '0 4px 20px rgba(212,165,116,0.12)',
    border: '#e8ddd6',
    logoColor: '#D4A574',
    gradient: 'linear-gradient(135deg, #D4A574, #C4956A)',
  },
};

// ✅ همه تم‌ها رایگان هستن - لیست خالی
const premiumThemes = [];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  const changeTheme = (themeName) => {
    setTheme(themeName);
    localStorage.setItem('theme', themeName);
  };

  // ✅ همیشه false برمی‌گردونه چون هیچ تم پریمیومی نیست
  const isThemePremium = (themeName) => false;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themes,
        changeTheme,
        isThemePremium,
        currentTheme: themes[theme],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
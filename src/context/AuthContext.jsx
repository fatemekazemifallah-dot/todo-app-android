import { createContext, useState, useContext, useEffect } from 'react';
import { getRandomAvatar } from '../utils/avatars';

const AuthContext = createContext();

// کلیدهای ثابت برای localStorage
const STORAGE_KEYS = {
  USERS: 'taskflow_users',
  CURRENT_USER: 'taskflow_user',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // بارگذاری کاربر هنگام باز شدن برنامه
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        console.log('✅ کاربر پیدا شد:', parsedUser.email);
      } else {
        console.log('ℹ️ کاربری پیدا نشد');
      }
    } catch (error) {
      console.error('❌ خطا در بارگذاری کاربر:', error);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    setIsLoading(false);
  }, []);

  // ثبت‌نام
  const register = (userData) => {
    try {
      let users = [];
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      if (storedUsers) {
        users = JSON.parse(storedUsers);
      }
      
      if (users.find(u => u.email === userData.email)) {
        alert('❌ این ایمیل قبلاً ثبت‌نام کرده است!');
        return false;
      }

      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        gender: userData.gender || '',
        purpose: userData.purpose || 'general',
        isPremium: false,
        avatar: getRandomAvatar(),
        avatarType: 'sticker',
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
      
      console.log('✅ ثبت‌نام موفق:', newUser.email);
      alert('✅ ثبت‌نام موفق!');
      return true;
    } catch (error) {
      console.error('❌ خطا در ثبت‌نام:', error);
      alert('❌ مشکلی در ثبت‌نام پیش آمد!');
      return false;
    }
  };

  // ورود
  const login = (email, password) => {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!storedUsers) {
        alert('❌ هیچ کاربری ثبت نشده! اول ثبت‌نام کنید.');
        return false;
      }

      const users = JSON.parse(storedUsers);
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        setUser(foundUser);
        setIsAuthenticated(true);
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(foundUser));
        console.log('✅ ورود موفق:', foundUser.email);
        return true;
      } else {
        alert('❌ ایمیل یا رمز عبور اشتباه است!');
        return false;
      }
    } catch (error) {
      console.error('❌ خطا در ورود:', error);
      alert('❌ مشکلی در ورود پیش آمد!');
      return false;
    }
  };

  // خروج
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem('isPremium');
    console.log('🚪 خروج انجام شد');
  };

  // ===== ✅ به‌روزرسانی پروفایل (اصلاح شده) =====
  const updateProfile = (userData) => {
    try {
      const updatedUser = { ...user, ...userData };
      
      // آپدیت کردن user در state
      setUser(updatedUser);
      
      // ذخیره در localStorage
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));

      // همگام‌سازی پریمیوم با localStorage
      if (userData.isPremium !== undefined) {
        localStorage.setItem('isPremium', String(userData.isPremium));
      }

      // به‌روزرسانی در لیست کاربران
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const updatedUsers = users.map(u => 
          u.id === updatedUser.id ? updatedUser : u
        );
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
      }
      
      console.log('✅ پروفایل به‌روز شد:', updatedUser);
    } catch (error) {
      console.error('❌ خطا در به‌روزرسانی:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
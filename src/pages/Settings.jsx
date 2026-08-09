import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme, themes } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function Settings() {
  const { user, logout, updateProfile } = useAuth();
  const { currentTheme, theme, changeTheme, isThemePremium, setIsPremium } = useTheme();

  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const allThemes = ['light', 'dark', 'silver', 'blue', 'green', 'gold', 'pink', 'purple', 'navy', 'barbie', 'lime', 'beige'];
  
  const themeNames = {
    light: 'روشن',
    dark: 'تاریک',
    silver: 'نقره‌ای',
    blue: 'آبی',
    green: 'سبز',
    gold: 'طلایی',
    pink: 'صورتی',
    purple: 'بنفش',
    navy: 'سورمه‌ای',
    barbie: 'باربی',
    lime: 'لیمویی',
    beige: 'بژ',
  };
  
  const themeColors = {
    light: '#6C63FF',
    dark: '#4FC3F7',
    silver: '#78909C',
    blue: '#1565C0',
    green: '#2E7D32',
    gold: '#F9A825',
    pink: '#C2185B',
    purple: '#7B1FA2',
    navy: '#1A2A4A',
    barbie: '#E91E8C',
    lime: '#7CB342',
    beige: '#D4A574',
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: currentTheme.bg,
      padding: '20px',
      maxWidth: '480px',
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px 0',
    },
    backBtn: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: currentTheme.text,
    },
    title: {
      fontSize: '20px',
      fontWeight: '700',
      color: currentTheme.text,
    },
    section: {
      marginTop: '20px',
    },
    sectionTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: currentTheme.text,
      opacity: 0.5,
      marginBottom: '12px',
      textAlign: 'right',
    },
    card: {
      background: currentTheme.card,
      borderRadius: '20px',
      padding: '20px',
      boxShadow: currentTheme.shadow,
      marginBottom: '12px',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: `1px solid ${currentTheme.border}`,
    },
    rowLast: {
      borderBottom: 'none',
    },
    rowLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
    },
    rowIcon: {
      fontSize: '20px',
    },
    rowLabel: {
      fontSize: '15px',
      color: currentTheme.text,
      fontWeight: '500',
    },
    rowDesc: {
      fontSize: '12px',
      color: currentTheme.text,
      opacity: 0.4,
    },
    switch: {
      width: '48px',
      height: '28px',
      borderRadius: '14px',
      background: currentTheme.border,
      cursor: 'pointer',
      position: 'relative',
      transition: 'all 0.3s',
    },
    switchOn: {
      background: currentTheme.primary,
    },
    switchDot: {
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      background: '#fff',
      position: 'absolute',
      top: '3px',
      left: '3px',
      transition: 'all 0.3s',
    },
    switchDotOn: {
      left: '23px',
    },
    themeGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '10px',
      marginTop: '4px',
    },
    themeOption: {
      padding: '10px 8px',
      borderRadius: '14px',
      border: `2px solid transparent`,
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    themeOptionActive: {
      borderColor: currentTheme.primary,
      boxShadow: `0 0 0 2px ${currentTheme.primary}30`,
    },
    themeColor: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      margin: '0 auto 4px',
    },
    themeName: {
      fontSize: '11px',
      color: currentTheme.text,
      opacity: 0.6,
    },
    premiumBtn: {
      marginTop: '12px',
      padding: '12px',
      borderRadius: '14px',
      border: 'none',
      background: '#F9A825',
      color: '#000',
      fontSize: '15px',
      fontWeight: '700',
      cursor: 'pointer',
      width: '100%',
      transition: 'all 0.2s',
    },
    premiumBtnHover: {
      transform: 'scale(1.01)',
    },
    dangerBtn: {
      marginTop: '20px',
      padding: '12px',
      borderRadius: '14px',
      border: `2px solid #ff4757`,
      background: 'transparent',
      color: '#ff4757',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      transition: 'all 0.2s',
    },
    dangerBtnHover: {
      background: '#ff4757',
      color: '#fff',
    },
  };

  const [isHoverDanger, setIsHoverDanger] = useState(false);
  const [isHoverPremium, setIsHoverPremium] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/" style={styles.backBtn}>←</Link>
        <span style={styles.title}>تنظیمات</span>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>🎨 انتخاب تم</div>
        <div style={styles.card}>
          <div style={styles.themeGrid}>
            {allThemes.map(t => {
              const isPremium = isThemePremium(t);
              const canUse = !isPremium || user?.isPremium;
              return (
                <div
                  key={t}
                  style={{
                    ...styles.themeOption,
                    ...(theme === t ? styles.themeOptionActive : {}),
                    opacity: canUse ? 1 : 0.3,
                    cursor: canUse ? 'pointer' : 'not-allowed',
                  }}
                  onClick={() => canUse && changeTheme(t)}
                >
                  <div style={{ ...styles.themeColor, background: themeColors[t] }} />
                  <div style={styles.themeName}>
                    {themeNames[t]}
                    {isPremium && ' 💎'}
                  </div>
                </div>
              );
            })}
          </div>

          {!user?.isPremium && (
            <button
              style={{
                ...styles.premiumBtn,
                ...(isHoverPremium ? styles.premiumBtnHover : {}),
              }}
              onMouseEnter={() => setIsHoverPremium(true)}
              onMouseLeave={() => setIsHoverPremium(false)}
              onClick={() => setIsPremium(true)}
            >
              ✨ فعال‌سازی پرمیوم (تم‌های ویژه)
            </button>
          )}
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>⚙️ تنظیمات برنامه</div>
        <div style={styles.card}>
          <div style={styles.row}>
            <div style={styles.rowLeft}>
              <span style={styles.rowIcon}>🔔</span>
              <div>
                <div style={styles.rowLabel}>یادآوری‌ها</div>
                <div style={styles.rowDesc}>یادآوری برای تسک‌ها</div>
              </div>
            </div>
            <div
              style={{
                ...styles.switch,
                ...(reminderEnabled ? styles.switchOn : {}),
              }}
              onClick={() => setReminderEnabled(!reminderEnabled)}
            >
              <div
                style={{
                  ...styles.switchDot,
                  ...(reminderEnabled ? styles.switchDotOn : {}),
                }}
              />
            </div>
          </div>

          <div style={{ ...styles.row, ...styles.rowLast }}>
            <div style={styles.rowLeft}>
              <span style={styles.rowIcon}>🔊</span>
              <div>
                <div style={styles.rowLabel}>صدا</div>
                <div style={styles.rowDesc}>صدای اعلان‌ها</div>
              </div>
            </div>
            <div
              style={{
                ...styles.switch,
                ...(soundEnabled ? styles.switchOn : {}),
              }}
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              <div
                style={{
                  ...styles.switchDot,
                  ...(soundEnabled ? styles.switchDotOn : {}),
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>👤 حساب کاربری</div>
        <div style={styles.card}>
          <div style={styles.row}>
            <div style={styles.rowLeft}>
              <span style={styles.rowIcon}>💎</span>
              <div>
                <div style={styles.rowLabel}>
                  {user?.isPremium ? 'کاربر پرمیوم' : 'نسخه رایگان'}
                </div>
                <div style={styles.rowDesc}>
                  {user?.isPremium
                    ? '✅ همه تم‌ها فعال است'
                    : 'برای فعال‌سازی پرمیوم کلیک کنید'}
                </div>
              </div>
            </div>
            <span style={{ fontSize: '14px', color: currentTheme.primary }}>
              {user?.isPremium ? '✅' : '🆓'}
            </span>
          </div>

          {/* ===== تغییر حالت استفاده ===== */}
          <div style={{ ...styles.row, ...styles.rowLast }}>
            <div style={styles.rowLeft}>
              <span style={styles.rowIcon}>📊</span>
              <div>
                <div style={styles.rowLabel}>حالت استفاده</div>
                <div style={styles.rowDesc}>
                  {user?.purpose === 'student' && '🎓 تحصیلی'}
                  {user?.purpose === 'business' && '💼 بیزینسی'}
                  {user?.purpose === 'general' && '📝 عمومی'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['general', 'student', 'business'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    if (window.confirm(`آیا می‌خوای حالت رو به "${mode === 'general' ? 'عمومی' : mode === 'student' ? 'تحصیلی' : 'بیزینسی'}" تغییر بدی؟`)) {
                      updateProfile({ ...user, purpose: mode });
                      window.location.reload();
                    }
                  }}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    border: user?.purpose === mode ? `2px solid ${currentTheme.primary}` : `2px solid ${currentTheme.border}`,
                    background: user?.purpose === mode ? currentTheme.primaryLight : 'transparent',
                    color: user?.purpose === mode ? currentTheme.primary : currentTheme.text,
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: user?.purpose === mode ? '600' : '400',
                  }}
                >
                  {mode === 'general' && '📝 عمومی'}
                  {mode === 'student' && '🎓 تحصیلی'}
                  {mode === 'business' && '💼 بیزینسی'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          style={{
            ...styles.dangerBtn,
            ...(isHoverDanger ? styles.dangerBtnHover : {}),
          }}
          onMouseEnter={() => setIsHoverDanger(true)}
          onMouseLeave={() => setIsHoverDanger(false)}
          onClick={() => {
            if (window.confirm('آیا مطمئنی می‌خوای خارج بشی؟')) {
              logout();
            }
          }}
        >
          🚪 خروج از حساب
        </button>
      </div>
    </div>
  );
}
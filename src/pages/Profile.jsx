import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import AvatarSelector from '../components/AvatarSelector';
import AvatarIcon from '../components/AvatarIcon';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { currentTheme, setIsPremium } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setReminderEnabled(Notification.permission === 'granted');
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('مرورگر شما از اعلان پشتیبانی نمیکند');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setReminderEnabled(true);
        new Notification('🔔 TaskFlow', {
          body: 'یادآوری‌ها با موفقیت فعال شد!',
          icon: '✨',
        });
        return true;
      } else {
        alert('لطفاً مجوز اعلان را در مرورگر فعال کنید');
        setReminderEnabled(false);
        return false;
      }
    } catch (error) {
      console.error('خطا:', error);
      return false;
    }
  };

  const toggleReminder = async () => {
    if (reminderEnabled) {
      setReminderEnabled(false);
    } else {
      await requestNotificationPermission();
    }
  };

  const handleSave = () => {
    updateProfile({ ...user, name: editName, email: editEmail });
    setIsEditing(false);
  };

  const handleModeChange = (newPurpose) => {
    updateProfile({ ...user, purpose: newPurpose });
  };

  const handleAvatarSelect = (avatarData) => {
    updateProfile({ ...user, ...avatarData });
  };

  const purposeLabels = {
    general: '📝 عمومی',
    student: '🎓 تحصیلی',
    business: '💼 بیزینسی',
  };

  // تابع رندر آواتار با DiceBear
const renderAvatar = (avatar, size = 88) => {
  if (avatar?.image) {
    return (
      <img 
        src={avatar.image} 
        alt="avatar" 
        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
      />
    );
  }
  
  return <AvatarIcon avatar={avatar} name={user?.name} size={size} />;
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
    card: {
      background: currentTheme.card,
      borderRadius: '24px',
      padding: '32px 24px',
      boxShadow: currentTheme.shadow,
      textAlign: 'center',
      marginTop: '8px',
    },
    cardMargin: {
      marginTop: '16px',
      textAlign: 'right',
    },
    avatarContainer: {
      position: 'relative',
      display: 'inline-block',
      marginBottom: '16px',
      cursor: 'pointer',
    },
    avatar: {
      width: '88px',
      height: '88px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto',
      overflow: 'hidden',
      background: currentTheme.gradient || currentTheme.primary,
      color: '#fff',
      cursor: 'pointer',
      boxShadow: `0 8px 24px ${currentTheme.primary}30`,
    },
    avatarEdit: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      background: currentTheme.card,
      border: `2px solid ${currentTheme.border}`,
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      cursor: 'pointer',
      boxShadow: currentTheme.shadow,
      transition: 'all 0.2s',
    },
    avatarEditHover: {
      transform: 'scale(1.1)',
    },
    name: {
      fontSize: '22px',
      fontWeight: '700',
      color: currentTheme.text,
      marginBottom: '4px',
    },
    email: {
      fontSize: '15px',
      color: currentTheme.text,
      opacity: 0.6,
      marginBottom: '12px',
    },
    badge: {
      display: 'inline-block',
      padding: '4px 16px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '500',
      background: currentTheme.primaryLight,
      color: currentTheme.primary,
      marginBottom: '8px',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
      marginTop: '24px',
    },
    statCard: {
      background: currentTheme.bg,
      borderRadius: '14px',
      padding: '16px',
      textAlign: 'center',
    },
    statNum: {
      fontSize: '22px',
      fontWeight: '700',
      color: currentTheme.text,
    },
    statLabel: {
      fontSize: '12px',
      color: currentTheme.text,
      opacity: 0.4,
    },
    editBtn: {
      marginTop: '24px',
      padding: '12px',
      borderRadius: '14px',
      border: `2px solid ${currentTheme.primary}`,
      background: 'transparent',
      color: currentTheme.primary,
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      transition: 'all 0.2s',
    },
    editBtnHover: {
      background: currentTheme.primary,
      color: '#fff',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '12px',
      border: `2px solid ${currentTheme.border}`,
      fontSize: '15px',
      marginBottom: '12px',
      background: currentTheme.bg,
      color: currentTheme.text,
      outline: 'none',
      boxSizing: 'border-box',
    },
    inputFocus: {
      borderColor: currentTheme.primary,
      boxShadow: `0 0 0 4px ${currentTheme.primary}20`,
    },
    saveBtn: {
      padding: '12px',
      borderRadius: '14px',
      border: 'none',
      background: currentTheme.gradient || currentTheme.primary,
      color: '#fff',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      marginTop: '8px',
    },
    cancelBtn: {
      padding: '10px',
      borderRadius: '14px',
      border: 'none',
      background: 'transparent',
      color: currentTheme.text,
      opacity: 0.5,
      fontSize: '14px',
      cursor: 'pointer',
      width: '100%',
      marginTop: '8px',
    },
    modeSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      marginTop: '4px',
    },
    modeLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: currentTheme.text,
      opacity: 0.7,
    },
    modeOptions: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    },
    modeBtn: {
      padding: '8px 16px',
      borderRadius: '12px',
      border: `2px solid ${currentTheme.border}`,
      background: 'transparent',
      color: currentTheme.text,
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      flex: 1,
      minWidth: '80px',
    },
    modeBtnActive: {
      borderColor: currentTheme.primary,
      background: currentTheme.primaryLight,
      color: currentTheme.primary,
    },
    settingsSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    settingsRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 4px',
      borderBottom: `1px solid ${currentTheme.border}`,
    },
    settingsRowLast: {
      borderBottom: 'none',
    },
    settingsLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    settingsIcon: {
      fontSize: '20px',
    },
    settingsLabel: {
      fontSize: '15px',
      color: currentTheme.text,
      fontWeight: '500',
    },
    settingsDesc: {
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
    premiumStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    premiumBadge: {
      background: '#F9A825',
      color: '#000',
      padding: '2px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '700',
    },
    premiumBtn: {
      padding: '6px 16px',
      borderRadius: '12px',
      border: 'none',
      background: '#F9A825',
      color: '#000',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
    },
  };

  const [isHoverEdit, setIsHoverEdit] = useState(false);
  const [focusInput, setFocusInput] = useState(false);
  const [isHoverAvatar, setIsHoverAvatar] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/" style={styles.backBtn}>←</Link>
        <span style={styles.title}>پروفایل</span>
      </div>

      <div style={styles.card}>
        <div style={styles.avatarContainer}>
          <div 
            style={styles.avatar}
            onClick={() => setShowAvatarSelector(true)}
            onMouseEnter={() => setIsHoverAvatar(true)}
            onMouseLeave={() => setIsHoverAvatar(false)}
          >
            {renderAvatar(user?.avatar, 88)}
          </div>
          <div 
            style={{
              ...styles.avatarEdit,
              ...(isHoverAvatar ? styles.avatarEditHover : {}),
            }}
            onClick={() => setShowAvatarSelector(true)}
          >
            📷
          </div>
        </div>

        {!isEditing ? (
          <>
            <div style={styles.name}>{user?.name || 'کاربر'}</div>
            <div style={styles.email}>{user?.email || 'user@email.com'}</div>
            <div style={styles.badge}>
              {user?.purpose === 'student' && '🎓 دانشجو'}
              {user?.purpose === 'business' && '💼 بیزینس'}
              {user?.purpose === 'general' && '📝 عمومی'}
              {user?.isPremium && ' 💎 پرمیوم'}
            </div>

            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statNum}>۱۲</div>
                <div style={styles.statLabel}>تسک امروز</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNum}>۸۵%</div>
                <div style={styles.statLabel}>عملکرد</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNum}>۷</div>
                <div style={styles.statLabel}>روز فعال</div>
              </div>
            </div>

            <button
              style={{
                ...styles.editBtn,
                ...(isHoverEdit ? styles.editBtnHover : {}),
              }}
              onMouseEnter={() => setIsHoverEdit(true)}
              onMouseLeave={() => setIsHoverEdit(false)}
              onClick={() => setIsEditing(true)}
            >
              ✏️ ویرایش اطلاعات
            </button>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'right', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', color: currentTheme.primary, fontWeight: '600' }}>
                ✏️ ویرایش اطلاعات
              </span>
            </div>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onFocus={() => setFocusInput(true)}
              onBlur={() => setFocusInput(false)}
              style={{
                ...styles.input,
                ...(focusInput ? styles.inputFocus : {}),
              }}
              placeholder="نام کامل"
            />
            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              style={styles.input}
              placeholder="ایمیل"
            />
            <button style={styles.saveBtn} onClick={handleSave}>
              💾 ذخیره تغییرات
            </button>
            <button style={styles.cancelBtn} onClick={() => setIsEditing(false)}>
              انصراف
            </button>
          </>
        )}
      </div>

      <div style={{ ...styles.card, ...styles.cardMargin }}>
        <div style={styles.modeSection}>
          <span style={styles.modeLabel}>🔄 حالت استفاده</span>
          <div style={styles.modeOptions}>
            {['general', 'student', 'business'].map((mode) => (
              <button
                key={mode}
                style={{
                  ...styles.modeBtn,
                  ...(user?.purpose === mode ? styles.modeBtnActive : {}),
                }}
                onClick={() => handleModeChange(mode)}
              >
                {purposeLabels[mode]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ ...styles.card, ...styles.cardMargin }}>
        <div style={styles.settingsSection}>
          <div style={styles.settingsRow}>
            <div style={styles.settingsLeft}>
              <span style={styles.settingsIcon}>🔔</span>
              <div>
                <div style={styles.settingsLabel}>یادآوری‌ها</div>
                <div style={styles.settingsDesc}>
                  {reminderEnabled ? 'فعال ✅' : 'غیرفعال'}
                </div>
              </div>
            </div>
            <div
              style={{
                ...styles.switch,
                ...(reminderEnabled ? styles.switchOn : {}),
              }}
              onClick={toggleReminder}
            >
              <div
                style={{
                  ...styles.switchDot,
                  ...(reminderEnabled ? styles.switchDotOn : {}),
                }}
              />
            </div>
          </div>

          <div style={{ ...styles.settingsRow, ...styles.settingsRowLast }}>
            <div style={styles.settingsLeft}>
              <span style={styles.settingsIcon}>💎</span>
              <div>
                <div style={styles.settingsLabel}>
                  {user?.isPremium ? 'نسخه پرمیوم' : 'نسخه رایگان'}
                </div>
                <div style={styles.settingsDesc}>
                  {user?.isPremium
                    ? '✅ همه تم‌ها و امکانات فعال است'
                    : 'تم‌های ویژه + امکانات بیشتر'}
                </div>
              </div>
            </div>
            <div style={styles.premiumStatus}>
              {user?.isPremium ? (
                <span style={styles.premiumBadge}>فعال</span>
              ) : (
                <button
                  style={styles.premiumBtn}
                  onClick={() => {
                    if (window.confirm('آیا می‌خوای نسخه پرمیوم رو فعال کنی؟ (آزمایشی)')) {
                      setIsPremium(true);
                      updateProfile({ ...user, isPremium: true });
                    }
                  }}
                >
                  فعال‌سازی
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* مودال انتخاب آواتار */}
      {showAvatarSelector && (
        <AvatarSelector
          currentAvatar={user?.avatar}
          onSelect={handleAvatarSelect}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}
    </div>
  );
}
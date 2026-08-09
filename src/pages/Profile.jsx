import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import AvatarIcon from '../components/AvatarIcon';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const { currentTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [avatarImage, setAvatarImage] = useState(null);

  // ===== آمارهای واقعی =====
  const [stats, setStats] = useState({
    todayTasks: 0,
    performance: 0,
    activeDays: 0,
    totalTasks: 0,
    doneTasks: 0,
  });

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const today = new Date().toDateString();
    const todayTasks = tasks.filter(t => new Date(t.createdAt).toDateString() === today);
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter(t => t.done).length;
    const performance = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
    const doneDates = tasks.filter(t => t.done).map(t => new Date(t.createdAt).toDateString());
    const activeDays = new Set(doneDates).size;

    setStats({
      todayTasks: todayTasks.length,
      performance,
      activeDays,
      totalTasks,
      doneTasks,
    });
  }, []);

  // ===== آپلود عکس =====
  useEffect(() => {
    const savedImage = localStorage.getItem('user_avatar');
    if (savedImage) {
      setAvatarImage(savedImage);
    }
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target.result;
        setAvatarImage(imageData);
        localStorage.setItem('user_avatar', imageData);
        updateProfile({ ...user, avatar: imageData });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateProfile({ ...user, name: editName, email: editEmail });
    setIsEditing(false);
  };

  const handleModeChange = (newPurpose) => {
    if (window.confirm(`آیا می‌خوای حالت رو به "${newPurpose === 'general' ? 'عمومی' : newPurpose === 'student' ? 'تحصیلی' : 'بیزینسی'}" تغییر بدی؟`)) {
      updateProfile({ ...user, purpose: newPurpose });
      window.location.reload();
    }
  };

  const handleLogout = () => {
    if (window.confirm('آیا مطمئنی می‌خوای خارج بشی؟')) {
      logout();
    }
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
    avatarContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '16px',
    },
    avatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      overflow: 'hidden',
      background: currentTheme.bg,
    },
    avatarUploadBtn: {
      marginTop: '8px',
      padding: '6px 16px',
      borderRadius: '20px',
      background: currentTheme.primaryLight,
      color: currentTheme.primary,
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.2s',
    },
    name: {
      fontSize: '22px',
      fontWeight: '700',
      color: currentTheme.text,
    },
    email: {
      fontSize: '15px',
      color: currentTheme.text,
      opacity: 0.6,
    },
    badge: {
      display: 'inline-block',
      padding: '4px 16px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '500',
      background: currentTheme.primaryLight,
      color: currentTheme.primary,
      marginBottom: '16px',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
      marginTop: '16px',
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
    // ===== بخش تغییر حالت =====
    modeSection: {
      marginTop: '20px',
      paddingTop: '16px',
      borderTop: `1px solid ${currentTheme.border}`,
    },
    modeLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: currentTheme.text,
      opacity: 0.6,
      display: 'block',
      marginBottom: '12px',
    },
    modeOptions: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    modeBtn: {
      padding: '8px 16px',
      borderRadius: '12px',
      border: `2px solid ${currentTheme.border}`,
      background: 'transparent',
      color: currentTheme.text,
      fontSize: '14px',
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
    editBtn: {
      marginTop: '16px',
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
    logoutBtn: {
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
    logoutBtnHover: {
      background: '#ff4757',
      color: '#fff',
    },
  };

  const [isHoverEdit, setIsHoverEdit] = useState(false);
  const [isHoverLogout, setIsHoverLogout] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/" style={styles.backBtn}>←</Link>
        <span style={styles.title}>پروفایل</span>
      </div>

      <div style={styles.card}>
        <div style={styles.avatarContainer}>
          <div style={styles.avatar}>
            {avatarImage ? (
              <img
                src={avatarImage}
                alt="avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <AvatarIcon name={user?.name} size={80} />
            )}
          </div>
          <label style={styles.avatarUploadBtn}>
            📷 انتخاب عکس
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </label>
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
                <div style={styles.statNum}>{stats.todayTasks}</div>
                <div style={styles.statLabel}>تسک امروز</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNum}>{stats.performance}%</div>
                <div style={styles.statLabel}>عملکرد</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNum}>{stats.activeDays}</div>
                <div style={styles.statLabel}>روز فعال</div>
              </div>
            </div>

            {/* ===== تغییر حالت استفاده ===== */}
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
                    {mode === 'general' && '📝 عمومی'}
                    {mode === 'student' && '🎓 تحصیلی'}
                    {mode === 'business' && '💼 بیزینسی'}
                  </button>
                ))}
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
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              style={styles.input}
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

      <button
        style={{
          ...styles.logoutBtn,
          ...(isHoverLogout ? styles.logoutBtnHover : {}),
        }}
        onMouseEnter={() => setIsHoverLogout(true)}
        onMouseLeave={() => setIsHoverLogout(false)}
        onClick={handleLogout}
      >
        🚪 خروج از حساب
      </button>
    </div>
  );
}
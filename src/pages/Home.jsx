import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme, themes } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import PublicSection from '../components/PublicSection';
import StudentSection from '../components/StudentSection';
import BusinessSection from '../components/BusinessSection';
import AvatarIcon from '../components/AvatarIcon';

export default function Home() {
  const { user, logout, updateProfile } = useAuth();
  const { currentTheme, theme, changeTheme, isThemePremium } = useTheme();
  
  // ===== رفرنس صوتی برای مدیتیشن =====
  const audioRef = useRef(null);
  
  // ===== تسک‌ها =====
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEduAssistant, setShowEduAssistant] = useState(false);

  // ===== بارگذاری تسک‌ها =====
  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // ===== توابع تسک‌ها =====
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, done: false, createdAt: new Date().toISOString() }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // ===== دریافت تسک از دستیار صوتی =====
  useEffect(() => {
    const handleVoiceTask = (e) => {
      if (e.detail.text) {
        setTasks([...tasks, { id: Date.now(), text: e.detail.text, done: false, createdAt: new Date().toISOString() }]);
      }
    };
    window.addEventListener('addTaskFromVoice', handleVoiceTask);
    return () => window.removeEventListener('addTaskFromVoice', handleVoiceTask);
  }, [tasks]);

  // ===== ✅ پریمیوم (اصلاح شده - بدون setIsPremium) =====
  const handleActivatePremium = () => {
    if (window.confirm('آیا می‌خوای نسخه پرمیوم رو فعال کنی؟ (آزمایشی)')) {
      updateProfile({ ...user, isPremium: true });
      localStorage.setItem('isPremium', 'true');
      console.log('✅ پریمیوم فعال شد!');
      window.location.reload();
    }
  };

  // ===== فیلتر تسک‌ها =====
  const filteredTasks = filter === 'today'
    ? tasks.filter(t => new Date(t.createdAt).toDateString() === new Date().toDateString())
    : tasks;

  const doneCount = tasks.filter(t => t.done).length;

  // ===== تم‌ها =====
  const allThemes = ['light', 'dark', 'silver', 'blue', 'green', 'gold', 'pink', 'purple', 'navy', 'barbie', 'lime', 'beige'];
  const themeColors = {
    light: '#6C63FF',
    dark: '#0e1011ff',
    purple: '#7B1FA2',
    blue: '#1565C0',
    green: '#2E7D32',
    gold: '#F9A825',
    pink: '#C2185B',
    silver: '#78909C',
    navy: '#1A2A4A',
    barbie: '#E91E8C',
    lime: '#7CB342',
    beige: '#D4A574',
  };

  // ===== استایل‌ها =====
  const styles = {
    container: {
      minHeight: '100vh',
      background: currentTheme.bg,
      padding: '20px',
      maxWidth: '480px',
      margin: '0 auto',
      position: 'relative',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0 16px',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
    },
    avatar: {
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      overflow: 'hidden',
      background: currentTheme.gradient || currentTheme.primary,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      fontWeight: '600',
    },
    userInfo: {
      display: 'flex',
      flexDirection: 'column',
    },
    userName: {
      fontSize: '16px',
      fontWeight: '600',
      color: currentTheme.text,
    },
    userBadge: {
      fontSize: '12px',
      color: currentTheme.primary,
      opacity: 0.7,
    },
    menuBtn: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: currentTheme.text,
      padding: '4px',
    },
    welcomeCard: {
      background: currentTheme.gradient || currentTheme.primary,
      borderRadius: '20px',
      padding: '24px 20px',
      color: '#fff',
      marginBottom: '20px',
    },
    welcomeTitle: {
      fontSize: '20px',
      fontWeight: '700',
      marginBottom: '4px',
    },
    welcomeSub: {
      fontSize: '14px',
      opacity: 0.85,
    },
    addCard: {
      background: currentTheme.card,
      borderRadius: '16px',
      padding: '12px 16px',
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      boxShadow: currentTheme.shadow,
    },
    addInput: {
      flex: 1,
      border: 'none',
      outline: 'none',
      fontSize: '15px',
      background: 'transparent',
      color: currentTheme.text,
    },
    addBtn: {
      background: currentTheme.gradient || currentTheme.primary,
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      padding: '8px 20px',
      fontSize: '20px',
      cursor: 'pointer',
      fontWeight: '500',
    },
    filters: {
      display: 'flex',
      gap: '8px',
      marginBottom: '16px',
    },
    filterBtn: {
      padding: '6px 18px',
      borderRadius: '20px',
      border: 'none',
      fontSize: '13px',
      cursor: 'pointer',
      background: 'transparent',
      color: currentTheme.text,
      opacity: 0.5,
      fontWeight: '500',
    },
    filterBtnActive: {
      background: currentTheme.primary,
      color: '#fff',
      opacity: 1,
    },
    taskList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    taskItem: {
      background: currentTheme.card,
      borderRadius: '14px',
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: currentTheme.shadow,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    taskCheck: {
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      border: `2px solid ${currentTheme.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      flexShrink: 0,
    },
    taskCheckDone: {
      background: currentTheme.primary,
      borderColor: currentTheme.primary,
      color: '#fff',
    },
    taskText: {
      flex: 1,
      fontSize: '15px',
      color: currentTheme.text,
    },
    taskTextDone: {
      textDecoration: 'line-through',
      opacity: 0.4,
    },
    taskDelete: {
      background: 'none',
      border: 'none',
      color: currentTheme.text,
      opacity: 0.2,
      fontSize: '16px',
      cursor: 'pointer',
      padding: '4px',
    },
    empty: {
      textAlign: 'center',
      padding: '40px 20px',
      color: currentTheme.text,
      opacity: 0.4,
    },
    stats: {
      display: 'flex',
      justifyContent: 'space-around',
      background: currentTheme.card,
      borderRadius: '16px',
      padding: '16px',
      marginTop: '20px',
      boxShadow: currentTheme.shadow,
    },
    statItem: {
      textAlign: 'center',
    },
    statNum: {
      fontSize: '20px',
      fontWeight: '700',
      color: currentTheme.text,
    },
    statLabel: {
      fontSize: '12px',
      color: currentTheme.text,
      opacity: 0.4,
    },
    eduToggleBtn: {
      width: '100%',
      padding: '14px',
      borderRadius: '16px',
      border: 'none',
      background: currentTheme.gradient || currentTheme.primary,
      color: '#fff',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      marginBottom: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: `0 4px 16px ${currentTheme.primary}30`,
      transition: 'all 0.2s',
    },
    eduToggleBtnHover: {
      transform: 'scale(1.02)',
    },
    sidebarOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.3)',
      zIndex: 1000,
      opacity: sidebarOpen ? 1 : 0,
      pointerEvents: sidebarOpen ? 'auto' : 'none',
      transition: 'opacity 0.3s',
    },
    sidebar: {
      position: 'fixed',
      top: 0,
      right: 0,
      width: '280px',
      height: '100%',
      background: currentTheme.card,
      padding: '24px 20px',
      zIndex: 1001,
      transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease',
      boxShadow: '-4px 0 30px rgba(0,0,0,0.1)',
    },
    sidebarClose: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: currentTheme.text,
      float: 'right',
    },
    sidebarUser: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      marginBottom: '24px',
      paddingBottom: '20px',
      borderBottom: `1px solid ${currentTheme.border}`,
    },
    sidebarAvatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: currentTheme.gradient || currentTheme.primary,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      fontWeight: '600',
    },
    sidebarName: {
      fontSize: '16px',
      fontWeight: '600',
      color: currentTheme.text,
    },
    sidebarEmail: {
      fontSize: '13px',
      color: currentTheme.text,
      opacity: 0.5,
    },
    sidebarMenu: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    sidebarItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '12px 14px',
      borderRadius: '12px',
      color: currentTheme.text,
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '15px',
    },
    themeSection: {
      marginTop: '20px',
      paddingTop: '20px',
      borderTop: `1px solid ${currentTheme.border}`,
    },
    themeTitle: {
      fontSize: '13px',
      fontWeight: '600',
      color: currentTheme.text,
      opacity: 0.5,
      marginBottom: '12px',
    },
    themeDots: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
    },
    themeDot: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      border: '2px solid transparent',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'relative',
    },
    themeDotActive: {
      borderColor: currentTheme.primary,
      boxShadow: `0 0 0 2px ${currentTheme.primary}40`,
    },
    premiumBadge: {
      position: 'absolute',
      top: '-6px',
      right: '-6px',
      fontSize: '10px',
    },
    logoutBtn: {
      marginTop: '16px',
      padding: '12px',
      borderRadius: '12px',
      border: 'none',
      background: '#ff4757',
      color: '#fff',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
    },
  };

  const [isHoverEduBtn, setIsHoverEduBtn] = useState(false);

  return (
    <div style={styles.container}>
      <audio ref={audioRef} loop />

      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.avatar}>
            <AvatarIcon seed={user?.email} size={44} />
          </div>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{user?.name || 'کاربر'}</span>
            <span style={styles.userBadge}>
              {user?.purpose === 'student' && '🎓 دانشجو'}
              {user?.purpose === 'business' && '💼 بیزینس'}
              {user?.purpose === 'general' && '📝 عمومی'}
              {user?.isPremium && ' 💎'}
            </span>
          </div>
        </div>
        <button style={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
      </div>

      <div style={styles.welcomeCard}>
        <div style={styles.welcomeTitle}>سلام {user?.name || 'کاربر'} 👋</div>
        <div style={styles.welcomeSub}>
          {user?.purpose === 'student' && '📚 امروز چی می‌خوای بخونی؟'}
          {user?.purpose === 'business' && '💼 برنامه امروزت چیه؟'}
          {user?.purpose === 'general' && 'امروز چه کاری می‌خوای انجام بدی؟'}
        </div>
      </div>

      {user?.purpose === 'general' && <PublicSection />}

      {user?.purpose === 'student' && (
        <>
          <button
            style={{
              ...styles.eduToggleBtn,
              ...(isHoverEduBtn ? styles.eduToggleBtnHover : {}),
            }}
            onMouseEnter={() => setIsHoverEduBtn(true)}
            onMouseLeave={() => setIsHoverEduBtn(false)}
            onClick={() => setShowEduAssistant(!showEduAssistant)}
          >
            <span>{showEduAssistant ? '📚 بستن دستیار تحصیلی' : '📚 دستیار تحصیلی'}</span>
            <span style={{ fontSize: '20px' }}>{showEduAssistant ? '▲' : '▼'}</span>
          </button>
          {showEduAssistant && <StudentSection />}
        </>
      )}

      {user?.purpose === 'business' && <BusinessSection />}

      <div style={styles.addCard}>
        <input
          type="text"
          placeholder="یادداشت جدید..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          style={styles.addInput}
        />
        <button style={styles.addBtn} onClick={addTask}>+</button>
      </div>

      <div style={styles.filters}>
        <button
          style={{ ...styles.filterBtn, ...(filter === 'all' ? styles.filterBtnActive : {}) }}
          onClick={() => setFilter('all')}
        >
          همه
        </button>
        <button
          style={{ ...styles.filterBtn, ...(filter === 'today' ? styles.filterBtnActive : {}) }}
          onClick={() => setFilter('today')}
        >
          امروز
        </button>
      </div>

      <div style={styles.taskList}>
        {filteredTasks.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎉</div>
            <p>همه کارها رو انجام دادی!</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} style={styles.taskItem} onClick={() => toggleTask(task.id)}>
              <div style={{ ...styles.taskCheck, ...(task.done ? styles.taskCheckDone : {}) }}>
                {task.done && '✓'}
              </div>
              <span style={{ ...styles.taskText, ...(task.done ? styles.taskTextDone : {}) }}>
                {task.text}
              </span>
              <button
                style={styles.taskDelete}
                onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      <div style={styles.stats}>
        <div style={styles.statItem}>
          <div style={styles.statNum}>{tasks.length}</div>
          <div style={styles.statLabel}>کل</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statNum}>{doneCount}</div>
          <div style={styles.statLabel}>انجام شده</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statNum}>{tasks.length - doneCount}</div>
          <div style={styles.statLabel}>باقی‌مانده</div>
        </div>
      </div>

      {/* ===== تبلیغات یکتانت ===== */}
      <div className="yn-bnr" id="ynpos-19950"></div>
      {/* ===== تبلیغات تموم شد ===== */}

      <div style={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />
      <div style={styles.sidebar}>
        <button style={styles.sidebarClose} onClick={() => setSidebarOpen(false)}>✕</button>

        <div style={styles.sidebarUser}>
          <div style={styles.sidebarAvatar}>{user?.name?.[0] || '👤'}</div>
          <div>
            <div style={styles.sidebarName}>{user?.name || 'کاربر'}</div>
            <div style={styles.sidebarEmail}>{user?.email || 'user@email.com'}</div>
          </div>
        </div>

        <div style={styles.sidebarMenu}>
          <Link to="/profile" style={styles.sidebarItem} onClick={() => setSidebarOpen(false)}>
            👤 پروفایل
          </Link>
          <Link to="/settings" style={styles.sidebarItem} onClick={() => setSidebarOpen(false)}>
            ⚙️ تنظیمات
          </Link>
          <div style={styles.sidebarItem}>
            💎 {user?.isPremium ? 'کاربر پرمیوم' : 'نسخه رایگان'}
          </div>
        </div>

        <div style={styles.themeSection}>
          <div style={styles.themeTitle}>انتخاب تم</div>
          <div style={styles.themeDots}>
            {allThemes.map(t => {
              const isPremium = isThemePremium(t);
              const canUse = !isPremium || user?.isPremium;
              return (
                <div
                  key={t}
                  style={{
                    ...styles.themeDot,
                    ...(theme === t ? styles.themeDotActive : {}),
                    background: themeColors[t] || '#ccc',
                    opacity: canUse ? 1 : 0.3,
                    cursor: canUse ? 'pointer' : 'not-allowed',
                  }}
                  onClick={() => canUse && changeTheme(t)}
                >
                  {isPremium && <span style={styles.premiumBadge}>💎</span>}
                </div>
              );
            })}
          </div>

          {!user?.isPremium && (
            <button
              onClick={handleActivatePremium}
              style={{
                marginTop: '12px',
                padding: '10px 16px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #F9A825, #F57F17)',
                color: '#000',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(249,168,37,0.3)',
              }}
              onMouseEnter={(e) => { e.target.style.transform = 'scale(1.02)'; }}
              onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
            >
              ✨ فعال‌سازی پرمیوم
            </button>
          )}
        </div>

        <button style={styles.logoutBtn} onClick={logout}>
          خروج از حساب
        </button>
      </div>
    </div>
  );
}
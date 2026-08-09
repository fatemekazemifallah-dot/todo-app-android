import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme, themes } from '../context/ThemeContext';

export default function TodoList() {
  const { user, logout } = useAuth();
  const { currentTheme, theme, changeTheme, isThemePremium } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        text: newTask,
        done: false,
        createdAt: new Date().toISOString(),
      }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = filter === 'today'
    ? tasks.filter(t => new Date(t.createdAt).toDateString() === new Date().toDateString())
    : tasks;

  const doneCount = tasks.filter(t => t.done).length;

  const allThemes = ['light', 'dark', 'green', 'blue', 'purple', 'gold', 'pink', 'silver'];
  const themeColors = {
    light: '#6C63FF',
    dark: '#BB86FC',
    green: '#2E7D32',
    blue: '#1565C0',
    purple: '#7B1FA2',
    gold: '#F9A825',
    pink: '#C2185B',
    silver: '#78909C',
  };

  return (
    <div className="app-container" style={{ background: currentTheme.background }}>
      {/* هدر */}
      <div className="header">
        <div className="header-left">
          <div className="avatar">{user?.name?.[0] || '👤'}</div>
          <div>
            <div className="user-name">{user?.name || 'کاربر'}</div>
            <div className="user-badge">
              {user?.purpose === 'student' && '🎓 دانشجو'}
              {user?.purpose === 'business' && '💼 بیزینس'}
              {user?.purpose === 'general' && '📝 عمومی'}
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={logout} title="خروج">🚪</button>
        </div>
      </div>

      {/* بخش خوش‌آمدگویی */}
      <div className="welcome-section">
        <h1>سلام {user?.name || 'کاربر'} 👋</h1>
        <p>امروز چه کاری می‌خوای انجام بدی؟</p>
      </div>

      {/* اضافه کردن تسک */}
      <div className="add-task-card">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="یادداشت جدید..."
        />
        <button onClick={addTask}>+</button>
      </div>

      {/* فیلترها */}
      <div className="filter-tabs">
        <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          همه
        </button>
        <button className={`filter-tab ${filter === 'today' ? 'active' : ''}`} onClick={() => setFilter('today')}>
          امروز
        </button>
      </div>

      {/* لیست تسک‌ها */}
      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <span className="emoji">🎉</span>
            <p>همه کارها رو انجام دادی!</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className="task-item" onClick={() => toggleTask(task.id)}>
              <div className={`task-check ${task.done ? 'done' : ''}`}>
                {task.done && '✓'}
              </div>
              <span className={`task-text ${task.done ? 'done' : ''}`}>{task.text}</span>
              <button className="task-delete" onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}>
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* آمار */}
      <div className="stats-card">
        <div className="stat-item">
          <div className="stat-number">{tasks.length}</div>
          <div className="stat-label">کل</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{doneCount}</div>
          <div className="stat-label">انجام شده</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{tasks.length - doneCount}</div>
          <div className="stat-label">باقی‌مانده</div>
        </div>
      </div>

      {/* انتخاب تم */}
      <div className="stats-card" style={{ marginTop: 12, display: 'block', textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: '#aaa', marginBottom: 8 }}>انتخاب تم</div>
        <div className="theme-selector">
          {allThemes.map(t => {
            return (
              <div
                key={t}
                className={`theme-dot ${theme === t ? 'active' : ''}`}
                style={{
                  background: themeColors[t],
                  cursor: 'pointer',
                }}
                onClick={() => changeTheme(t)}
                title={t}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
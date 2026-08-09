import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function BusinessSection() {
  const { currentTheme } = useTheme();
  
  // ===== States =====
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [archivedProjects, setArchivedProjects] = useState([]);
  const [weeklyGoals, setWeeklyGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');

  // ===== بارگذاری =====
  useEffect(() => {
    const savedProjects = localStorage.getItem('business_projects');
    if (savedProjects) setProjects(JSON.parse(savedProjects));
    const savedTasks = localStorage.getItem('business_tasks');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    const savedMeetings = localStorage.getItem('business_meetings');
    if (savedMeetings) setMeetings(JSON.parse(savedMeetings));
    const savedArchived = localStorage.getItem('business_archived');
    if (savedArchived) setArchivedProjects(JSON.parse(savedArchived));
    const savedGoals = localStorage.getItem('business_goals');
    if (savedGoals) setWeeklyGoals(JSON.parse(savedGoals));
  }, []);

  // ===== ذخیره‌سازی =====
  useEffect(() => {
    localStorage.setItem('business_projects', JSON.stringify(projects));
  }, [projects]);
  useEffect(() => {
    localStorage.setItem('business_tasks', JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem('business_meetings', JSON.stringify(meetings));
  }, [meetings]);
  useEffect(() => {
    localStorage.setItem('business_archived', JSON.stringify(archivedProjects));
  }, [archivedProjects]);
  useEffect(() => {
    localStorage.setItem('business_goals', JSON.stringify(weeklyGoals));
  }, [weeklyGoals]);

  // ============================================
  //  توابع اصلی
  // ============================================
  const addProject = () => {
    if (newProjectName.trim()) {
      const newProj = { id: Date.now(), name: newProjectName, createdAt: new Date().toISOString() };
      setProjects([...projects, newProj]);
      setNewProjectName('');
      setSelectedProject(newProj.id);
    }
  };

  const deleteProject = (id) => {
    if (window.confirm('حذف پروژه؟')) {
      setProjects(projects.filter(p => p.id !== id));
      setTasks(tasks.filter(t => t.projectId !== id));
      if (selectedProject === id) setSelectedProject(null);
    }
  };

  const addTask = (projectId, title, priority = 'medium') => {
    if (title.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        title: title,
        projectId: projectId,
        status: 'todo',
        priority: priority,
        assignee: '',
        date: '',
        createdAt: new Date().toISOString(),
      }]);
    }
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const addMeeting = (meeting) => {
    if (meeting.title && meeting.date) {
      setMeetings([...meetings, { id: Date.now(), ...meeting, createdAt: new Date().toISOString() }]);
    }
  };

  const deleteMeeting = (id) => {
    setMeetings(meetings.filter(m => m.id !== id));
  };

  // ============================================
  //  فیچرها (همه رایگان)
  // ============================================
  const archiveProject = (id) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setArchivedProjects([...archivedProjects, { ...project, archivedAt: new Date().toISOString() }]);
      setProjects(projects.filter(p => p.id !== id));
      setTasks(tasks.filter(t => t.projectId !== id));
    }
  };

  const unarchiveProject = (id) => {
    const project = archivedProjects.find(p => p.id === id);
    if (project) {
      setProjects([...projects, { ...project, archivedAt: undefined }]);
      setArchivedProjects(archivedProjects.filter(p => p.id !== id));
    }
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setWeeklyGoals([...weeklyGoals, { id: Date.now(), text: newGoal, done: false, createdAt: new Date().toISOString() }]);
      setNewGoal('');
    }
  };

  const toggleGoal = (id) => {
    setWeeklyGoals(weeklyGoals.map(g => g.id === id ? { ...g, done: !g.done } : g));
  };

  const deleteGoal = (id) => {
    setWeeklyGoals(weeklyGoals.filter(g => g.id !== id));
  };

  const generateReport = () => {
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter(t => t.status === 'done').length;
    const todoTasks = tasks.filter(t => t.status === 'todo').length;
    const urgentTasks = tasks.filter(t => t.priority === 'urgent' && t.status !== 'done').length;
    const todayMeetings = meetings.filter(m => m.date === new Date().toISOString().split('T')[0]);
    const doneGoals = weeklyGoals.filter(g => g.done).length;

    return {
      totalTasks,
      doneTasks,
      todoTasks,
      urgentTasks,
      todayMeetings: todayMeetings.length,
      totalMeetings: meetings.length,
      totalProjects: projects.length,
      doneGoals,
      totalGoals: weeklyGoals.length,
    };
  };

  const getSmartReminders = () => {
    const today = new Date().toISOString().split('T')[0];
    const urgentTasks = tasks.filter(t => t.priority === 'urgent' && t.status !== 'done');
    const todayMeetings = meetings.filter(m => m.date === today);
    const overdueTasks = tasks.filter(t => t.date && t.date < today && t.status !== 'done');

    return {
      urgentTasks,
      todayMeetings,
      overdueTasks,
      hasReminders: urgentTasks.length > 0 || todayMeetings.length > 0 || overdueTasks.length > 0,
    };
  };

  // ============================================
  //  Helpers
  // ============================================
  const getProjectStats = (projectId) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    const total = projectTasks.length;
    const done = projectTasks.filter(t => t.status === 'done').length;
    return { total, done, progress: total > 0 ? Math.round((done / total) * 100) : 0 };
  };

  const statusLabels = {
    todo: '📋 انجام نشده',
    doing: '🔄 در حال انجام',
    done: '✅ انجام شده',
    review: '🔍 نیاز به بررسی',
  };
  const statusColors = {
    todo: '#94a3b8',
    doing: '#f59e0b',
    done: '#22c55e',
    review: '#ef4444',
  };

  const styles = {
    container: {
      background: currentTheme.bg,
      borderRadius: '24px',
      padding: '24px',
      marginBottom: '16px',
      border: `1px solid ${currentTheme.border}`,
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
      marginBottom: '24px',
    },
    statCard: {
      background: currentTheme.card,
      padding: '16px',
      borderRadius: '16px',
      textAlign: 'center',
      border: `1px solid ${currentTheme.border}`,
    },
    statNumber: {
      fontSize: '24px',
      fontWeight: '700',
      color: currentTheme.text,
    },
    statLabel: {
      fontSize: '12px',
      color: currentTheme.text,
      opacity: 0.5,
      marginTop: '4px',
    },
    mainCard: {
      background: currentTheme.card,
      borderRadius: '20px',
      padding: '20px',
      marginBottom: '16px',
      border: `1px solid ${currentTheme.border}`,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    mainCardHover: {
      borderColor: currentTheme.primary,
      boxShadow: `0 4px 16px ${currentTheme.primary}15`,
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: currentTheme.text,
    },
    cardSub: {
      fontSize: '13px',
      color: currentTheme.text,
      opacity: 0.5,
    },
    badge: {
      background: currentTheme.primaryLight,
      color: currentTheme.primary,
      padding: '2px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '600',
    },
    premiumBadge: {
      background: '#F9A825',
      color: '#000',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '10px',
      fontWeight: '700',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    modal: {
      background: currentTheme.card,
      borderRadius: '28px',
      padding: '28px',
      maxWidth: '500px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: currentTheme.text,
      marginBottom: '20px',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '14px',
      border: `2px solid ${currentTheme.border}`,
      background: currentTheme.bg,
      color: currentTheme.text,
      fontSize: '14px',
      outline: 'none',
      marginBottom: '12px',
    },
    inputFocus: {
      borderColor: currentTheme.primary,
    },
    btnPrimary: {
      padding: '10px 24px',
      borderRadius: '14px',
      border: 'none',
      background: currentTheme.primary,
      color: '#fff',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
    },
    btnSecondary: {
      padding: '10px 24px',
      borderRadius: '14px',
      border: `2px solid ${currentTheme.border}`,
      background: 'transparent',
      color: currentTheme.text,
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      marginTop: '8px',
    },
    btnDanger: {
      padding: '4px 12px',
      borderRadius: '8px',
      border: 'none',
      background: '#ef4444',
      color: '#fff',
      fontSize: '12px',
      cursor: 'pointer',
    },
    btnSuccess: {
      padding: '4px 12px',
      borderRadius: '8px',
      border: 'none',
      background: '#22c55e',
      color: '#fff',
      fontSize: '12px',
      cursor: 'pointer',
    },
    reminderCard: {
      padding: '10px 14px',
      borderRadius: '12px',
      background: currentTheme.bg,
      borderRight: `4px solid #ef4444`,
      marginBottom: '8px',
    },
    reportItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 0',
      borderBottom: `1px solid ${currentTheme.border}`,
    },
    goalItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 12px',
      borderRadius: '10px',
      background: currentTheme.bg,
      marginBottom: '6px',
      cursor: 'pointer',
    },
    goalDone: {
      textDecoration: 'line-through',
      opacity: 0.4,
    },
    projectItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 12px',
      borderRadius: '12px',
      background: currentTheme.bg,
      marginBottom: '8px',
      cursor: 'pointer',
      border: `1px solid transparent`,
    },
    projectItemActive: {
      borderColor: currentTheme.primary,
      background: currentTheme.primaryLight,
    },
    projectName: {
      fontSize: '14px',
      fontWeight: '600',
      color: currentTheme.text,
    },
    projectProgress: {
      fontSize: '12px',
      color: currentTheme.text,
      opacity: 0.5,
    },
    taskItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 12px',
      background: currentTheme.bg,
      borderRadius: '10px',
      marginBottom: '6px',
      flexWrap: 'wrap',
      gap: '6px',
    },
    taskTitle: {
      fontSize: '13px',
      color: currentTheme.text,
      flex: 1,
    },
    taskStatusBadge: {
      padding: '2px 10px',
      borderRadius: '12px',
      fontSize: '10px',
      fontWeight: '600',
      color: '#fff',
    },
    archiveItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 12px',
      borderRadius: '10px',
      background: currentTheme.bg,
      marginBottom: '6px',
    },
  };

  const [hoverCard, setHoverCard] = useState(null);
  const [focusInput, setFocusInput] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newMeetingData, setNewMeetingData] = useState({ title: '', date: '', time: '', agenda: '' });

  const report = generateReport();
  const reminders = getSmartReminders();

  return (
    <div style={styles.container}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ fontSize: '18px', fontWeight: '700', color: currentTheme.text }}>💼 داشبورد مدیریت</div>
        <div style={{ fontSize: '12px', opacity: 0.5, color: currentTheme.text }}>
          🆓 رایگان
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{projects.length}</div>
          <div style={styles.statLabel}>پروژه</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{tasks.filter(t => t.status === 'done').length}/{tasks.length}</div>
          <div style={styles.statLabel}>تسک انجام شده</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{meetings.length}</div>
          <div style={styles.statLabel}>جلسات</div>
        </div>
      </div>

      <div 
        style={{ ...styles.mainCard, ...(hoverCard === 'projects' ? styles.mainCardHover : {}) }}
        onMouseEnter={() => setHoverCard('projects')}
        onMouseLeave={() => setHoverCard(null)}
        onClick={() => setShowProjectModal(true)}
      >
        <div style={styles.cardHeader}>
          <span style={styles.cardTitle}>📊 پروژه‌ها</span>
          <span style={styles.badge}>{projects.length} پروژه</span>
        </div>
        <div style={styles.cardSub}>مدیریت و پیگیری پروژه‌ها</div>
      </div>

      <div 
        style={{ ...styles.mainCard, ...(hoverCard === 'meetings' ? styles.mainCardHover : {}) }}
        onMouseEnter={() => setHoverCard('meetings')}
        onMouseLeave={() => setHoverCard(null)}
        onClick={() => setShowMeetingModal(true)}
      >
        <div style={styles.cardHeader}>
          <span style={styles.cardTitle}>📅 جلسات</span>
          <span style={styles.badge}>{meetings.length} جلسه</span>
        </div>
        <div style={styles.cardSub}>برنامه‌ریزی و ثبت جلسات</div>
      </div>

      {/* ===== بخش یادآوری هوشمند (رایگان) ===== */}
      <div style={{ ...styles.mainCard, borderColor: reminders.hasReminders ? '#ef4444' : currentTheme.border }}>
        <div style={styles.cardHeader}>
          <span style={styles.cardTitle}>🔔 یادآوری هوشمند</span>
          <span style={{ ...styles.premiumBadge, background: currentTheme.primary, color: '#fff' }}>✨ رایگان</span>
        </div>
        {reminders.hasReminders ? (
          <>
            {reminders.urgentTasks.length > 0 && (
              <div style={styles.reminderCard}>
                <strong>🔴 تسک‌های فوری:</strong> {reminders.urgentTasks.map(t => t.title).join('، ')}
              </div>
            )}
            {reminders.todayMeetings.length > 0 && (
              <div style={{ ...styles.reminderCard, borderRightColor: '#f59e0b' }}>
                <strong>📅 جلسات امروز:</strong> {reminders.todayMeetings.map(m => m.title).join('، ')}
              </div>
            )}
            {reminders.overdueTasks.length > 0 && (
              <div style={{ ...styles.reminderCard, borderRightColor: '#ef4444' }}>
                <strong>⏰ تسک‌های عقب‌افتاده:</strong> {reminders.overdueTasks.map(t => t.title).join('، ')}
              </div>
            )}
          </>
        ) : (
          <div style={styles.cardSub}>✅ همه چیز مرتب است! هیچ یادآوری فوری ندارید.</div>
        )}
      </div>

      <div 
        style={{ ...styles.mainCard, ...(hoverCard === 'report' ? styles.mainCardHover : {}) }}
        onMouseEnter={() => setHoverCard('report')}
        onMouseLeave={() => setHoverCard(null)}
        onClick={() => setShowReportModal(true)}
      >
        <div style={styles.cardHeader}>
          <span style={styles.cardTitle}>📈 گزارش سریع</span>
          <span style={{ ...styles.premiumBadge, background: currentTheme.primary, color: '#fff' }}>✨ رایگان</span>
        </div>
        <div style={styles.cardSub}>خلاصه عملکرد هفتگی خود را ببینید</div>
      </div>

      <div 
        style={{ ...styles.mainCard, ...(hoverCard === 'goals' ? styles.mainCardHover : {}) }}
        onMouseEnter={() => setHoverCard('goals')}
        onMouseLeave={() => setHoverCard(null)}
        onClick={() => setShowGoalsModal(true)}
      >
        <div style={styles.cardHeader}>
          <span style={styles.cardTitle}>🎯 اهداف هفتگی</span>
          <span style={{ ...styles.premiumBadge, background: currentTheme.primary, color: '#fff' }}>✨ رایگان</span>
        </div>
        <div style={styles.cardSub}>
          {weeklyGoals.filter(g => g.done).length}/{weeklyGoals.length} هدف انجام شده
        </div>
      </div>

      <div 
        style={{ ...styles.mainCard, ...(hoverCard === 'archive' ? styles.mainCardHover : {}) }}
        onMouseEnter={() => setHoverCard('archive')}
        onMouseLeave={() => setHoverCard(null)}
        onClick={() => setShowArchiveModal(true)}
      >
        <div style={styles.cardHeader}>
          <span style={styles.cardTitle}>🗂️ آرشیو پروژه‌ها</span>
          <span style={{ ...styles.premiumBadge, background: currentTheme.primary, color: '#fff' }}>✨ رایگان</span>
        </div>
        <div style={styles.cardSub}>{archivedProjects.length} پروژه آرشیو شده</div>
      </div>

      {/* ============================================================
          مودال‌ها
          ============================================================ */}

      {showProjectModal && (
        <div style={styles.modalOverlay} onClick={() => setShowProjectModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>📊 مدیریت پروژه‌ها</div>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="نام پروژه جدید..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onFocus={() => setFocusInput(true)}
                onBlur={() => setFocusInput(false)}
                style={{ ...styles.input, ...(focusInput ? styles.inputFocus : {}), marginBottom: 0 }}
                onKeyDown={(e) => e.key === 'Enter' && addProject()}
              />
              <button style={{ ...styles.btnPrimary, width: 'auto', padding: '0 20px' }} onClick={addProject}>➕</button>
            </div>

            {projects.map(p => {
              const stats = getProjectStats(p.id);
              return (
                <div key={p.id}>
                  <div 
                    style={{ ...styles.projectItem, ...(activeProjectId === p.id ? styles.projectItemActive : {}) }}
                    onClick={() => setActiveProjectId(activeProjectId === p.id ? null : p.id)}
                  >
                    <div>
                      <div style={styles.projectName}>{p.name}</div>
                      <div style={styles.projectProgress}>{stats.progress}% پیشرفت ({stats.done}/{stats.total})</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', opacity: 0.5 }}>{stats.total} تسک</span>
                      <button style={{ ...styles.btnSuccess, padding: '2px 8px', fontSize: '10px' }} onClick={(e) => { e.stopPropagation(); archiveProject(p.id); }}>📦</button>
                      <button style={styles.btnDanger} onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }}>🗑️</button>
                    </div>
                  </div>

                  {activeProjectId === p.id && (
                    <div style={{ padding: '8px 12px 16px 12px', background: currentTheme.bg, borderRadius: '12px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <input
                          type="text"
                          placeholder="تسک جدید..."
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          style={{ ...styles.input, marginBottom: 0, flex: 1, minWidth: '120px' }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newTaskTitle.trim()) {
                              addTask(p.id, newTaskTitle, taskPriority);
                              setNewTaskTitle('');
                            }
                          }}
                        />
                        <select
                          value={taskPriority}
                          onChange={(e) => setTaskPriority(e.target.value)}
                          style={{ ...styles.input, marginBottom: 0, width: 'auto', padding: '8px 12px' }}
                        >
                          <option value="low">🟢 پایین</option>
                          <option value="medium">🟡 متوسط</option>
                          <option value="high">🟠 بالا</option>
                          <option value="urgent">🔴 فوری</option>
                        </select>
                        <button 
                          style={{ ...styles.btnPrimary, width: 'auto', padding: '0 16px' }} 
                          onClick={() => {
                            if (newTaskTitle.trim()) {
                              addTask(p.id, newTaskTitle, taskPriority);
                              setNewTaskTitle('');
                            }
                          }}
                        >➕</button>
                      </div>

                      {tasks.filter(t => t.projectId === p.id).map(task => (
                        <div key={task.id} style={styles.taskItem}>
                          <span style={styles.taskTitle}>{task.title}</span>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{ ...styles.taskStatusBadge, background: statusColors[task.status] || '#94a3b8' }}>
                              {statusLabels[task.status] || task.status}
                            </span>
                            <select
                              value={task.status}
                              onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                              style={{ padding: '2px 6px', borderRadius: '6px', border: `1px solid ${currentTheme.border}`, background: currentTheme.bg, color: currentTheme.text, fontSize: '11px' }}
                            >
                              <option value="todo">📋 انجام نشده</option>
                              <option value="doing">🔄 در حال انجام</option>
                              <option value="done">✅ انجام شده</option>
                              <option value="review">🔍 نیاز به بررسی</option>
                            </select>
                            <button style={styles.btnDanger} onClick={() => deleteTask(task.id)}>✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <button style={styles.btnSecondary} onClick={() => setShowProjectModal(false)}>بستن</button>
          </div>
        </div>
      )}

      {showMeetingModal && (
        <div style={styles.modalOverlay} onClick={() => setShowMeetingModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>📅 مدیریت جلسات</div>
            
            <input
              type="text"
              placeholder="عنوان جلسه"
              value={newMeetingData.title}
              onChange={(e) => setNewMeetingData({ ...newMeetingData, title: e.target.value })}
              style={styles.input}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="date"
                value={newMeetingData.date}
                onChange={(e) => setNewMeetingData({ ...newMeetingData, date: e.target.value })}
                style={{ ...styles.input, flex: 1 }}
              />
              <input
                type="time"
                value={newMeetingData.time}
                onChange={(e) => setNewMeetingData({ ...newMeetingData, time: e.target.value })}
                style={{ ...styles.input, flex: 1 }}
              />
            </div>
            <input
              type="text"
              placeholder="دستور جلسه (اختیاری)"
              value={newMeetingData.agenda}
              onChange={(e) => setNewMeetingData({ ...newMeetingData, agenda: e.target.value })}
              style={styles.input}
            />
            <button 
              style={styles.btnPrimary} 
              onClick={() => {
                if (newMeetingData.title && newMeetingData.date) {
                  addMeeting(newMeetingData);
                  setNewMeetingData({ title: '', date: '', time: '', agenda: '' });
                }
              }}
            >➕ ثبت جلسه</button>

            <div style={{ marginTop: '16px' }}>
              {meetings.map(m => (
                <div key={m.id} style={{ ...styles.taskItem, background: currentTheme.bg }}>
                  <div>
                    <div style={{ fontWeight: '600', color: currentTheme.text }}>{m.title}</div>
                    <div style={{ fontSize: '11px', opacity: 0.5, color: currentTheme.text }}>📅 {m.date} ⏰ {m.time || 'نامشخص'}</div>
                    {m.agenda && <div style={{ fontSize: '12px', opacity: 0.7, color: currentTheme.text, marginTop: '4px' }}>📋 {m.agenda}</div>}
                  </div>
                  <button style={styles.btnDanger} onClick={() => deleteMeeting(m.id)}>🗑️</button>
                </div>
              ))}
            </div>
            <button style={styles.btnSecondary} onClick={() => setShowMeetingModal(false)}>بستن</button>
          </div>
        </div>
      )}

      {showReportModal && (
        <div style={styles.modalOverlay} onClick={() => setShowReportModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>📈 گزارش عملکرد</div>
            <div style={styles.reportItem}><span>📋 کل تسک‌ها</span><span>{report.totalTasks}</span></div>
            <div style={styles.reportItem}><span>✅ تسک‌های انجام شده</span><span>{report.doneTasks}</span></div>
            <div style={styles.reportItem}><span>⏳ تسک‌های باقی‌مانده</span><span>{report.todoTasks}</span></div>
            <div style={styles.reportItem}><span>🔴 تسک‌های فوری</span><span>{report.urgentTasks}</span></div>
            <div style={styles.reportItem}><span>📅 جلسات امروز</span><span>{report.todayMeetings}</span></div>
            <div style={styles.reportItem}><span>📊 کل جلسات</span><span>{report.totalMeetings}</span></div>
            <div style={styles.reportItem}><span>📁 پروژه‌های فعال</span><span>{report.totalProjects}</span></div>
            <div style={styles.reportItem}><span>🎯 اهداف انجام شده</span><span>{report.doneGoals}/{report.totalGoals}</span></div>
            <button style={styles.btnSecondary} onClick={() => setShowReportModal(false)}>بستن</button>
          </div>
        </div>
      )}

      {showGoalsModal && (
        <div style={styles.modalOverlay} onClick={() => setShowGoalsModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>🎯 اهداف هفتگی</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="هدف جدید..."
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                style={{ ...styles.input, marginBottom: 0 }}
                onKeyDown={(e) => e.key === 'Enter' && addGoal()}
              />
              <button style={{ ...styles.btnPrimary, width: 'auto', padding: '0 20px' }} onClick={addGoal}>➕</button>
            </div>
            {weeklyGoals.map(g => (
              <div key={g.id} style={{ ...styles.goalItem, ...(g.done ? styles.goalDone : {}) }} onClick={() => toggleGoal(g.id)}>
                <span>{g.done ? '✅' : '⬜'}</span>
                <span style={{ flex: 1 }}>{g.text}</span>
                <button style={styles.btnDanger} onClick={(e) => { e.stopPropagation(); deleteGoal(g.id); }}>✕</button>
              </div>
            ))}
            <button style={styles.btnSecondary} onClick={() => setShowGoalsModal(false)}>بستن</button>
          </div>
        </div>
      )}

      {showArchiveModal && (
        <div style={styles.modalOverlay} onClick={() => setShowArchiveModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>🗂️ پروژه‌های آرشیو شده</div>
            {archivedProjects.length === 0 ? (
              <div style={{ textAlign: 'center', opacity: 0.5, padding: '20px 0' }}>📭 هیچ پروژه‌ای آرشیو نشده</div>
            ) : (
              archivedProjects.map(p => (
                <div key={p.id} style={styles.archiveItem}>
                  <span style={styles.projectName}>{p.name}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ ...styles.btnSuccess, padding: '2px 8px', fontSize: '10px' }} onClick={() => unarchiveProject(p.id)}>↩️</button>
                  </div>
                </div>
              ))
            )}
            <button style={styles.btnSecondary} onClick={() => setShowArchiveModal(false)}>بستن</button>
          </div>
        </div>
      )}
    </div>
  );
}
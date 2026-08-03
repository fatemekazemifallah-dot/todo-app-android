import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import styled, { keyframes } from 'styled-components';

// ===== انیمیشن مدیتیشن =====
const breathe = keyframes`
  0% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 0.6; }
`;

const MeditationAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${props => props.color || '#6C63FF'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  margin: 0 auto;
  animation: ${props => props.isRunning ? breathe : 'none'} 4s ease-in-out infinite;
  box-shadow: ${props => props.isRunning ? `0 0 50px ${props.color}50` : 'none'};
  transition: box-shadow 0.3s;
`;

const MeditationText = styled.div`
  text-align: center;
  margin-top: 12px;
  font-size: 14px;
  color: ${props => props.color || '#6C63FF'};
  opacity: 0.7;
  font-weight: 500;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const EduSection = styled.div`
  background: ${props => props.bg || '#fff'};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: ${props => props.shadow || '0 2px 12px rgba(0,0,0,0.06)'};
  animation: ${fadeIn} 0.3s ease;
`;

export default function StudentSection() {
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const isPremium = user?.isPremium || false;

  const [activeTab, setActiveTab] = useState('pomodoro');

  // ===== پومودورو =====
  const [pomodoroSettings, setPomodoroSettings] = useState({ studyTime: 25, breakTime: 5 });
  const [pomodoroState, setPomodoroState] = useState({ isRunning: false, phase: 'study', timeLeft: 25 * 60 });
  const [showPomodoroSettings, setShowPomodoroSettings] = useState(false);
  const [studySessions, setStudySessions] = useState(0);

  // ===== مدیتیشن =====
  const [meditationMinutes, setMeditationMinutes] = useState(5);
  const [meditationState, setMeditationState] = useState({ isRunning: false, timeLeft: 5 * 60 });
  const [selectedMusic, setSelectedMusic] = useState('silence');
  const audioRef = useRef(null);

  const musicOptions = [
    { id: 'silence', name: '🔇 بی‌صدا', url: '', premium: false },
    { id: 'nature', name: '🌿 طبیعت', url: '/audio/nature.mp3', premium: false },
    { id: 'ocean', name: '🌊 اقیانوس', url: '/audio/ocean.mp3', premium: false },
    { id: 'rain', name: '🌧 باران', url: '/audio/rain.mp3', premium: false },
    { id: 'calm', name: '🧘 آرامش‌بخش', url: '/audio/calm.mp3', premium: true },
    { id: 'guitar', name: '🎸 گیتار آرام', url: '/audio/guitar.mp3', premium: true },
    { id: 'harmonica', name: '🎵 هارمونیکا', url: '/audio/harmonica.mp3', premium: true },
    { id: 'santoor', name: '🎹 سنتور', url: '/audio/santoor.mp3', premium: true },
  ];

  // ===== برنامه هفتگی =====
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [newSchedule, setNewSchedule] = useState({ day: '', name: '', time: '' });
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

  // ===== امتحانات =====
  const [exams, setExams] = useState([]);
  const [newExam, setNewExam] = useState({ name: '', date: '' });
  const [showExamForm, setShowExamForm] = useState(false);

  // ===== نمرات =====
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: '', grade: '', units: '' });
  const [showCourseForm, setShowCourseForm] = useState(false);

  // ===== یادداشت‌ها =====
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '', course: '' });
  const [showNoteForm, setShowNoteForm] = useState(false);

  // ===== حالت تمرکز =====
  const [focusMode, setFocusMode] = useState(false);

  // ===== قفل گوشی =====
  const [lockTimer, setLockTimer] = useState({ isActive: false, timeLeft: 0 });

  // ===== نقشه راه =====
  const [roadmap, setRoadmap] = useState([]);
  const [newRoadmapItem, setNewRoadmapItem] = useState({ course: '', sections: '' });
  const [showRoadmapForm, setShowRoadmapForm] = useState(false);

  // ===== بارگذاری داده‌ها =====
  useEffect(() => {
    const savedExams = localStorage.getItem('exams');
    if (savedExams) setExams(JSON.parse(savedExams));
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) setCourses(JSON.parse(savedCourses));
    const savedNotes = localStorage.getItem('study_notes');
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    const savedSchedule = localStorage.getItem('weekly_schedule');
    if (savedSchedule) setWeeklySchedule(JSON.parse(savedSchedule));
    const savedPomodoro = localStorage.getItem('pomodoro_settings');
    if (savedPomodoro) setPomodoroSettings(JSON.parse(savedPomodoro));
    const savedMusic = localStorage.getItem('meditation_music');
    if (savedMusic) setSelectedMusic(savedMusic);
    const savedSessions = localStorage.getItem('study_sessions');
    if (savedSessions) setStudySessions(parseInt(savedSessions) || 0);
    const savedRoadmap = localStorage.getItem('study_roadmap');
    if (savedRoadmap) setRoadmap(JSON.parse(savedRoadmap));
  }, []);

  // ===== ذخیره‌سازی =====
  useEffect(() => {
    localStorage.setItem('exams', JSON.stringify(exams));
  }, [exams]);
  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);
  useEffect(() => {
    localStorage.setItem('study_notes', JSON.stringify(notes));
  }, [notes]);
  useEffect(() => {
    localStorage.setItem('weekly_schedule', JSON.stringify(weeklySchedule));
  }, [weeklySchedule]);
  useEffect(() => {
    localStorage.setItem('pomodoro_settings', JSON.stringify(pomodoroSettings));
  }, [pomodoroSettings]);
  useEffect(() => {
    localStorage.setItem('meditation_music', selectedMusic);
  }, [selectedMusic]);
  useEffect(() => {
    localStorage.setItem('study_sessions', String(studySessions));
  }, [studySessions]);
  useEffect(() => {
    localStorage.setItem('study_roadmap', JSON.stringify(roadmap));
  }, [roadmap]);

  // ===== پومودورو =====
  const startPomodoro = () => {
    setPomodoroState({ isRunning: true, phase: 'study', timeLeft: pomodoroSettings.studyTime * 60 });
  };

  const stopPomodoro = () => {
    setPomodoroState(prev => ({ ...prev, isRunning: false }));
  };

  const resetPomodoro = () => {
    setPomodoroState({ isRunning: false, phase: 'study', timeLeft: pomodoroSettings.studyTime * 60 });
  };

  useEffect(() => {
    let interval;
    if (pomodoroState.isRunning && pomodoroState.timeLeft > 0) {
      interval = setInterval(() => {
        setPomodoroState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (pomodoroState.isRunning && pomodoroState.timeLeft === 0) {
      const nextPhase = pomodoroState.phase === 'study' ? 'break' : 'study';
      const nextTime = nextPhase === 'study' ? pomodoroSettings.studyTime * 60 : pomodoroSettings.breakTime * 60;
      setPomodoroState({ isRunning: true, phase: nextPhase, timeLeft: nextTime });
      if (pomodoroState.phase === 'study') setStudySessions(prev => prev + 1);
    }
    return () => clearInterval(interval);
  }, [pomodoroState.isRunning, pomodoroState.timeLeft, pomodoroSettings]);

  // ===== مدیتیشن =====
  const startMeditation = () => {
    const music = musicOptions.find(m => m.id === selectedMusic);
    console.log('🎵 موسیقی انتخاب شده:', music);
    if (music && music.url && audioRef.current) {
      console.log('🎵 در حال پخش:', music.url);
      audioRef.current.src = music.url;
      audioRef.current.loop = true;
      audioRef.current.play().catch((err) => {
        console.error('❌ خطا در پخش:', err);
      });
    } else {
      console.log('❌ موسیقی پیدا نشد یا audioRef موجود نیست');
    }
    setMeditationState({ isRunning: true, timeLeft: meditationMinutes * 60 });
  };

  const stopMeditation = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.loop = false;
    }
    setMeditationState(prev => ({ ...prev, isRunning: false }));
  };

  useEffect(() => {
    let interval;
    if (meditationState.isRunning && meditationState.timeLeft > 0) {
      interval = setInterval(() => {
        setMeditationState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (meditationState.isRunning && meditationState.timeLeft === 0) {
      setMeditationState(prev => ({ ...prev, isRunning: false }));
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.loop = false;
      }
    }
    return () => clearInterval(interval);
  }, [meditationState.isRunning, meditationState.timeLeft]);

  // ===== برنامه هفتگی =====
  const addSchedule = () => {
    if (newSchedule.day && newSchedule.name && newSchedule.time) {
      setWeeklySchedule([...weeklySchedule, { id: Date.now(), ...newSchedule }]);
      setNewSchedule({ day: '', name: '', time: '' });
      setShowScheduleForm(false);
    }
  };
  const deleteSchedule = (id) => setWeeklySchedule(weeklySchedule.filter(s => s.id !== id));

  // ===== امتحانات =====
  const addExam = () => {
    if (newExam.name && newExam.date) {
      setExams([...exams, { id: Date.now(), ...newExam }]);
      setNewExam({ name: '', date: '' });
      setShowExamForm(false);
    }
  };
  const deleteExam = (id) => setExams(exams.filter(e => e.id !== id));

  // ===== نمرات =====
  const addCourse = () => {
    if (newCourse.name && newCourse.grade) {
      setCourses([...courses, { id: Date.now(), name: newCourse.name, grade: newCourse.grade, units: newCourse.units || '' }]);
      setNewCourse({ name: '', grade: '', units: '' });
      setShowCourseForm(false);
    }
  };
  const deleteCourse = (id) => setCourses(courses.filter(c => c.id !== id));

  const calculateGPA = () => {
    if (courses.length === 0) return 0;
    let totalGrade = 0, totalUnits = 0, hasUnits = false;
    courses.forEach(c => {
      if (c.units && parseFloat(c.units) > 0) {
        totalGrade += parseFloat(c.grade) * parseFloat(c.units);
        totalUnits += parseFloat(c.units);
        hasUnits = true;
      }
    });
    if (!hasUnits) {
      const sum = courses.reduce((acc, c) => acc + parseFloat(c.grade), 0);
      return (sum / courses.length).toFixed(2);
    }
    return totalUnits > 0 ? (totalGrade / totalUnits).toFixed(2) : 0;
  };

  // ===== یادداشت‌ها =====
  const addNote = () => {
    if (newNote.title && newNote.content) {
      setNotes([...notes, { id: Date.now(), ...newNote, createdAt: new Date().toISOString() }]);
      setNewNote({ title: '', content: '', course: '' });
      setShowNoteForm(false);
    }
  };
  const deleteNote = (id) => setNotes(notes.filter(n => n.id !== id));

  // ===== حالت تمرکز =====
  const toggleFocusMode = () => setFocusMode(!focusMode);

  // ===== قفل گوشی =====
  const startLockTimer = () => {
    if (!isPremium) return;
    const minutes = parseInt(prompt('مدت زمان قفل (دقیقه):', '25'));
    if (minutes > 0) {
      setLockTimer({ isActive: true, timeLeft: minutes * 60 });
    }
  };

  useEffect(() => {
    let interval;
    if (lockTimer.isActive && lockTimer.timeLeft > 0) {
      interval = setInterval(() => setLockTimer(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 })), 1000);
    } else if (lockTimer.isActive && lockTimer.timeLeft === 0) {
      setLockTimer({ isActive: false, timeLeft: 0 });
    }
    return () => clearInterval(interval);
  }, [lockTimer.isActive, lockTimer.timeLeft]);

  // ===== نقشه راه =====
  const addRoadmapItem = () => {
    if (newRoadmapItem.course && newRoadmapItem.sections) {
      const sections = newRoadmapItem.sections.split(',').map(s => s.trim());
      setRoadmap([...roadmap, { id: Date.now(), course: newRoadmapItem.course, sections: sections.map(s => ({ name: s, done: false })) }]);
      setNewRoadmapItem({ course: '', sections: '' });
      setShowRoadmapForm(false);
    }
  };

  const toggleSection = (courseId, sectionIndex) => {
    setRoadmap(roadmap.map(item => {
      if (item.id === courseId) {
        const newSections = [...item.sections];
        newSections[sectionIndex].done = !newSections[sectionIndex].done;
        return { ...item, sections: newSections };
      }
      return item;
    }));
  };

  const deleteRoadmapItem = (id) => setRoadmap(roadmap.filter(item => item.id !== id));

  const getCourseProgress = (item) => {
    if (item.sections.length === 0) return 0;
    return Math.round((item.sections.filter(s => s.done).length / item.sections.length) * 100);
  };

  const getTotalProgress = () => {
    if (roadmap.length === 0) return 0;
    let totalSections = 0, totalDone = 0;
    roadmap.forEach(item => {
      totalSections += item.sections.length;
      totalDone += item.sections.filter(s => s.done).length;
    });
    return Math.round((totalDone / totalSections) * 100);
  };

  // ===== نمودار پیشرفت =====
  const renderProgressChart = () => {
    if (courses.length === 0) return null;
    const maxGrade = 20;
    const colors = ['#6C63FF', '#FF6B6B', '#4ECDC4', '#F9A825', '#7B1FA2', '#E91E8C', '#2E7D32', '#1565C0'];
    return (
      <div style={{ marginTop: '16px', padding: '14px', background: currentTheme.bg, borderRadius: '12px' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: currentTheme.text, marginBottom: '14px', textAlign: 'center' }}>
          📈 نمودار پیشرفت دروس
        </div>
        {courses.map((course, index) => {
          const percentage = (parseFloat(course.grade) / maxGrade) * 100;
          const color = colors[index % colors.length];
          return (
            <div key={course.id} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: currentTheme.text, opacity: 0.7, marginBottom: '2px' }}>
                <span>{course.name}</span>
                <span>{course.grade} / {maxGrade}</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: currentTheme.border, borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${percentage}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 0.5s ease' }} />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ===== پریمیوم =====
  const handleActivatePremium = () => {
    if (window.confirm('آیا می‌خوای نسخه پرمیوم رو فعال کنی؟ (آزمایشی)')) {
      const { updateProfile } = useAuth();
      updateProfile({ ...user, isPremium: true });
      window.location.reload();
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // ===== استایل‌ها =====
  const styles = {
    title: {
      fontSize: '16px',
      fontWeight: '700',
      color: currentTheme.text,
      marginBottom: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    tabs: {
      display: 'flex',
      gap: '8px',
      marginBottom: '16px',
      flexWrap: 'wrap',
    },
    tab: {
      padding: '6px 14px',
      borderRadius: '12px',
      border: 'none',
      fontSize: '12px',
      cursor: 'pointer',
      background: currentTheme.bg,
      color: currentTheme.text,
      opacity: 0.6,
      fontWeight: '500',
      transition: 'all 0.2s',
    },
    tabActive: {
      background: currentTheme.primary,
      color: '#fff',
      opacity: 1,
    },
    timerDisplay: {
      fontSize: '48px',
      fontWeight: '700',
      textAlign: 'center',
      color: currentTheme.text,
      fontVariantNumeric: 'tabular-nums',
      marginBottom: '4px',
    },
    timerLabel: {
      textAlign: 'center',
      fontSize: '14px',
      color: currentTheme.text,
      opacity: 0.6,
      marginBottom: '8px',
    },
    timerButtons: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
      marginTop: '12px',
      flexWrap: 'wrap',
    },
    btn: {
      padding: '8px 20px',
      borderRadius: '12px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    btnPrimary: {
      background: currentTheme.primary,
      color: '#fff',
    },
    btnSecondary: {
      background: currentTheme.bg,
      color: currentTheme.text,
    },
    btnDanger: {
      background: '#ff4757',
      color: '#fff',
    },
    settingsBtn: {
      background: 'none',
      border: 'none',
      color: currentTheme.primary,
      cursor: 'pointer',
      fontSize: '13px',
      textDecoration: 'underline',
    },
    settingsPanel: {
      background: currentTheme.bg,
      borderRadius: '12px',
      padding: '12px',
      marginTop: '8px',
    },
    settingsRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '8px',
      flexWrap: 'wrap',
    },
    settingsLabel: {
      fontSize: '13px',
      color: currentTheme.text,
      minWidth: '70px',
    },
    settingsInput: {
      width: '60px',
      padding: '6px 10px',
      borderRadius: '8px',
      border: `1px solid ${currentTheme.border}`,
      background: currentTheme.card,
      color: currentTheme.text,
      fontSize: '14px',
      textAlign: 'center',
    },
    meditationDisplay: {
      fontSize: '36px',
      fontWeight: '700',
      textAlign: 'center',
      color: currentTheme.text,
      fontVariantNumeric: 'tabular-nums',
    },
    musicSelector: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      marginTop: '8px',
    },
    musicBtn: {
      padding: '6px 14px',
      borderRadius: '10px',
      border: `2px solid ${currentTheme.border}`,
      background: 'transparent',
      color: currentTheme.text,
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    musicBtnActive: {
      borderColor: currentTheme.primary,
      background: currentTheme.primaryLight,
      color: currentTheme.primary,
    },
    musicBtnPremium: {
      borderColor: '#F9A825',
      opacity: 0.6,
    },
    formInput: {
      width: '100%',
      padding: '8px 12px',
      borderRadius: '10px',
      border: `1px solid ${currentTheme.border}`,
      background: currentTheme.bg,
      color: currentTheme.text,
      fontSize: '14px',
      marginBottom: '8px',
    },
    formRow: {
      display: 'flex',
      gap: '8px',
    },
    formBtn: {
      padding: '8px 16px',
      borderRadius: '10px',
      border: 'none',
      background: currentTheme.primary,
      color: '#fff',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    formBtnCancel: {
      padding: '8px 16px',
      borderRadius: '10px',
      border: 'none',
      background: 'transparent',
      color: currentTheme.text,
      opacity: 0.5,
      cursor: 'pointer',
    },
    premiumLock: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '8px',
      borderRadius: '10px',
      background: currentTheme.bg,
      color: currentTheme.text,
      opacity: 0.6,
      fontSize: '13px',
      marginTop: '8px',
      flexWrap: 'wrap',
    },
    premiumLockBtn: {
      padding: '4px 12px',
      borderRadius: '8px',
      border: 'none',
      background: '#F9A825',
      color: '#000',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    examItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: `1px solid ${currentTheme.border}`,
    },
    examName: {
      fontSize: '14px',
      color: currentTheme.text,
    },
    examDate: {
      fontSize: '12px',
      color: currentTheme.text,
      opacity: 0.5,
    },
    examDelete: {
      background: 'none',
      border: 'none',
      color: '#ff4757',
      cursor: 'pointer',
      fontSize: '16px',
    },
    courseItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: `1px solid ${currentTheme.border}`,
    },
    courseName: {
      fontSize: '14px',
      color: currentTheme.text,
    },
    courseGrade: {
      fontSize: '14px',
      fontWeight: '600',
      color: currentTheme.primary,
    },
    gpaDisplay: {
      textAlign: 'center',
      fontSize: '20px',
      fontWeight: '700',
      color: currentTheme.primary,
      marginTop: '8px',
    },
    noteItem: {
      display: 'flex',
      flexDirection: 'column',
      padding: '8px 0',
      borderBottom: `1px solid ${currentTheme.border}`,
    },
    noteTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: currentTheme.text,
    },
    noteContent: {
      fontSize: '13px',
      color: currentTheme.text,
      opacity: 0.7,
      marginTop: '4px',
    },
    noteMeta: {
      fontSize: '11px',
      color: currentTheme.text,
      opacity: 0.4,
      marginTop: '4px',
    },
    noteDelete: {
      background: 'none',
      border: 'none',
      color: '#ff4757',
      cursor: 'pointer',
      fontSize: '14px',
      alignSelf: 'flex-end',
    },
    focusToggle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: `1px solid ${currentTheme.border}`,
    },
    focusSwitch: {
      width: '48px',
      height: '28px',
      borderRadius: '14px',
      background: currentTheme.border,
      cursor: 'pointer',
      position: 'relative',
      transition: 'all 0.3s',
    },
    focusSwitchOn: {
      background: currentTheme.primary,
    },
    focusSwitchDot: {
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      background: '#fff',
      position: 'absolute',
      top: '3px',
      left: '3px',
      transition: 'all 0.3s',
    },
    focusSwitchDotOn: {
      left: '23px',
    },
    lockSection: {
      marginTop: '12px',
      padding: '12px',
      background: currentTheme.bg,
      borderRadius: '12px',
    },
    lockBtn: {
      padding: '10px 20px',
      borderRadius: '12px',
      border: 'none',
      background: currentTheme.primary,
      color: '#fff',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
    },
    lockTimerDisplay: {
      fontSize: '24px',
      fontWeight: '700',
      color: currentTheme.text,
      textAlign: 'center',
      marginTop: '8px',
    },
    scheduleItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: `1px solid ${currentTheme.border}`,
    },
    scheduleInfo: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    scheduleDay: {
      fontSize: '12px',
      fontWeight: '600',
      color: currentTheme.primary,
      minWidth: '50px',
    },
    scheduleName: {
      fontSize: '14px',
      color: currentTheme.text,
    },
    scheduleTime: {
      fontSize: '12px',
      color: currentTheme.text,
      opacity: 0.5,
    },
    roadmapItem: {
      background: currentTheme.bg,
      borderRadius: '12px',
      padding: '14px',
      marginBottom: '12px',
    },
    roadmapCourse: {
      fontSize: '15px',
      fontWeight: '700',
      color: currentTheme.text,
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    roadmapProgress: {
      fontSize: '12px',
      color: currentTheme.primary,
      fontWeight: '600',
    },
    roadmapSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '6px 0',
      cursor: 'pointer',
      borderRadius: '8px',
      transition: 'all 0.2s',
    },
    roadmapSectionDone: {
      opacity: 0.5,
      textDecoration: 'line-through',
    },
    roadmapSectionCheck: {
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      border: `2px solid ${currentTheme.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      flexShrink: 0,
    },
    roadmapSectionCheckDone: {
      background: currentTheme.primary,
      borderColor: currentTheme.primary,
      color: '#fff',
    },
    roadmapSectionName: {
      fontSize: '13px',
      color: currentTheme.text,
    },
  };

  return (
    <>
      {/* ✅ تگ audio اینجاست */}
      <audio ref={audioRef} loop />
      
      <EduSection bg={currentTheme.card} shadow={currentTheme.shadow}>
        <div style={styles.title}>
          <span>📚 ابزارهای دانشجویی</span>
          <span style={{ fontSize: '12px', opacity: 0.5 }}>
            {isPremium ? '💎 پرمیوم' : '🆓 رایگان'}
          </span>
        </div>

        <div style={styles.tabs}>
          {['pomodoro', 'schedule', 'meditation', 'exams', 'grades', 'notes', 'focus', 'roadmap'].map(tab => (
            <button
              key={tab}
              style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'pomodoro' && '⏱ پومودورو'}
              {tab === 'schedule' && '📅 برنامه'}
              {tab === 'meditation' && '🧘 مدیتیشن'}
              {tab === 'exams' && '📝 امتحانات'}
              {tab === 'grades' && '📊 نمرات'}
              {tab === 'notes' && '📓 یادداشت'}
              {tab === 'focus' && '🎯 تمرکز'}
              {tab === 'roadmap' && '🗺 نقشه راه'}
            </button>
          ))}
        </div>

        {/* ===== پومودورو ===== */}
        {activeTab === 'pomodoro' && (
          <div style={{ padding: '16px 0' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={styles.timerLabel}>
                {pomodoroState.phase === 'study' ? '📖 زمان مطالعه' : '☕ زمان استراحت'}
              </div>
              <div style={styles.timerDisplay}>{formatTime(pomodoroState.timeLeft)}</div>
            </div>
            <div style={styles.timerButtons}>
              {!pomodoroState.isRunning ? (
                <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={startPomodoro}>▶ شروع</button>
              ) : (
                <button style={{ ...styles.btn, ...styles.btnDanger }} onClick={stopPomodoro}>⏸ توقف</button>
              )}
              <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={resetPomodoro}>🔄 reset</button>
              <button style={styles.settingsBtn} onClick={() => setShowPomodoroSettings(!showPomodoroSettings)}>⚙️ تنظیمات</button>
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: currentTheme.text, opacity: 0.6 }}>
              📊 جلسات مطالعه امروز: {studySessions}
            </div>
            {showPomodoroSettings && (
              <div style={styles.settingsPanel}>
                <div style={styles.settingsRow}>
                  <span style={styles.settingsLabel}>⏱ مطالعه</span>
                  <input type="number" min="1" max="90" value={pomodoroSettings.studyTime} onChange={(e) => setPomodoroSettings({ ...pomodoroSettings, studyTime: parseInt(e.target.value) || 25 })} style={styles.settingsInput} />
                  <span style={{ fontSize: '13px', opacity: 0.5 }}>دقیقه</span>
                </div>
                <div style={styles.settingsRow}>
                  <span style={styles.settingsLabel}>☕ استراحت</span>
                  <input type="number" min="1" max="30" value={pomodoroSettings.breakTime} onChange={(e) => setPomodoroSettings({ ...pomodoroSettings, breakTime: parseInt(e.target.value) || 5 })} style={styles.settingsInput} />
                  <span style={{ fontSize: '13px', opacity: 0.5 }}>دقیقه</span>
                </div>
                <button style={{ ...styles.btn, ...styles.btnPrimary, width: '100%', marginTop: '8px' }} onClick={() => { resetPomodoro(); setShowPomodoroSettings(false); }}>اعمال تنظیمات</button>
              </div>
            )}
          </div>
        )}

        {/* ===== برنامه هفتگی (پریمیوم) ===== */}
        {activeTab === 'schedule' && (
          <div>
            {!isPremium ? (
              <div style={styles.premiumLock}>
                🔒 برنامه هفتگی دروس یک قابلیت پریمیوم است
                <button style={styles.premiumLockBtn} onClick={handleActivatePremium}>فعال‌سازی</button>
              </div>
            ) : (
              <>
                {weeklySchedule.length === 0 ? (
                  <div style={{ textAlign: 'center', opacity: 0.5, padding: '16px 0' }}>📅 هیچ درسی برنامه‌ریزی نشده</div>
                ) : (
                  weeklySchedule.map(item => (
                    <div key={item.id} style={styles.scheduleItem}>
                      <div style={styles.scheduleInfo}>
                        <span style={styles.scheduleDay}>{item.day}</span>
                        <span style={styles.scheduleName}>{item.name}</span>
                        <span style={styles.scheduleTime}>⏰ {item.time}</span>
                      </div>
                      <button style={styles.examDelete} onClick={() => deleteSchedule(item.id)}>✕</button>
                    </div>
                  ))
                )}
                {showScheduleForm ? (
                  <div style={{ marginTop: '12px' }}>
                    <select value={newSchedule.day} onChange={(e) => setNewSchedule({ ...newSchedule, day: e.target.value })} style={styles.formInput}>
                      <option value="">روز</option>
                      {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <input type="text" placeholder="نام درس" value={newSchedule.name} onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })} style={styles.formInput} />
                    <input type="time" value={newSchedule.time} onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })} style={styles.formInput} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={styles.formBtn} onClick={addSchedule}>➕ اضافه</button>
                      <button style={styles.formBtnCancel} onClick={() => setShowScheduleForm(false)}>لغو</button>
                    </div>
                  </div>
                ) : (
                  <button style={{ ...styles.btn, ...styles.btnPrimary, width: '100%', marginTop: '8px' }} onClick={() => setShowScheduleForm(true)}>➕ افزودن درس به برنامه</button>
                )}
              </>
            )}
          </div>
        )}

        {/* ===== مدیتیشن ===== */}
        {activeTab === 'meditation' && (
          <div>
            <div style={{ textAlign: 'center', margin: '8px 0 16px' }}>
              <MeditationAvatar color={currentTheme.primary} isRunning={meditationState.isRunning}>
                🧘
              </MeditationAvatar>
              <MeditationText color={currentTheme.primary}>
                {meditationState.isRunning ? '🧘 در حال نفس‌کشیدن...' : 'آماده مدیتیشن'}
              </MeditationText>
            </div>
            <div style={styles.meditationDisplay}>{formatTime(meditationState.timeLeft)}</div>
            <div style={styles.timerButtons}>
              {!meditationState.isRunning ? (
                <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={startMeditation}>▶ شروع مدیتیشن</button>
              ) : (
                <button style={{ ...styles.btn, ...styles.btnDanger }} onClick={stopMeditation}>⏸ توقف</button>
              )}
            </div>
            <div style={styles.settingsRow}>
              <span style={styles.settingsLabel}>⏱ مدت</span>
              <input type="number" min="1" max="30" value={meditationMinutes} onChange={(e) => setMeditationMinutes(parseInt(e.target.value) || 5)} style={styles.settingsInput} disabled={meditationState.isRunning} />
              <span style={{ fontSize: '13px', opacity: 0.5 }}>دقیقه</span>
            </div>
            <div style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: currentTheme.text, opacity: 0.6 }}>🎵 موسیقی پس‌زمینه</span>
              </div>
              <div style={styles.musicSelector}>
                {musicOptions.map(music => {
                  const canUse = !music.premium || isPremium;
                  return (
                    <button
                      key={music.id}
                      style={{
                        ...styles.musicBtn,
                        ...(selectedMusic === music.id ? styles.musicBtnActive : {}),
                        ...(music.premium ? styles.musicBtnPremium : {}),
                        opacity: canUse ? 1 : 0.4,
                        cursor: canUse ? 'pointer' : 'not-allowed',
                      }}
                      onClick={() => canUse && setSelectedMusic(music.id)}
                    >
                      {music.name}
                      {music.premium && !isPremium && ' 🔒'}
                      {music.premium && isPremium && ' 💎'}
                    </button>
                  );
                })}
              </div>
              {!isPremium && (
                <div style={styles.premiumLock}>
                  🔒 ۴ موسیقی ویژه برای کاربران پریمیوم
                  <button style={styles.premiumLockBtn} onClick={handleActivatePremium}>فعال‌سازی</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== امتحانات ===== */}
        {activeTab === 'exams' && (
          <div>
            {exams.length === 0 ? (
              <div style={{ textAlign: 'center', opacity: 0.5, padding: '16px 0' }}>📭 هیچ امتحانی ثبت نشده</div>
            ) : (
              exams.map(exam => (
                <div key={exam.id} style={styles.examItem}>
                  <div>
                    <div style={styles.examName}>{exam.name}</div>
                    <div style={styles.examDate}>📅 {exam.date}</div>
                  </div>
                  <button style={styles.examDelete} onClick={() => deleteExam(exam.id)}>✕</button>
                </div>
              ))
            )}
            {showExamForm ? (
              <div style={{ marginTop: '12px' }}>
                <input type="text" placeholder="نام درس" value={newExam.name} onChange={(e) => setNewExam({ ...newExam, name: e.target.value })} style={styles.formInput} />
                <input type="date" value={newExam.date} onChange={(e) => setNewExam({ ...newExam, date: e.target.value })} style={styles.formInput} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={styles.formBtn} onClick={addExam}>➕ اضافه</button>
                  <button style={styles.formBtnCancel} onClick={() => setShowExamForm(false)}>لغو</button>
                </div>
              </div>
            ) : (
              <button style={{ ...styles.btn, ...styles.btnPrimary, width: '100%', marginTop: '8px' }} onClick={() => setShowExamForm(true)}>➕ افزودن امتحان</button>
            )}
          </div>
        )}

        {/* ===== نمرات ===== */}
        {activeTab === 'grades' && (
          <div>
            {courses.length === 0 ? (
              <div style={{ textAlign: 'center', opacity: 0.5, padding: '16px 0' }}>📊 هیچ درسی ثبت نشده</div>
            ) : (
              <>
                {courses.map(course => (
                  <div key={course.id} style={styles.courseItem}>
                    <span style={styles.courseName}>{course.name}</span>
                    <span style={styles.courseGrade}>
                      {course.grade} {course.units && `(${course.units} واحد)`}
                    </span>
                    <button style={styles.examDelete} onClick={() => deleteCourse(course.id)}>✕</button>
                  </div>
                ))}
                <div style={styles.gpaDisplay}>📊 معدل: {calculateGPA()}</div>
                {renderProgressChart()}
              </>
            )}
            {showCourseForm ? (
              <div style={{ marginTop: '12px' }}>
                <input type="text" placeholder="نام درس" value={newCourse.name} onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })} style={styles.formInput} />
                <div style={styles.formRow}>
                  <input type="number" placeholder="نمره" value={newCourse.grade} onChange={(e) => setNewCourse({ ...newCourse, grade: e.target.value })} style={{ ...styles.formInput, flex: 1 }} step="0.01" min="0" max="20" />
                  <input type="number" placeholder="واحد (اختیاری)" value={newCourse.units} onChange={(e) => setNewCourse({ ...newCourse, units: e.target.value })} style={{ ...styles.formInput, flex: 1 }} min="0" max="6" />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={styles.formBtn} onClick={addCourse}>➕ اضافه</button>
                  <button style={styles.formBtnCancel} onClick={() => setShowCourseForm(false)}>لغو</button>
                </div>
              </div>
            ) : (
              <button style={{ ...styles.btn, ...styles.btnPrimary, width: '100%', marginTop: '8px' }} onClick={() => setShowCourseForm(true)}>➕ افزودن درس</button>
            )}
          </div>
        )}

        {/* ===== یادداشت‌ها (پریمیوم) ===== */}
        {activeTab === 'notes' && (
          <div>
            {!isPremium ? (
              <div style={styles.premiumLock}>
                🔒 دفترچه یادداشت درسی یک قابلیت پریمیوم است
                <button style={styles.premiumLockBtn} onClick={handleActivatePremium}>فعال‌سازی</button>
              </div>
            ) : (
              <>
                {notes.length === 0 ? (
                  <div style={{ textAlign: 'center', opacity: 0.5, padding: '16px 0' }}>📓 هیچ یادداشتی ثبت نشده</div>
                ) : (
                  notes.map(note => (
                    <div key={note.id} style={styles.noteItem}>
                      <div>
                        <div style={styles.noteTitle}>{note.title}</div>
                        <div style={styles.noteContent}>{note.content}</div>
                        <div style={styles.noteMeta}>
                          {note.course && `📚 ${note.course} • `}
                          {new Date(note.createdAt).toLocaleDateString('fa-IR')}
                        </div>
                      </div>
                      <button style={styles.noteDelete} onClick={() => deleteNote(note.id)}>✕</button>
                    </div>
                  ))
                )}
                {showNoteForm ? (
                  <div style={{ marginTop: '12px' }}>
                    <input type="text" placeholder="عنوان یادداشت" value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} style={styles.formInput} />
                    <input type="text" placeholder="نام درس (اختیاری)" value={newNote.course} onChange={(e) => setNewNote({ ...newNote, course: e.target.value })} style={styles.formInput} />
                    <textarea placeholder="متن یادداشت..." value={newNote.content} onChange={(e) => setNewNote({ ...newNote, content: e.target.value })} style={{ ...styles.formInput, minHeight: '80px' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={styles.formBtn} onClick={addNote}>➕ ذخیره</button>
                      <button style={styles.formBtnCancel} onClick={() => setShowNoteForm(false)}>لغو</button>
                    </div>
                  </div>
                ) : (
                  <button style={{ ...styles.btn, ...styles.btnPrimary, width: '100%', marginTop: '8px' }} onClick={() => setShowNoteForm(true)}>➕ افزودن یادداشت جدید</button>
                )}
              </>
            )}
          </div>
        )}

        {/* ===== حالت تمرکز ===== */}
        {activeTab === 'focus' && (
          <div>
            <div style={styles.focusToggle}>
              <div>
                <div style={{ fontWeight: '600', color: currentTheme.text }}>🎯 حالت تمرکز</div>
                <div style={{ fontSize: '12px', opacity: 0.5, color: currentTheme.text }}>
                  {focusMode ? 'فعال ✅' : 'غیرفعال'}
                </div>
              </div>
              <div style={{ ...styles.focusSwitch, ...(focusMode ? styles.focusSwitchOn : {}) }} onClick={toggleFocusMode}>
                <div style={{ ...styles.focusSwitchDot, ...(focusMode ? styles.focusSwitchDotOn : {}) }} />
              </div>
            </div>
            {focusMode && (
              <div style={{ padding: '12px 0', color: currentTheme.text, opacity: 0.7, fontSize: '14px' }}>
                🔕 اعلان‌ها غیرفعال شده‌اند. فقط تسک‌های امروز نمایش داده می‌شوند.
              </div>
            )}
            <div style={styles.lockSection}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: currentTheme.text, opacity: 0.7 }}>🔒 قفل گوشی هنگام مطالعه</span>
                {isPremium ? (
                  <button style={styles.lockBtn} onClick={startLockTimer}>
                    {lockTimer.isActive ? `⏳ ${formatTime(lockTimer.timeLeft)}` : '🔒 قفل کن'}
                  </button>
                ) : (
                  <span style={{ fontSize: '12px', color: '#F9A825', fontWeight: '600' }}>💎 پریمیوم</span>
                )}
              </div>
              {lockTimer.isActive && <div style={styles.lockTimerDisplay}>⏳ {formatTime(lockTimer.timeLeft)}</div>}
              {!isPremium && (
                <div style={styles.premiumLock}>
                  🔒 فقط کاربران پریمیوم می‌توانند گوشی را قفل کنند
                  <button style={styles.premiumLockBtn} onClick={handleActivatePremium}>فعال‌سازی</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== نقشه راه ===== */}
        {activeTab === 'roadmap' && (
          <div>
            <div style={{ marginBottom: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: currentTheme.text, opacity: 0.6 }}>📊 پیشرفت کلی: {getTotalProgress()}%</div>
              <div style={{ width: '100%', height: '6px', background: currentTheme.border, borderRadius: '4px', overflow: 'hidden', marginTop: '4px' }}>
                <div style={{ width: `${getTotalProgress()}%`, height: '100%', background: currentTheme.primary, borderRadius: '4px', transition: 'width 0.5s ease' }} />
              </div>
            </div>
            {roadmap.length === 0 ? (
              <div style={{ textAlign: 'center', opacity: 0.5, padding: '16px 0' }}>🗺 هیچ دوره‌ای ثبت نشده</div>
            ) : (
              roadmap.map(item => (
                <div key={item.id} style={styles.roadmapItem}>
                  <div style={styles.roadmapCourse}>
                    <span>📘 {item.course}</span>
                    <span style={styles.roadmapProgress}>{getCourseProgress(item)}%</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: currentTheme.border, borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{ width: `${getCourseProgress(item)}%`, height: '100%', background: currentTheme.primary, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                  </div>
                  {item.sections.map((section, idx) => (
                    <div
                      key={idx}
                      style={{
                        ...styles.roadmapSection,
                        ...(section.done ? styles.roadmapSectionDone : {}),
                      }}
                      onClick={() => toggleSection(item.id, idx)}
                    >
                      <div style={{ ...styles.roadmapSectionCheck, ...(section.done ? styles.roadmapSectionCheckDone : {}) }}>
                        {section.done && '✓'}
                      </div>
                      <span style={styles.roadmapSectionName}>{section.name}</span>
                    </div>
                  ))}
                  <button style={{ ...styles.btn, ...styles.btnDanger, marginTop: '8px', padding: '4px 12px', fontSize: '12px' }} onClick={() => deleteRoadmapItem(item.id)}>حذف</button>
                </div>
              ))
            )}
            {showRoadmapForm ? (
              <div style={{ marginTop: '12px' }}>
                <input type="text" placeholder="نام درس" value={newRoadmapItem.course} onChange={(e) => setNewRoadmapItem({ ...newRoadmapItem, course: e.target.value })} style={styles.formInput} />
                <input type="text" placeholder="بخش‌ها (با کاما جدا کنید)" value={newRoadmapItem.sections} onChange={(e) => setNewRoadmapItem({ ...newRoadmapItem, sections: e.target.value })} style={styles.formInput} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={styles.formBtn} onClick={addRoadmapItem}>➕ اضافه</button>
                  <button style={styles.formBtnCancel} onClick={() => setShowRoadmapForm(false)}>لغو</button>
                </div>
              </div>
            ) : (
              <button style={{ ...styles.btn, ...styles.btnPrimary, width: '100%', marginTop: '8px' }} onClick={() => setShowRoadmapForm(true)}>➕ افزودن درس به نقشه راه</button>
            )}
          </div>
        )}
      </EduSection>
    </>
  );
}
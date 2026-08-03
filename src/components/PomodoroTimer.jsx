import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function PomodoroTimer() {
  const { currentTheme } = useTheme();
  
  // تنظیمات پیش‌فرض
  const [focusTime, setFocusTime] = useState(25); // دقیقه
  const [breakTime, setBreakTime] = useState(5); // دقیقه
  const [timeLeft, setTimeLeft] = useState(focusTime * 60); // ثانیه
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' | 'break'
  const [showSettings, setShowSettings] = useState(false);
  
  const timerRef = useRef(null);

  // بارگذاری تنظیمات از localStorage
  useEffect(() => {
    const savedFocus = localStorage.getItem('pomodoro_focus');
    const savedBreak = localStorage.getItem('pomodoro_break');
    if (savedFocus) setFocusTime(parseInt(savedFocus));
    if (savedBreak) setBreakTime(parseInt(savedBreak));
  }, []);

  // ذخیره تنظیمات
  useEffect(() => {
    localStorage.setItem('pomodoro_focus', focusTime);
    localStorage.setItem('pomodoro_break', breakTime);
  }, [focusTime, breakTime]);

  // مدیریت تایمر
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // تموم شدن تایمر
            clearInterval(timerRef.current);
            setIsRunning(false);
            // نمایش اعلان
            if (Notification.permission === 'granted') {
              new Notification(isBreak ? '⏰ استراحت تموم شد!' : '⏰ زمان مطالعه تموم شد!', {
                body: isBreak ? 'زمان شروع مطالعه' : 'زمان استراحت',
              });
            }
            // اگر حالت فوکوس بود، بریم به استراحت
            if (!isBreak) {
              setIsBreak(true);
              setTimeLeft(breakTime * 60);
              setIsRunning(true);
            } else {
              setIsBreak(false);
              setTimeLeft(focusTime * 60);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, isBreak, focusTime, breakTime]);

  const startTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(isBreak ? breakTime * 60 : focusTime * 60);
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(focusTime * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = () => {
    const total = isBreak ? breakTime * 60 : focusTime * 60;
    return ((total - timeLeft) / total) * 100;
  };

  const styles = {
    container: {
      background: currentTheme.card,
      borderRadius: '20px',
      padding: '24px',
      boxShadow: currentTheme.shadow,
      marginBottom: '20px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      color: currentTheme.text,
    },
    modeBadge: {
      padding: '4px 14px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '500',
      background: isBreak ? currentTheme.accent : currentTheme.primary,
      color: '#fff',
    },
    timer: {
      textAlign: 'center',
      padding: '16px 0',
    },
    timeDisplay: {
      fontSize: '56px',
      fontWeight: '700',
      color: currentTheme.text,
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '2px',
    },
    progressBar: {
      width: '100%',
      height: '6px',
      borderRadius: '3px',
      background: currentTheme.border,
      marginTop: '12px',
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: '3px',
      background: isBreak ? currentTheme.accent : currentTheme.primary,
      transition: 'width 0.3s ease',
      width: `${progress()}%`,
    },
    controls: {
      display: 'flex',
      justifyContent: 'center',
      gap: '12px',
      marginTop: '16px',
    },
    controlBtn: {
      padding: '10px 24px',
      borderRadius: '14px',
      border: 'none',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    startBtn: {
      background: currentTheme.gradient || currentTheme.primary,
      color: '#fff',
    },
    pauseBtn: {
      background: currentTheme.border,
      color: currentTheme.text,
    },
    resetBtn: {
      background: 'transparent',
      color: currentTheme.text,
      opacity: 0.5,
      border: `1px solid ${currentTheme.border}`,
    },
    settingsBtn: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: currentTheme.text,
      opacity: 0.5,
    },
    settingsPanel: {
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: `1px solid ${currentTheme.border}`,
      display: showSettings ? 'block' : 'none',
    },
    settingRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '10px',
    },
    settingLabel: {
      fontSize: '14px',
      color: currentTheme.text,
      opacity: 0.7,
      minWidth: '100px',
    },
    settingInput: {
      width: '70px',
      padding: '8px 12px',
      borderRadius: '10px',
      border: `2px solid ${currentTheme.border}`,
      background: currentTheme.bg,
      color: currentTheme.text,
      fontSize: '14px',
      textAlign: 'center',
      outline: 'none',
    },
    presetBtn: {
      padding: '4px 12px',
      borderRadius: '8px',
      border: `1px solid ${currentTheme.border}`,
      background: 'transparent',
      color: currentTheme.text,
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    presetBtnHover: {
      background: currentTheme.primaryLight,
    },
    presets: {
      display: 'flex',
      gap: '6px',
      flexWrap: 'wrap',
      marginTop: '6px',
    },
  };

  const presets = [
    { focus: 25, break: 5, label: '۲۵/۵' },
    { focus: 30, break: 10, label: '۳۰/۱۰' },
    { focus: 50, break: 10, label: '۵۰/۱۰' },
    { focus: 60, break: 15, label: '۶۰/۱۵' },
  ];

  const applyPreset = (focus, br) => {
    setFocusTime(focus);
    setBreakTime(br);
    if (!isRunning) {
      setIsBreak(false);
      setTimeLeft(focus * 60);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>⏱️ تایمر مطالعه</span>
        <span style={styles.modeBadge}>{isBreak ? '☕ استراحت' : '📖 مطالعه'}</span>
        <button style={styles.settingsBtn} onClick={() => setShowSettings(!showSettings)}>
          ⚙️
        </button>
      </div>

      <div style={styles.timer}>
        <div style={styles.timeDisplay}>{formatTime(timeLeft)}</div>
        <div style={styles.progressBar}>
          <div style={styles.progressFill} />
        </div>
      </div>

      <div style={styles.controls}>
        {!isRunning ? (
          <button style={{ ...styles.controlBtn, ...styles.startBtn }} onClick={startTimer}>
            ▶ شروع
          </button>
        ) : (
          <button style={{ ...styles.controlBtn, ...styles.pauseBtn }} onClick={pauseTimer}>
            ⏸ توقف
          </button>
        )}
        <button style={{ ...styles.controlBtn, ...styles.resetBtn }} onClick={resetTimer}>
          ↺ ریست
        </button>
      </div>

      <div style={styles.settingsPanel}>
        <div style={styles.settingRow}>
          <span style={styles.settingLabel}>⏱ زمان مطالعه</span>
          <input
            type="number"
            min="1"
            max="90"
            value={focusTime}
            onChange={(e) => setFocusTime(parseInt(e.target.value) || 1)}
            style={styles.settingInput}
          />
          <span style={{ fontSize: '14px', color: currentTheme.text, opacity: 0.5 }}>دقیقه</span>
        </div>
        <div style={styles.settingRow}>
          <span style={styles.settingLabel}>☕ زمان استراحت</span>
          <input
            type="number"
            min="1"
            max="30"
            value={breakTime}
            onChange={(e) => setBreakTime(parseInt(e.target.value) || 1)}
            style={styles.settingInput}
          />
          <span style={{ fontSize: '14px', color: currentTheme.text, opacity: 0.5 }}>دقیقه</span>
        </div>
        <div style={styles.presets}>
          {presets.map((p) => (
            <button
              key={p.label}
              style={styles.presetBtn}
              onClick={() => applyPreset(p.focus, p.break)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
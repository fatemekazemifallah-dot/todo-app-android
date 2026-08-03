import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

// ===== چالش‌های روزانه =====
const dailyChallenges = [
  { id: 1, text: '۵ دقیقه پیاده‌روی کن', emoji: '🚶' },
  { id: 2, text: 'یه صفحه کتاب بخون', emoji: '📖' },
  { id: 3, text: 'یه آهنگ جدید گوش بده', emoji: '🎵' },
  { id: 4, text: 'بدون قند چای بخور', emoji: '☕' },
  { id: 5, text: '۳ دقیقه نفس عمیق بکش', emoji: '🧘' },
  { id: 6, text: 'به یه گیاه آب بده', emoji: '🌿' },
  { id: 7, text: 'امروز رو در ۳ کلمه خلاصه کن', emoji: '📝' },
  { id: 8, text: 'به یه نفر لبخند بزن', emoji: '😊' },
  { id: 9, text: 'یه عکس از غروب بگیر', emoji: '📸' },
  { id: 10, text: 'یه پادکست گوش بده', emoji: '🎧' },
  { id: 11, text: 'یه گوشه خونه رو مرتب کن', emoji: '🧹' },
  { id: 12, text: 'یه لیوان آب بخور', emoji: '💧' },
];

export default function PublicSection() {
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const isPremium = user?.isPremium || false;
  
  const [challenges, setChallenges] = useState([]);
  const [doneChallenges, setDoneChallenges] = useState([]);
  const [showNightReview, setShowNightReview] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showProPlan, setShowProPlan] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // ===== دریافت چالش‌های روز =====
  useEffect(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem('daily_challenges');
    const savedDone = localStorage.getItem('done_challenges');
    const savedDate = localStorage.getItem('challenge_date');

    if (saved && savedDate === today) {
      setChallenges(JSON.parse(saved));
    } else {
      const shuffled = [...dailyChallenges].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);
      setChallenges(selected);
      localStorage.setItem('daily_challenges', JSON.stringify(selected));
      localStorage.setItem('challenge_date', today);
    }

    if (savedDone) {
      setDoneChallenges(JSON.parse(savedDone));
    }
  }, []);

  // ===== ذخیره‌سازی چالش‌های انجام شده =====
  useEffect(() => {
    localStorage.setItem('done_challenges', JSON.stringify(doneChallenges));
  }, [doneChallenges]);

  // ===== انجام چالش =====
  const toggleChallenge = (id) => {
    if (doneChallenges.includes(id)) {
      setDoneChallenges(doneChallenges.filter(d => d !== id));
    } else {
      setDoneChallenges([...doneChallenges, id]);
    }
  };

  // ===== بررسی شبانه =====
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 20 || hour < 6) {
      setShowNightReview(true);
    } else {
      setShowNightReview(false);
    }
  }, []);

  // ===== زمان برای پس‌زمینه پویا =====
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // ===== پس‌زمینه پویا (پریمیوم) =====
  const getDynamicBackground = () => {
    if (!isPremium) return currentTheme.bg;
    
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) {
      return 'linear-gradient(135deg, #fdfcfb, #e2d1c3)';
    } else if (hour >= 12 && hour < 17) {
      return 'linear-gradient(135deg, #f5f7fa, #c3cfe2)';
    } else if (hour >= 17 && hour < 20) {
      return 'linear-gradient(135deg, #fbc2eb, #a6c1ee)';
    } else {
      return 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)';
    }
  };

  // ===== دستیار صوتی (پریمیوم) =====
  const startVoiceAssistant = () => {
    if (!isPremium) {
      alert('🔒 این قابلیت فقط برای کاربران پریمیوم است!');
      return;
    }
    
    // چک کردن پشتیبانی مرورگر
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('❌ مرورگر شما از دستیار صوتی پشتیبانی نمیکند. لطفاً از Chrome استفاده کنید.');
      return;
    }

    // درخواست مجوز میکروفون
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'fa-IR';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        setIsListening(true);
        recognition.start();

        recognition.onstart = () => {
          console.log('🎤 گوش دادن...');
        };

        recognition.onresult = (event) => {
          const text = event.results[0][0].transcript;
          console.log('📝 متن تشخیص داده شده:', text);
          
          if (text && text.trim()) {
            const addTaskEvent = new CustomEvent('addTaskFromVoice', { 
              detail: { text: text.trim() } 
            });
            window.dispatchEvent(addTaskEvent);
            alert(`✅ تسک "${text.trim()}" با موفقیت اضافه شد!`);
          }
          setIsListening(false);
        };

        recognition.onerror = (event) => {
          console.error('❌ خطا:', event.error);
          if (event.error === 'not-allowed') {
            alert('❌ لطفاً مجوز میکروفون را در مرورگر فعال کنید.');
          } else if (event.error === 'no-speech') {
            alert('❌ صدایی تشخیص داده نشد. دوباره تلاش کن.');
          } else {
            alert('❌ مشکلی در تشخیص صدا پیش آمد. دوباره تلاش کن.');
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      })
      .catch(() => {
        alert('❌ لطفاً مجوز میکروفون را در مرورگر فعال کنید.');
      });
  };

  // ===== دریافت چالش‌های جدید =====
  const refreshChallenges = () => {
    const shuffled = [...dailyChallenges].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    setChallenges(selected);
    setDoneChallenges([]);
    localStorage.setItem('daily_challenges', JSON.stringify(selected));
    localStorage.setItem('done_challenges', JSON.stringify([]));
  };

  // ===== قفسه‌ی کارها (Shelf Mode) =====
  const [shelfTasks, setShelfTasks] = useState([]);
  const [newShelfTask, setNewShelfTask] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('shelf_tasks');
    if (saved) setShelfTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('shelf_tasks', JSON.stringify(shelfTasks));
  }, [shelfTasks]);

  const addShelfTask = () => {
    if (newShelfTask.trim()) {
      setShelfTasks([...shelfTasks, { id: Date.now(), text: newShelfTask, done: false }]);
      setNewShelfTask('');
    }
  };

  const toggleShelfTask = (id) => {
    setShelfTasks(shelfTasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteShelfTask = (id) => {
    setShelfTasks(shelfTasks.filter(t => t.id !== id));
  };

  // ===== استایل‌ها =====
  const styles = {
    container: {
      background: isPremium ? getDynamicBackground() : currentTheme.bg,
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '16px',
      transition: 'all 0.5s ease',
      boxShadow: currentTheme.shadow,
      direction: 'rtl',
    },
    title: {
      fontSize: '16px',
      fontWeight: '700',
      color: currentTheme.text,
      marginBottom: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    premiumBadge: {
      fontSize: '11px',
      background: '#F9A825',
      color: '#000',
      padding: '2px 10px',
      borderRadius: '12px',
      fontWeight: '700',
    },
    proPlanBtn: {
      padding: '10px 16px',
      borderRadius: '12px',
      border: `2px solid ${currentTheme.primary}`,
      background: isPremium ? currentTheme.primary : 'transparent',
      color: isPremium ? '#fff' : currentTheme.primary,
      fontSize: '14px',
      fontWeight: '700',
      cursor: 'pointer',
      width: '100%',
      marginBottom: '12px',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    proPlanActive: {
      background: currentTheme.primary,
      color: '#fff',
    },
    proPlanContent: {
      animation: 'fadeIn 0.3s ease',
    },
    challengeItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 14px',
      borderRadius: '12px',
      background: currentTheme.card,
      marginBottom: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    },
    challengeDone: {
      opacity: 0.5,
      textDecoration: 'line-through',
    },
    challengeCheck: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      border: `2px solid ${currentTheme.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      flexShrink: 0,
    },
    challengeCheckDone: {
      background: currentTheme.primary,
      borderColor: currentTheme.primary,
      color: '#fff',
    },
    // ✅ قفسه کارها با کادر خوشگل
    shelfGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '10px',
      marginTop: '10px',
    },
    shelfCard: {
      background: currentTheme.card,
      borderRadius: '14px',
      padding: '14px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'center',
      minHeight: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      border: `2px solid ${currentTheme.primary}30`, // ✅ کادر خوشگل
    },
    shelfCardHover: {
      transform: 'scale(1.02)',
      borderColor: currentTheme.primary,
      boxShadow: `0 4px 16px ${currentTheme.primary}25`,
    },
    shelfCardDone: {
      opacity: 0.4,
      textDecoration: 'line-through',
      borderColor: currentTheme.border,
    },
    shelfCardDelete: {
      position: 'absolute',
      top: '-6px',
      right: '-6px',
      background: '#ff4757',
      color: '#fff',
      border: 'none',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      fontSize: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    shelfAdd: {
      display: 'flex',
      gap: '8px',
      marginTop: '10px',
    },
    shelfInput: {
      flex: 1,
      padding: '8px 12px',
      borderRadius: '10px',
      border: `2px solid ${currentTheme.border}`,
      background: currentTheme.bg,
      color: currentTheme.text,
      fontSize: '14px',
      outline: 'none',
    },
    shelfAddBtn: {
      padding: '8px 16px',
      borderRadius: '10px',
      border: 'none',
      background: currentTheme.primary,
      color: '#fff',
      fontSize: '14px',
      cursor: 'pointer',
    },
    // ✅ دکمه صوتی با استایل جدید
    voiceBtn: {
      padding: '10px 16px',
      borderRadius: '12px',
      border: `2px solid ${currentTheme.primary}`,
      background: isPremium ? currentTheme.primary : currentTheme.bg,
      color: isPremium ? '#fff' : currentTheme.text,
      fontSize: '14px',
      fontWeight: '600',
      cursor: isPremium ? 'pointer' : 'not-allowed',
      opacity: isPremium ? 1 : 0.5,
      width: '100%',
      marginTop: '10px',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    voiceBtnListening: {
      background: '#ff4757',
      borderColor: '#ff4757',
      color: '#fff',
    },
    nightReview: {
      marginTop: '12px',
      padding: '14px',
      borderRadius: '12px',
      background: currentTheme.primaryLight,
      color: currentTheme.primary,
      textAlign: 'center',
      fontSize: '14px',
      fontWeight: '600',
    },
  };

  // حالت هاور برای کارت‌ها
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <span>✨ بخش عمومی</span>
        {isPremium && <span style={styles.premiumBadge}>💎 پرمیوم</span>}
      </div>

      {/* چالش‌های روزانه */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: currentTheme.text, opacity: 0.6 }}>
            🎯 چالش‌های امروز
          </span>
          <button
            onClick={refreshChallenges}
            style={{
              background: 'none',
              border: 'none',
              color: currentTheme.primary,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            🔄 چالش جدید
          </button>
        </div>
        {challenges.map(challenge => {
          const isDone = doneChallenges.includes(challenge.id);
          return (
            <div
              key={challenge.id}
              style={{
                ...styles.challengeItem,
                ...(isDone ? styles.challengeDone : {}),
              }}
              onClick={() => toggleChallenge(challenge.id)}
            >
              <div
                style={{
                  ...styles.challengeCheck,
                  ...(isDone ? styles.challengeCheckDone : {}),
                }}
              >
                {isDone && '✓'}
              </div>
              <span style={{ fontSize: '14px', flex: 1 }}>{challenge.text}</span>
            </div>
          );
        })}
      </div>

      {/* دکمه پلن حرفه‌ای */}
      <button
        style={{
          ...styles.proPlanBtn,
          ...(showProPlan ? styles.proPlanActive : {}),
        }}
        onClick={() => {
          if (!isPremium) {
            alert('🔒 برای استفاده از پلن حرفه‌ای باید پریمیوم باشید!');
            return;
          }
          setShowProPlan(!showProPlan);
        }}
      >
        {showProPlan ? '📚 بستن پلن حرفه‌ای' : '🚀 پلن حرفه‌ای'}
        {!isPremium && ' 🔒'}
      </button>

      {/* محتوای پلن حرفه‌ای */}
      {showProPlan && isPremium && (
        <div style={styles.proPlanContent}>
          <div style={{ marginTop: '4px' }}>
            <div style={styles.shelfGrid}>
              {shelfTasks.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.5, padding: '16px' }}>
                  📭 هیچ کاری توی قفسه نیست
                </div>
              ) : (
                shelfTasks.map(task => (
                  <div
                    key={task.id}
                    style={{
                      ...styles.shelfCard,
                      ...(task.done ? styles.shelfCardDone : {}),
                      ...(hoveredCard === task.id ? styles.shelfCardHover : {}),
                    }}
                    onClick={() => toggleShelfTask(task.id)}
                    onMouseEnter={() => setHoveredCard(task.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <span>{task.text}</span>
                    <button
                      style={styles.shelfCardDelete}
                      onClick={(e) => { e.stopPropagation(); deleteShelfTask(task.id); }}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            <div style={styles.shelfAdd}>
              <input
                type="text"
                placeholder="کار جدید..."
                value={newShelfTask}
                onChange={(e) => setNewShelfTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addShelfTask()}
                style={styles.shelfInput}
              />
              <button style={styles.shelfAddBtn} onClick={addShelfTask}>➕</button>
            </div>
          </div>

          <button
            style={{
              ...styles.voiceBtn,
              ...(isListening ? styles.voiceBtnListening : {}),
            }}
            onClick={startVoiceAssistant}
            disabled={!isPremium || isListening}
          >
            {isListening ? '🎤 در حال گوش دادن...' : '🎤 اضافه کردن تسک با صدا'}
          </button>
        </div>
      )}

      {/* بررسی شبانه */}
      {showNightReview && (
        <div style={styles.nightReview}>
          🌙 شب بخیر! امروز {doneChallenges.length} تا از {challenges.length} چالش رو انجام دادی.
          {doneChallenges.length === challenges.length && ' 🎉 عالی بود!'}
        </div>
      )}
    </div>
  );
}
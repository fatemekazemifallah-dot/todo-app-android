import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const { currentTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      setError('لطفاً همه فیلدها را پر کنید');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('رمز عبور و تکرار آن مطابقت ندارند');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد');
      setIsLoading(false);
      return;
    }

    if (!gender) {
      setError('لطفاً جنسیت خود را انتخاب کنید');
      setIsLoading(false);
      return;
    }

    if (!purpose) {
      setError('لطفاً هدف از نصب را انتخاب کنید');
      setIsLoading(false);
      return;
    }

    const success = register({ name, email, password, gender, purpose });
    setIsLoading(false);

    if (success) {
      navigate('/');
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: `linear-gradient(135deg, ${currentTheme.primary}22, ${currentTheme.bg})`,
      padding: '20px',
    },
    card: {
      background: currentTheme.card,
      borderRadius: '32px',
      padding: '40px 32px',
      maxWidth: '440px',
      width: '100%',
      boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: currentTheme.text,
      textAlign: 'center',
      marginBottom: '4px',
    },
    subtitle: {
      color: currentTheme.text,
      opacity: 0.6,
      fontSize: '14px',
      textAlign: 'center',
      marginBottom: '28px',
    },
    input: {
      width: '100%',
      padding: '14px 18px',
      borderRadius: '14px',
      border: `2px solid ${currentTheme.border}`,
      fontSize: '15px',
      marginBottom: '12px',
      background: currentTheme.bg,
      color: currentTheme.text,
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'all 0.25s ease',
    },
    inputFocus: {
      borderColor: currentTheme.primary,
      boxShadow: `0 0 0 4px ${currentTheme.primary}20`,
    },
    select: {
      width: '100%',
      padding: '14px 18px',
      borderRadius: '14px',
      border: `2px solid ${currentTheme.border}`,
      fontSize: '15px',
      marginBottom: '12px',
      background: currentTheme.bg,
      color: currentTheme.text,
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'all 0.25s ease',
    },
    button: {
      width: '100%',
      padding: '14px',
      borderRadius: '14px',
      border: 'none',
      background: currentTheme.gradient,
      color: '#fff',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.25s ease',
      marginTop: '8px',
      boxShadow: `0 4px 16px ${currentTheme.primary}40`,
      opacity: isLoading ? 0.6 : 1,
    },
    buttonHover: {
      transform: 'scale(1.02)',
      boxShadow: `0 6px 24px ${currentTheme.primary}50`,
    },
    link: {
      display: 'block',
      textAlign: 'center',
      marginTop: '16px',
      color: currentTheme.primary,
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
    },
    error: {
      color: '#ff4757',
      fontSize: '13px',
      marginBottom: '12px',
      textAlign: 'right',
    },
  };

  const [focusName, setFocusName] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [focusConfirm, setFocusConfirm] = useState(false);
  const [isHover, setIsHover] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>✨ ثبت‌نام</h1>
        <p style={styles.subtitle}>ایجاد حساب کاربری جدید</p>

        {error && <div style={styles.error}>❌ {error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="نام کامل"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setFocusName(true)}
            onBlur={() => setFocusName(false)}
            style={{
              ...styles.input,
              ...(focusName ? styles.inputFocus : {}),
            }}
            required
          />
          <input
            type="email"
            placeholder="ایمیل"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusEmail(true)}
            onBlur={() => setFocusEmail(false)}
            style={{
              ...styles.input,
              ...(focusEmail ? styles.inputFocus : {}),
            }}
            required
          />
          <input
            type="password"
            placeholder="رمز عبور (حداقل ۶ کاراکتر)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusPassword(true)}
            onBlur={() => setFocusPassword(false)}
            style={{
              ...styles.input,
              ...(focusPassword ? styles.inputFocus : {}),
            }}
            required
          />
          <input
            type="password"
            placeholder="تکرار رمز عبور"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={() => setFocusConfirm(true)}
            onBlur={() => setFocusConfirm(false)}
            style={{
              ...styles.input,
              ...(focusConfirm ? styles.inputFocus : {}),
            }}
            required
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            style={styles.select}
            required
          >
            <option value="">جنسیت</option>
            <option value="male">👨 مرد</option>
            <option value="female">👩 زن</option>
            <option value="other">🌈 سایر</option>
          </select>
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            style={styles.select}
            required
          >
            <option value="">هدف از نصب</option>
            <option value="general">📝 استفاده عمومی</option>
            <option value="student">🎓 استفاده تحصیلی</option>
            <option value="business">💼 استفاده بیزینسی</option>
          </select>
          <button
            type="submit"
            style={{
              ...styles.button,
              ...(isHover ? styles.buttonHover : {}),
            }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            disabled={isLoading}
          >
            {isLoading ? '⏳ در حال ثبت‌نام...' : 'ثبت‌نام'}
          </button>
        </form>

        <Link to="/login" style={styles.link}>
          ← بازگشت به ورود
        </Link>
      </div>
    </div>
  );
}
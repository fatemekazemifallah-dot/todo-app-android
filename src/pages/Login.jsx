import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const { currentTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('لطفاً ایمیل و رمز عبور را وارد کنید');
      return;
    }

    const success = login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('ایمیل یا رمز عبور اشتباه است');
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
      position: 'relative',
      overflow: 'hidden',
    },
    circle: {
      position: 'absolute',
      borderRadius: '50%',
      background: `${currentTheme.primary}15`,
      width: '300px',
      height: '300px',
      top: '-100px',
      right: '-100px',
      zIndex: 0,
    },
    circle2: {
      position: 'absolute',
      borderRadius: '50%',
      background: `${currentTheme.primary}10`,
      width: '200px',
      height: '200px',
      bottom: '-50px',
      left: '-50px',
      zIndex: 0,
    },
    card: {
      background: currentTheme.card,
      borderRadius: '32px',
      padding: '48px 40px',
      maxWidth: '420px',
      width: '100%',
      boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
      textAlign: 'center',
      zIndex: 1,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
      transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
    },
    logoContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '8px',
    },
    logoIcon: {
      width: '56px',
      height: '56px',
      borderRadius: '16px',
      background: currentTheme.gradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
      color: '#fff',
      fontWeight: '700',
      boxShadow: `0 8px 24px ${currentTheme.primary}40`,
    },
    logoText: {
      fontSize: '28px',
      fontWeight: '700',
      color: currentTheme.text,
      letterSpacing: '-0.5px',
    },
    logoHighlight: {
      color: currentTheme.logoColor || currentTheme.primary,
    },
    subtitle: {
      color: currentTheme.text,
      opacity: 0.5,
      fontSize: '14px',
      marginBottom: '32px',
    },
    input: {
      width: '100%',
      padding: '14px 18px',
      borderRadius: '14px',
      border: `2px solid ${currentTheme.border}`,
      fontSize: '15px',
      marginBottom: '14px',
      background: currentTheme.bg,
      color: currentTheme.text,
      transition: 'all 0.25s ease',
      outline: 'none',
      boxSizing: 'border-box',
    },
    inputFocus: {
      borderColor: currentTheme.primary,
      boxShadow: `0 0 0 4px ${currentTheme.primary}20`,
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
      marginTop: '6px',
      boxShadow: `0 4px 16px ${currentTheme.primary}40`,
    },
    buttonHover: {
      transform: 'scale(1.02)',
      boxShadow: `0 6px 24px ${currentTheme.primary}50`,
    },
    link: {
      display: 'block',
      marginTop: '20px',
      color: currentTheme.primary,
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'opacity 0.2s',
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      margin: '24px 0 20px',
      color: currentTheme.text,
      opacity: 0.25,
      fontSize: '12px',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: currentTheme.border,
    },
    footerText: {
      fontSize: '12px',
      color: currentTheme.text,
      opacity: 0.3,
      marginTop: '24px',
    },
    error: {
      color: '#ff4757',
      fontSize: '13px',
      marginBottom: '12px',
      textAlign: 'right',
    },
  };

  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [isHover, setIsHover] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.circle} />
      <div style={styles.circle2} />

      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>✨</div>
          <div style={styles.logoText}>
            Task<span style={styles.logoHighlight}>Flow</span>
          </div>
        </div>

        <p style={styles.subtitle}>وارد حساب کاربری خود شوید</p>

        {error && <div style={styles.error}>❌ {error}</div>}

        <form onSubmit={handleSubmit}>
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
            placeholder="رمز عبور"
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

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(isHover ? styles.buttonHover : {}),
            }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            ورود
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine}></span>
          <span>یا</span>
          <span style={styles.dividerLine}></span>
        </div>

        <Link to="/register" style={styles.link}>
          ✨ حساب کاربری ندارید؟ ثبت‌نام کنید
        </Link>

        <div style={styles.footerText}>نسخه ۱.۰ • TaskFlow</div>
      </div>
    </div>
  );
}
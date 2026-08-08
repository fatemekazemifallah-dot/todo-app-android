import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { avatarSVGs } from '../utils/avatarLibrary';

export default function AvatarSelector({ currentAvatar, onSelect, onClose }) {
  const { currentTheme } = useTheme();
  const [selected, setSelected] = useState(currentAvatar || 0);

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    modal: {
      background: currentTheme.card,
      borderRadius: '24px',
      padding: '24px',
      maxWidth: '420px',
      width: '100%',
      maxHeight: '80vh',
      overflowY: 'auto',
      boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
    },
    title: {
      fontSize: '18px',
      fontWeight: '700',
      color: currentTheme.text,
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: currentTheme.text,
      opacity: 0.5,
    },
    previewContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '20px',
    },
    preview: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      overflow: 'hidden',
      boxShadow: `0 4px 16px rgba(0,0,0,0.1)`,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
    },
    avatarItem: {
      padding: '8px',
      borderRadius: '12px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: `2px solid transparent`,
    },
    avatarItemActive: {
      borderColor: currentTheme.primary,
      background: currentTheme.primaryLight,
      transform: 'scale(1.05)',
    },
    avatarWrapper: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      overflow: 'hidden',
      margin: '0 auto',
      background: currentTheme.bg,
    },
    confirmBtn: {
      marginTop: '16px',
      padding: '12px',
      borderRadius: '14px',
      border: 'none',
      background: currentTheme.gradient || currentTheme.primary,
      color: '#fff',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
    },
  };

  const renderSVG = (svg, size = 60) => (
    <div
      dangerouslySetInnerHTML={{ __html: svg }}
      style={{ width: size, height: size }}
    />
  );

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <span style={styles.title}>🎨 انتخاب آواتار</span>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.previewContainer}>
          <div style={styles.preview}>
            {renderSVG(avatarSVGs[selected], 80)}
          </div>
        </div>

        <div style={styles.grid}>
          {avatarSVGs.map((svg, index) => (
            <div
              key={index}
              style={{
                ...styles.avatarItem,
                ...(selected === index ? styles.avatarItemActive : {}),
              }}
              onClick={() => setSelected(index)}
            >
              <div style={styles.avatarWrapper}>
                {renderSVG(svg, 60)}
              </div>
            </div>
          ))}
        </div>

        <button style={styles.confirmBtn} onClick={() => {
          onSelect({ avatarIndex: selected });
          onClose();
        }}>
          ✅ انتخاب
        </button>
      </div>
    </div>
  );
}
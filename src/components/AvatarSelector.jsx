import { useState } from 'react';
import { defaultAvatars } from '../utils/avatars';
import { useTheme } from '../context/ThemeContext';
import AvatarIcon from './AvatarIcon';

export default function AvatarSelector({ currentAvatar, onSelect, onClose }) {
  const { currentTheme } = useTheme();
  const [selected, setSelected] = useState(currentAvatar || defaultAvatars[0]);

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modal: {
      background: currentTheme.card,
      borderRadius: '24px',
      padding: '24px',
      maxWidth: '480px',
      width: '90%',
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
      width: '88px',
      height: '88px',
      borderRadius: '50%',
      overflow: 'hidden',
      boxShadow: `0 4px 16px rgba(0,0,0,0.1)`,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '10px',
    },
    avatarItem: {
      padding: '8px',
      borderRadius: '14px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: `2px solid transparent`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
    },
    avatarItemActive: {
      borderColor: currentTheme.primary,
      background: currentTheme.primaryLight,
      transform: 'scale(1.05)',
    },
    avatarWrapper: {
      width: '52px',
      height: '52px',
      borderRadius: '50%',
      overflow: 'hidden',
    },
    avatarName: {
      fontSize: '9px',
      color: currentTheme.text,
      opacity: 0.4,
    },
    uploadSection: {
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: `1px solid ${currentTheme.border}`,
    },
    uploadBtn: {
      padding: '10px 16px',
      borderRadius: '12px',
      border: `2px dashed ${currentTheme.border}`,
      background: 'transparent',
      color: currentTheme.text,
      fontSize: '14px',
      cursor: 'pointer',
      width: '100%',
      transition: 'all 0.2s',
      textAlign: 'center',
    },
    uploadBtnHover: {
      borderColor: currentTheme.primary,
      background: currentTheme.primaryLight,
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

  const [hoverUpload, setHoverUpload] = useState(false);

  const handleSelect = (avatar) => {
    setSelected(avatar);
  };

  const handleConfirm = () => {
    onSelect({ avatar: selected, avatarType: 'sticker' });
    onClose();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onSelect({
          avatar: {
            id: Date.now(),
            name: 'عکس من',
            image: event.target.result,
          },
          avatarType: 'image',
        });
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <span style={styles.title}>🎨 انتخاب آواتار</span>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.previewContainer}>
          <div style={styles.preview}>
            {selected?.image ? (
              <img
                src={selected.image}
                alt="avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <AvatarIcon avatar={selected} size={88} />
            )}
          </div>
        </div>

        <div style={styles.grid}>
          {defaultAvatars.map((avatar) => {
            const isActive = selected?.id === avatar.id;
            return (
              <div
                key={avatar.id}
                style={{
                  ...styles.avatarItem,
                  ...(isActive ? styles.avatarItemActive : {}),
                }}
                onClick={() => handleSelect(avatar)}
              >
                <div style={styles.avatarWrapper}>
                  <AvatarIcon avatar={avatar} size={52} />
                </div>
                <span style={styles.avatarName}>{avatar.name}</span>
              </div>
            );
          })}
        </div>

        <div style={styles.uploadSection}>
          <label
            style={{
              ...styles.uploadBtn,
              ...(hoverUpload ? styles.uploadBtnHover : {}),
            }}
            onMouseEnter={() => setHoverUpload(true)}
            onMouseLeave={() => setHoverUpload(false)}
          >
            📷 آپلود عکس از گالری
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </label>
        </div>

        <button style={styles.confirmBtn} onClick={handleConfirm}>
          ✅ انتخاب
        </button>
      </div>
    </div>
  );
}
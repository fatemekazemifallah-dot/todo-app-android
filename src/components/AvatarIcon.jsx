import { useState, useEffect } from 'react';

export default function AvatarIcon({ name = 'کاربر', size = 60 }) {
  const [image, setImage] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // بارگذاری عکس ذخیره شده
  useEffect(() => {
    const savedImage = localStorage.getItem('user_avatar');
    if (savedImage) {
      setImage(savedImage);
    }
  }, []);

  // آپلود عکس
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target.result;
        setImage(imageData);
        localStorage.setItem('user_avatar', imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitial = () => {
    if (!name) return '👤';
    const persian = name.match(/[آ-ی]/g);
    if (persian) return persian[0];
    return name.charAt(0).toUpperCase();
  };

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    objectFit: 'cover',
  };

  const defaultStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    background: '#6C63FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: size * 0.4,
    fontWeight: 'bold',
    fontFamily: 'Vazir, sans-serif',
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* آواتار */}
      {image ? (
        <img src={image} alt="avatar" style={avatarStyle} />
      ) : (
        <div style={defaultStyle}>{getInitial()}</div>
      )}

      {/* دکمه دوربین - فقط وقتی هاور باشه یا عکس وجود نداشته باشه نشون بده */}
      {(isHovered || !image) && (
        <label
          style={{
            position: 'absolute',
            bottom: 2,
            right: 2,
            background: '#6C63FF',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '14px',
            cursor: 'pointer',
            border: '2px solid white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.2s',
          }}
        >
          📷
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
        </label>
      )}
    </div>
  );
}
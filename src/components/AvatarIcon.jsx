import { useState, useEffect } from 'react';
import Avatar from 'react-avatar';

export default function AvatarIcon({ name = 'کاربر', size = 60 }) {
  const [image, setImage] = useState(null);

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

  // اگه عکس وجود داشته باشه، نشون بده
  if (image) {
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <img
          src={image}
          alt="avatar"
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
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
      </div>
    );
  }

  // اگه عکس نباشه، حرف اول اسم
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Avatar
        name={name}
        size={size}
        round={true}
        style={{
          fontFamily: 'Vazir, sans-serif',
          fontWeight: 'bold',
        }}
      />
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
    </div>
  );
}
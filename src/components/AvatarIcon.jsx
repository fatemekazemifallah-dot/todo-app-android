import Avatar from 'react-avatar';

export default function AvatarIcon({ seed, size = 60, name = 'کاربر' }) {
  // اسم کاربر رو برای نمایش حروف اول استفاده کن
  const displayName = name || 'کاربر';
  
  return (
    <Avatar
      name={displayName}
      size={size}
      round={true}
      style={{
        fontFamily: 'Vazir, sans-serif',
        fontWeight: 'bold',
      }}
    />
  );
}
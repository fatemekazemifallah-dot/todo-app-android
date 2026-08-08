import { getAvatarByIndex } from '../utils/avatarLibrary';

export default function AvatarIcon({ seed, size = 60 }) {
  // استفاده از seed (مثلاً ایمیل یا نام کاربر) برای انتخاب آواتار
  const index = seed ? seed.length : 0;
  const svg = getAvatarByIndex(index);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: svg }}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        flexShrink: 0,
        background: '#f0f0f0',
      }}
    />
  );
}
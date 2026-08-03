import { createAvatar } from '@dicebear/core';
import { lorelei, thumbs } from '@dicebear/collection';

// مپ کردن نام استایل به کتابخونه‌ی مربوطه
const styleMap = {
  lorelei: lorelei,
  thumbs: thumbs,
};

export default function AvatarIcon({ avatar, size = 60 }) {
  if (!avatar || !avatar.style) {
    // fallback: یه آواتار پیش‌فرض با لورلی
    const fallback = createAvatar(lorelei, {
      seed: 'default',
      size: size,
    });
    return (
      <img
        src={fallback.toDataUri()}
        alt="آواتار"
        width={size}
        height={size}
        style={{ borderRadius: '50%' }}
      />
    );
  }

  // انتخاب استایل بر اساس `style` توی آبجکت آواتار
  const styleFn = styleMap[avatar.style] || lorelei;

  const avatarSvg = createAvatar(styleFn, {
    seed: avatar.seed || 'default',
    size: size,
  });

  return (
    <img
      src={avatarSvg.toDataUri()}
      alt={avatar.name || 'آواتار'}
      width={size}
      height={size}
      style={{ borderRadius: '50%' }}
    />
  );
}
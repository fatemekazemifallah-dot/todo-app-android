// ترکیبی از دو سبک Thumbs و Lorelei با تعداد بالا
export const defaultAvatars = [
  // ===== Lorelei (10 عدد) =====
  { id: 1, name: 'لورلی ۱', style: 'lorelei', seed: 'lorelei_1' },
  { id: 2, name: 'لورلی ۲', style: 'lorelei', seed: 'lorelei_2' },
  { id: 3, name: 'لورلی ۳', style: 'lorelei', seed: 'lorelei_3' },
  { id: 4, name: 'لورلی ۴', style: 'lorelei', seed: 'lorelei_4' },
  { id: 5, name: 'لورلی ۵', style: 'lorelei', seed: 'lorelei_5' },
  { id: 6, name: 'لورلی ۶', style: 'lorelei', seed: 'lorelei_6' },
  { id: 7, name: 'لورلی ۷', style: 'lorelei', seed: 'lorelei_7' },
  { id: 8, name: 'لورلی ۸', style: 'lorelei', seed: 'lorelei_8' },
  { id: 9, name: 'لورلی ۹', style: 'lorelei', seed: 'lorelei_9' },
  { id: 10, name: 'لورلی ۱۰', style: 'lorelei', seed: 'lorelei_10' },

  // ===== Thumbs (10 عدد) =====
  { id: 11, name: 'تامز ۱', style: 'thumbs', seed: 'thumbs_1' },
  { id: 12, name: 'تامز ۲', style: 'thumbs', seed: 'thumbs_2' },
  { id: 13, name: 'تامز ۳', style: 'thumbs', seed: 'thumbs_3' },
  { id: 14, name: 'تامز ۴', style: 'thumbs', seed: 'thumbs_4' },
  { id: 15, name: 'تامز ۵', style: 'thumbs', seed: 'thumbs_5' },
  { id: 16, name: 'تامز ۶', style: 'thumbs', seed: 'thumbs_6' },
  { id: 17, name: 'تامز ۷', style: 'thumbs', seed: 'thumbs_7' },
  { id: 18, name: 'تامز ۸', style: 'thumbs', seed: 'thumbs_8' },
  { id: 19, name: 'تامز ۹', style: 'thumbs', seed: 'thumbs_9' },
  { id: 20, name: 'تامز ۱۰', style: 'thumbs', seed: 'thumbs_10' },
];

export const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * defaultAvatars.length);
  return defaultAvatars[randomIndex];
};
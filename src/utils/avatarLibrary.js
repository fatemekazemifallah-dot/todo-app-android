// کتابخونه‌ی آواتارهای SVG ساده و بامزه
export const avatarSVGs = [
  // ۱ - صورتک خندان
  `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#FFD1DC" />
    <circle cx="35" cy="40" r="6" fill="#333" />
    <circle cx="65" cy="40" r="6" fill="#333" />
    <path d="M30 60 Q50 75 70 60" stroke="#333" stroke-width="4" fill="none" stroke-linecap="round" />
    <circle cx="35" cy="38" r="2" fill="white" />
    <circle cx="65" cy="38" r="2" fill="white" />
  </svg>`,
  
  // ۲ - با عینک
  `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#D4F1F9" />
    <circle cx="30" cy="40" r="12" fill="none" stroke="#333" stroke-width="3" />
    <circle cx="70" cy="40" r="12" fill="none" stroke="#333" stroke-width="3" />
    <rect x="42" y="38" width="16" height="4" fill="#333" />
    <path d="M35 60 Q50 70 65 60" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round" />
    <circle cx="30" cy="40" r="3" fill="#333" />
    <circle cx="70" cy="40" r="3" fill="#333" />
  </svg>`,
  
  // ۳ - با کلاه
  `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#E8D5B7" />
    <circle cx="35" cy="40" r="6" fill="#333" />
    <circle cx="65" cy="40" r="6" fill="#333" />
    <path d="M40 55 Q50 65 60 55" stroke="#333" stroke-width="4" fill="none" stroke-linecap="round" />
    <ellipse cx="50" cy="22" rx="25" ry="10" fill="#FF6B6B" />
    <ellipse cx="50" cy="20" rx="20" ry="8" fill="#FF8E8E" />
    <circle cx="50" cy="18" r="2" fill="#FF6B6B" />
  </svg>`,
  
  // ۴ - با موز
  `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#FFF5BA" />
    <circle cx="35" cy="40" r="6" fill="#333" />
    <circle cx="65" cy="40" r="6" fill="#333" />
    <ellipse cx="50" cy="58" rx="15" ry="8" fill="#FFB3BA" />
    <rect x="45" y="15" width="10" height="12" rx="5" fill="#6C63FF" />
    <circle cx="35" cy="38" r="2" fill="white" />
    <circle cx="65" cy="38" r="2" fill="white" />
    <path d="M30 50 Q50 45 70 50" stroke="#333" stroke-width="2" fill="none" />
  </svg>`,
  
  // ۵ - با قلب
  `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#FFD1DC" />
    <circle cx="35" cy="40" r="6" fill="#333" />
    <circle cx="65" cy="40" r="6" fill="#333" />
    <path d="M50 65 Q40 55 45 50 Q50 45 55 50 Q60 55 50 65" fill="#FF6B6B" />
    <circle cx="35" cy="38" r="2" fill="white" />
    <circle cx="65" cy="38" r="2" fill="white" />
    <path d="M30 30 L35 25" stroke="#333" stroke-width="2" />
    <path d="M70 30 L65 25" stroke="#333" stroke-width="2" />
  </svg>`,
  
  // ۶ - با ستاره
  `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#E8F0FE" />
    <circle cx="35" cy="40" r="6" fill="#333" />
    <circle cx="65" cy="40" r="6" fill="#333" />
    <path d="M50 55 Q45 60 50 65 Q55 60 50 55" fill="#F9A825" />
    <path d="M50 28 L53 38 L64 38 L56 44 L59 54 L50 48 L41 54 L44 44 L36 38 L47 38 Z" fill="#F9A825" opacity="0.8" />
    <circle cx="35" cy="38" r="2" fill="white" />
    <circle cx="65" cy="38" r="2" fill="white" />
  </svg>`,
];

// گرفتن آواتار بر اساس ایندکس
export const getAvatarByIndex = (index) => {
  const safeIndex = Math.abs(index) % avatarSVGs.length;
  return avatarSVGs[safeIndex];
};

// گرفتن آواتار تصادفی
export const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * avatarSVGs.length);
  return avatarSVGs[randomIndex];
};
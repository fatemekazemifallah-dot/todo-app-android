export default function AvatarIcon({ name = 'کاربر', size = 60 }) {
  const getInitial = () => {
    if (!name) return '👤';
    const persian = name.match(/[آ-ی]/g);
    if (persian) return persian[0];
    return name.charAt(0).toUpperCase();
  };

  return (
    <div
      style={{
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
      }}
    >
      {getInitial()}
    </div>
  );
}
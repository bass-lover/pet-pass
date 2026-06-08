import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');

  let user = null;

  try {
    user = userData ? JSON.parse(userData) : null;
  } catch (error) {
    user = null;
  }

  const isLoggedIn = !!token;
  const isAdmin = isLoggedIn && user?.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentCheckin');

    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <div style={styles.logoArea}>
        <Link to="/" style={styles.logo}>
          Pet Pass
        </Link>
      </div>

      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>
          홈
        </Link>

        {isLoggedIn && (
          <>
            <Link to="/checkin" style={styles.link}>
              체크인
            </Link>

            <Link to="/checkout" style={styles.link}>
              체크아웃
            </Link>

            <Link to="/mypage" style={styles.link}>
              마이페이지
            </Link>
          </>
        )}

        <Link to="/reviews" style={styles.link}>
          후기
        </Link>

        <Link to="/guide" style={styles.link}>
          이용 안내
        </Link>

        {isAdmin && (
          <Link to="/admin" style={styles.adminLink}>
            관리자
          </Link>
        )}

        {!isLoggedIn && (
          <>
            <Link to="/login" style={styles.link}>
              로그인
            </Link>

            <Link to="/signup" style={styles.signupLink}>
              회원가입
            </Link>
          </>
        )}

        {isLoggedIn && (
          <button type="button" onClick={handleLogout} style={styles.logoutButton}>
            로그아웃
          </button>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    height: '64px',
    padding: '0 24px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2563eb',
    textDecoration: 'none',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  link: {
    color: '#374151',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
  },
  signupLink: {
    color: '#ffffff',
    backgroundColor: '#2563eb',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    padding: '8px 12px',
    borderRadius: '8px',
  },
  adminLink: {
    color: '#ffffff',
    backgroundColor: '#111827',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    padding: '8px 12px',
    borderRadius: '8px',
  },
  logoutButton: {
    border: 'none',
    backgroundColor: '#e5e7eb',
    color: '#111827',
    fontSize: '14px',
    fontWeight: '600',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default Header;
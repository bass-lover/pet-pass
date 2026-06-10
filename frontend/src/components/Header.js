import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

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
    localStorage.removeItem('redirectAfterLogin');

    navigate('/login');
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="logo-area">
          <Link to="/" className="logo-link">
            Pet Pass
          </Link>
        </div>

        <nav className="main-nav">
          <Link to="/" className="nav-link">
            홈
          </Link>

          {isLoggedIn && !isAdmin && (
            <>
              <Link to="/checkin" className="nav-link">
                체크인
              </Link>

              <Link to="/checkout" className="nav-link">
                체크아웃
              </Link>
            </>
          )}

          <Link to="/reviews" className="nav-link">
            후기
          </Link>

          <Link to="/guide" className="nav-link">
            이용 안내
          </Link>

          {isLoggedIn && (
            <Link to="/mypage" className="nav-link">
              마이페이지
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" className="admin-nav-link">
              관리자
            </Link>
          )}

          {!isLoggedIn && (
            <>
              <Link to="/login" className="nav-link">
                로그인
              </Link>

              <Link to="/signup" className="signup-nav-link">
                회원가입
              </Link>
            </>
          )}

          {isLoggedIn && (
            <button type="button" onClick={handleLogout} className="logout-button">
              로그아웃
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
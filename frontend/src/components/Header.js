import { Link } from 'react-router-dom';

function Header() {
  return (
    <header style={{ padding: '16px', borderBottom: '1px solid #ddd' }}>
      <nav style={{ display: 'flex', gap: '12px' }}>
        <Link to="/">홈</Link>
        <Link to="/login">로그인</Link>
        <Link to="/signup">회원가입</Link>
        <Link to="/checkin">체크인</Link>
        <Link to="/mypage">마이페이지</Link>
        <Link to="/admin">관리자</Link>
      </nav>
    </header>
  );
}

export default Header;

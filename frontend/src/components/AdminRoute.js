import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  if (!token) {
    alert('로그인이 필요한 페이지입니다.');
    return <Navigate to="/login" replace />;
  }

  if (!user || user.role !== 'admin') {
    alert('관리자만 접근할 수 있는 페이지입니다.');
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;

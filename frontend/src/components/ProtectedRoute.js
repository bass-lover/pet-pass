import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    const redirectPath = `${location.pathname}${location.search}`;
    localStorage.setItem('redirectAfterLogin', redirectPath);

    alert('로그인이 필요한 페이지입니다.');
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/App.css';

import Header from './components/Header';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CheckinPage from './pages/CheckinPage';
import CheckoutPage from './pages/CheckoutPage';
import MyPage from './pages/MyPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/checkin" element={<CheckinPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

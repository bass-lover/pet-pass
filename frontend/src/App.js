import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CheckinPage from './pages/CheckinPage';
import MyPage from './pages/MyPage';
import AdminPage from './pages/AdminPage';
import DogRegisterPage from './pages/DogRegisterPage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/checkin" element={<CheckinPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/dogs/new" element={<DogRegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

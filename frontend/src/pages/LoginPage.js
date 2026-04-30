import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    phone: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (!/^\d{10,11}$/.test(form.phone)) {
      newErrors.phone = '전화번호는 숫자만 10~11자리로 입력해주세요.';
    }

    if (!form.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (form.password.length < 4) {
      newErrors.password = '비밀번호는 4자 이상 입력해주세요.';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    console.log('로그인 요청 데이터:', form);
    alert('로그인 검증 통과');
    navigate('/');
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">로그인</h1>
        <p className="auth-description">
          전화번호와 비밀번호를 입력하여 로그인합니다.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="phone">전화번호</label>
            <input
              id="phone"
              name="phone"
              type="text"
              placeholder="숫자만 입력"
              value={form.phone}
              onChange={handleChange}
            />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호 입력"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <button type="submit" className="auth-button">
            로그인
          </button>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;

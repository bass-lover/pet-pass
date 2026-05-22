import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import '../styles/Auth.css';

function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    passwordConfirm: '',
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

    if (!form.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

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

    if (!form.passwordConfirm.trim()) {
      newErrors.passwordConfirm = '비밀번호 확인을 입력해주세요.';
    } else if (form.password !== form.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      await apiRequest('/api/user/register', {
        method: 'POST',
        body: JSON.stringify({
          username: form.phone,
          password: form.password,
        }),
      });

      localStorage.setItem('tempName', form.name);

      alert('회원가입 성공. 로그인 후 반려견 정보를 등록해주세요.');
      navigate('/login');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">회원가입</h1>
        <p className="auth-description">
          보호자 정보를 입력하여 회원가입합니다. 반려견 정보는 로그인 후 등록할 수 있습니다.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="이름 입력"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

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

          <div className="form-group">
            <label htmlFor="passwordConfirm">비밀번호 확인</label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              placeholder="비밀번호 다시 입력"
              value={form.passwordConfirm}
              onChange={handleChange}
            />
            {errors.passwordConfirm && (
              <p className="error-text">{errors.passwordConfirm}</p>
            )}
          </div>

          <button type="submit" className="auth-button">
            회원가입
          </button>
        </form>
      </div>
    </main>
  );
}

export default SignupPage;

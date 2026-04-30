import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    dogName: '',
    dogAge: '',
    registrationNumber: '',
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

    if (!form.dogName.trim()) {
      newErrors.dogName = '반려견 이름을 입력해주세요.';
    }

    if (!form.dogAge.trim()) {
      newErrors.dogAge = '반려견 나이를 입력해주세요.';
    } else if (isNaN(form.dogAge) || Number(form.dogAge) < 0) {
      newErrors.dogAge = '반려견 나이는 0 이상의 숫자로 입력해주세요.';
    }

    if (!form.registrationNumber.trim()) {
      newErrors.registrationNumber = '등록번호를 입력해주세요.';
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

    const requestData = {
      name: form.name,
      phone: form.phone,
      password: form.password,
      dogName: form.dogName,
      dogAge: Number(form.dogAge),
      registrationNumber: form.registrationNumber,
    };

    console.log('회원가입 요청 데이터:', requestData);
    alert('회원가입 검증 통과');
    navigate('/login');
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">회원가입</h1>
        <p className="auth-description">
          보호자 정보와 반려견 정보를 입력하여 회원가입합니다.
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

          <div className="form-group">
            <label htmlFor="dogName">반려견 이름</label>
            <input
              id="dogName"
              name="dogName"
              type="text"
              placeholder="반려견 이름 입력"
              value={form.dogName}
              onChange={handleChange}
            />
            {errors.dogName && <p className="error-text">{errors.dogName}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="dogAge">반려견 나이</label>
            <input
              id="dogAge"
              name="dogAge"
              type="number"
              placeholder="반려견 나이 입력"
              value={form.dogAge}
              onChange={handleChange}
            />
            {errors.dogAge && <p className="error-text">{errors.dogAge}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="registrationNumber">등록번호</label>
            <input
              id="registrationNumber"
              name="registrationNumber"
              type="text"
              placeholder="등록번호 입력"
              value={form.registrationNumber}
              onChange={handleChange}
            />
            {errors.registrationNumber && (
              <p className="error-text">{errors.registrationNumber}</p>
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

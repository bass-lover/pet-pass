import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MyPage.css';

function DogRegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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

    if (!form.dogName.trim()) {
      newErrors.dogName = '반려견 이름을 입력해주세요.';
    }

    if (!form.dogAge.trim()) {
      newErrors.dogAge = '반려견 나이를 입력해주세요.';
    } else if (isNaN(form.dogAge) || Number(form.dogAge) < 0) {
      newErrors.dogAge = '반려견 나이는 0 이상의 숫자로 입력해주세요.';
    }

    if (!form.registrationNumber.trim()) {
      newErrors.registrationNumber = '동물등록번호를 입력해주세요.';
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

    const dogData = {
      dogName: form.dogName,
      dogAge: Number(form.dogAge),
      registrationNumber: form.registrationNumber,
    };

    console.log('반려견 등록 데이터:', dogData);

    alert('반려견 등록 검증 통과');
    navigate('/mypage');
  };

  return (
    <main className="mypage-container">
      <section className="mypage-card">
        <h1>반려견 등록</h1>
        <p className="page-description">
          체크인에 사용할 반려견 정보를 등록합니다.
        </p>

        <form className="dog-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="dogName">반려견 이름</label>
            <input
              id="dogName"
              name="dogName"
              type="text"
              placeholder="예: 초코"
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
              placeholder="예: 3"
              value={form.dogAge}
              onChange={handleChange}
            />
            {errors.dogAge && <p className="error-text">{errors.dogAge}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="registrationNumber">동물등록번호</label>
            <input
              id="registrationNumber"
              name="registrationNumber"
              type="text"
              placeholder="동물등록번호 입력"
              value={form.registrationNumber}
              onChange={handleChange}
            />
            {errors.registrationNumber && (
              <p className="error-text">{errors.registrationNumber}</p>
            )}
          </div>

          <button type="submit" className="primary-button">
            등록하기
          </button>
        </form>
      </section>
    </main>
  );
}

export default DogRegisterPage;

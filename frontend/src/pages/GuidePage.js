import { useState } from 'react';
import '../styles/Feature.css';

function GuidePage() {
  const [dogAge, setDogAge] = useState('');
  const [season, setSeason] = useState('summer');

  const getAgeGuide = () => {
    const age = Number(dogAge);

    if (dogAge === '') {
      return '반려견 나이를 입력하면 연령대별 참고 안내가 표시됩니다.';
    }

    if (age < 1) {
      return '어린 반려견은 장시간 활동을 피하고, 공원 이용 전 예방접종 여부를 보호자가 확인하는 것이 좋습니다.';
    }

    if (age >= 1 && age < 7) {
      return '성견은 활동량이 많을 수 있으므로 충분한 물과 휴식 시간을 준비하는 것이 좋습니다.';
    }

    return '노령견은 무리한 운동을 피하고, 짧은 산책과 충분한 휴식을 중심으로 이용하는 것이 좋습니다.';
  };

  const getSeasonGuide = () => {
    if (season === 'spring') {
      return '봄철에는 꽃가루와 진드기 등에 주의하고, 산책 후 반려견의 털과 피부 상태를 확인하는 것이 좋습니다.';
    }

    if (season === 'summer') {
      return '여름철에는 더위와 탈수에 주의해야 하며, 한낮의 장시간 야외 활동은 피하는 것이 좋습니다.';
    }

    if (season === 'fall') {
      return '가을철에는 활동하기 좋은 시기이지만, 일교차가 크므로 체온 변화에 주의하는 것이 좋습니다.';
    }

    return '겨울철에는 추위와 미끄러운 바닥에 주의하고, 짧은 산책과 보온에 신경 쓰는 것이 좋습니다.';
  };

  return (
    <main className="feature-container">
      <section className="feature-card">
        <h1>반려견 이용 안내</h1>
        <p className="feature-description">
          반려견 나이와 계절을 기준으로 공원 이용 전 참고할 수 있는 일반 안내를 제공합니다.
        </p>

        <div className="guide-notice">
          본 기능은 의료적 진단이나 처방이 아닌 일반적인 참고 안내입니다.
          정확한 건강 상태와 예방접종 일정은 동물병원 상담을 통해 확인해야 합니다.
        </div>

        <div className="feature-form">
          <div className="form-group">
            <label htmlFor="dogAge">반려견 나이</label>
            <input
              id="dogAge"
              type="number"
              placeholder="예: 3"
              value={dogAge}
              onChange={(e) => setDogAge(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="season">계절 선택</label>
            <select
              id="season"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
            >
              <option value="spring">봄</option>
              <option value="summer">여름</option>
              <option value="fall">가을</option>
              <option value="winter">겨울</option>
            </select>
          </div>
        </div>
      </section>

      <section className="guide-grid">
        <div className="guide-card">
          <h2>연령 기반 안내</h2>
          <p>{getAgeGuide()}</p>
        </div>

        <div className="guide-card">
          <h2>계절 기반 안내</h2>
          <p>{getSeasonGuide()}</p>
        </div>

        <div className="guide-card">
          <h2>공원 이용 전 체크리스트</h2>
          <ul>
            <li>목줄 또는 하네스 착용 여부 확인</li>
            <li>배변봉투 준비 여부 확인</li>
            <li>반려견 등록번호 및 기본 정보 확인</li>
            <li>공격성 또는 이상 행동이 있는 경우 이용 자제</li>
            <li>더운 날에는 물과 휴식 시간 확보</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

export default GuidePage;

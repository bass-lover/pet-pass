import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function HomePage() {
  const navigate = useNavigate();

  const [currentCheckin, setCurrentCheckin] = useState(null);

  const parks = [
    {
      id: 1,
      name: '반려동물 공원 A',
      location: '인천광역시',
      baseUserCount: 5,
      baseDogCount: 7,
    },
    {
      id: 2,
      name: '반려동물 공원 B',
      location: '인천광역시',
      baseUserCount: 2,
      baseDogCount: 3,
    },
  ];

  useEffect(() => {
    const savedCheckin = localStorage.getItem('currentCheckin');

    if (savedCheckin) {
      setCurrentCheckin(JSON.parse(savedCheckin));
    }
  }, []);

  const getParkStatus = (park) => {
    const isCurrentPark =
      currentCheckin && currentCheckin.parkId === park.id;

    return {
      userCount: park.baseUserCount + (isCurrentPark ? 1 : 0),
      dogCount: park.baseDogCount + (isCurrentPark ? 1 : 0),
    };
  };

  const getCongestionText = (dogCount) => {
    if (dogCount >= 10) return '혼잡';
    if (dogCount >= 5) return '보통';
    return '여유';
  };

  return (
    <main className="dashboard-container">
      <section className="hero-section">
        <h1>반려동물 공원 스마트 체크인</h1>
        <p>
          공원 이용 현황을 확인하고, 간편하게 체크인·체크아웃을 진행할 수 있습니다.
        </p>

        <div className="hero-buttons">
          <button className="primary-button" onClick={() => navigate('/checkin')}>
            체크인하기
          </button>
          <button className="secondary-button" onClick={() => navigate('/checkout')}>
            체크아웃하기
          </button>
        </div>
      </section>

      {currentCheckin && (
        <section className="current-status-card">
          <h2>현재 이용 중</h2>
          <p>공원: {currentCheckin.parkName}</p>
          <p>반려견: {currentCheckin.dogName}</p>
          <p>입장 시간: {currentCheckin.checkinTime}</p>
        </section>
      )}

      <section className="dashboard-section">
        <h2>공원 이용 현황</h2>
        <p className="section-description">
          일반 사용자는 개인정보 없이 공원별 요약 현황만 확인할 수 있습니다.
        </p>

        <div className="park-grid">
          {parks.map((park) => {
            const status = getParkStatus(park);
            const congestion = getCongestionText(status.dogCount);

            return (
              <div className="park-card" key={park.id}>
                <div className="park-card-header">
                  <h3>{park.name}</h3>
                  <span className={`badge badge-${congestion}`}>
                    {congestion}
                  </span>
                </div>

                <p className="park-location">{park.location}</p>

                <div className="status-list">
                  <div>
                    <span>현재 이용자 수</span>
                    <strong>{status.userCount}명</strong>
                  </div>
                  <div>
                    <span>현재 반려견 수</span>
                    <strong>{status.dogCount}마리</strong>
                  </div>
                </div>

                <button
                  className="small-button"
                  onClick={() => navigate('/checkin')}
                >
                  이 공원 체크인
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default HomePage;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function HomePage() {
  const navigate = useNavigate();

  const [currentCheckin, setCurrentCheckin] = useState(null);
  const [selectedParkId, setSelectedParkId] = useState(1);

  const parks = [
    {
      id: 1,
      name: '원적산공원 반려동물놀이터',
      location: '인천 부평구 청천동 원적산공원 일원',
      mapQuery: '원적산공원 반려동물놀이터',
      baseUserCount: 1,
      baseDogCount: 1,
    },
    {
      id: 2,
      name: '인천대공원 반려동물 놀이터',
      location: '인천 남동구 무네미로 236 인천대공원 내',
      mapQuery: '인천대공원 반려동물 놀이터',
      baseUserCount: 2,
      baseDogCount: 2,
    },
    {
      id: 3,
      name: '송도달빛축제공원 송도 도그파크',
      location: '인천 연수구 송도동 달빛축제공원 내',
      mapQuery: '송도 도그파크',
      baseUserCount: 2,
      baseDogCount: 2,
    },
    {
      id: 4,
      name: '혜윰공원 반려견놀이터',
      location: '인천 연수구 송도교육로 110',
      mapQuery: '혜윰공원 반려견놀이터',
      baseUserCount: 1,
      baseDogCount: 1,
    },
    {
      id: 5,
      name: '계양꽃마루 반려견쉼터',
      location: '인천 계양구 봉오대로 855 계양꽃마루 내',
      mapQuery: '계양꽃마루 반려견쉼터',
      baseUserCount: 1,
      baseDogCount: 1,
    },
  ];

  useEffect(() => {
    const savedCheckin = localStorage.getItem('currentCheckin');

    if (savedCheckin) {
      setCurrentCheckin(JSON.parse(savedCheckin));
    }
  }, []);

  const getParkStatus = (park) => {
    const isCurrentPark = currentCheckin && currentCheckin.parkId === park.id;

    return {
      userCount: park.baseUserCount + (isCurrentPark ? 1 : 0),
      dogCount: park.baseDogCount + (isCurrentPark ? 1 : 0),
    };
  };

  const getCongestionText = (dogCount) => {
    if (dogCount >= 6) return '혼잡';
    if (dogCount >= 3) return '보통';
    return '여유';
  };

  const selectedPark =
    parks.find((park) => park.id === Number(selectedParkId)) || parks[0];

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    selectedPark.mapQuery
  )}&output=embed`;

  return (
    <main className="dashboard-container">
      <section className="hero-section">
        <h1>반려동물 공원 스마트 체크인</h1>
        <p>
          실제 인천 지역 반려견 놀이터를 기준으로 공원 이용 현황을 확인하고,
          간편하게 체크인·체크아웃을 진행할 수 있습니다.
        </p>

        <div className="hero-buttons">
          <button className="primary-button" onClick={() => navigate('/checkin')}>
            체크인하기
          </button>
          <button
            className="secondary-button"
            onClick={() => navigate('/checkout')}
          >
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
        <h2>공원 위치 지도</h2>
        <p className="section-description">
          공원을 선택하면 해당 공원 위치를 지도에서 확인할 수 있습니다.
        </p>

        <div className="form-group">
          <label htmlFor="mapPark">지도에서 확인할 공원</label>
          <select
            id="mapPark"
            value={selectedParkId}
            onChange={(e) => setSelectedParkId(Number(e.target.value))}
          >
            {parks.map((park) => (
              <option key={park.id} value={park.id}>
                {park.name}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            marginTop: '20px',
            marginBottom: '12px',
            padding: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            backgroundColor: '#f9fafb',
          }}
        >
          <h3 style={{ margin: '0 0 8px 0' }}>{selectedPark.name}</h3>
          <p style={{ margin: 0, color: '#666', lineHeight: '1.5' }}>
            {selectedPark.location}
          </p>
        </div>

        <div
          style={{
            width: '100%',
            height: '360px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
          }}
        >
          <iframe
            title={`${selectedPark.name} 지도`}
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          />
        </div>
      </section>

      <section className="dashboard-section">
        <h2>공원 이용 현황</h2>
        <p className="section-description">
          이용자 수와 반려견 수는 시연을 위한 가상 데이터입니다.
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

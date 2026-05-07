import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Checkin.css';

function CheckinPage() {
  const navigate = useNavigate();

  const parks = [
    { id: 1, name: '반려동물 공원 A', currentUserCount: 5, currentDogCount: 7 },
    { id: 2, name: '반려동물 공원 B', currentUserCount: 2, currentDogCount: 3 },
  ];

  const dogs = [
    { id: 1, name: '초코', age: 3 },
    { id: 2, name: '보리', age: 5 },
  ];

  const [selectedParkId, setSelectedParkId] = useState('');
  const [selectedDogId, setSelectedDogId] = useState('');
  const [currentCheckin, setCurrentCheckin] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedCheckin = localStorage.getItem('currentCheckin');

    if (savedCheckin) {
      setCurrentCheckin(JSON.parse(savedCheckin));
    }
  }, []);

  const handleCheckin = () => {
    setError('');

    if (currentCheckin) {
      setError('이미 체크인된 상태입니다. 먼저 체크아웃을 진행해주세요.');
      return;
    }

    if (!selectedParkId) {
      setError('공원을 선택해주세요.');
      return;
    }

    if (!selectedDogId) {
      setError('반려견을 선택해주세요.');
      return;
    }

    const selectedPark = parks.find((park) => park.id === Number(selectedParkId));
    const selectedDog = dogs.find((dog) => dog.id === Number(selectedDogId));

    const checkinData = {
      checkinId: Date.now(),
      parkId: selectedPark.id,
      parkName: selectedPark.name,
      dogId: selectedDog.id,
      dogName: selectedDog.name,
      checkinTime: new Date().toLocaleString(),
      status: 'IN',
    };

    localStorage.setItem('currentCheckin', JSON.stringify(checkinData));
    setCurrentCheckin(checkinData);

    alert('체크인이 완료되었습니다.');
    navigate('/checkout');
  };

  return (
    <main className="checkin-container">
      <h1>체크인</h1>
      <p className="page-description">
        이용할 공원과 반려견을 선택한 뒤 체크인합니다.
      </p>

      {currentCheckin && (
        <section className="status-card active">
          <h2>현재 입장 중</h2>
          <p>공원: {currentCheckin.parkName}</p>
          <p>반려견: {currentCheckin.dogName}</p>
          <p>입장 시간: {currentCheckin.checkinTime}</p>
          <button
            className="secondary-button"
            onClick={() => navigate('/checkout')}
          >
            체크아웃 화면으로 이동
          </button>
        </section>
      )}

      <section className="checkin-card">
        <h2>공원 선택</h2>

        <div className="form-group">
          <label htmlFor="park">공원</label>
          <select
            id="park"
            value={selectedParkId}
            onChange={(e) => setSelectedParkId(e.target.value)}
          >
            <option value="">공원을 선택하세요</option>
            {parks.map((park) => (
              <option key={park.id} value={park.id}>
                {park.name}
              </option>
            ))}
          </select>
        </div>

        {selectedParkId && (
          <div className="park-status-box">
            {parks
              .filter((park) => park.id === Number(selectedParkId))
              .map((park) => (
                <div key={park.id}>
                  <p>현재 이용자 수: {park.currentUserCount}명</p>
                  <p>현재 반려견 수: {park.currentDogCount}마리</p>
                </div>
              ))}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="dog">반려견</label>
          <select
            id="dog"
            value={selectedDogId}
            onChange={(e) => setSelectedDogId(e.target.value)}
          >
            <option value="">반려견을 선택하세요</option>
            {dogs.map((dog) => (
              <option key={dog.id} value={dog.id}>
                {dog.name} / {dog.age}살
              </option>
            ))}
          </select>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="primary-button" onClick={handleCheckin}>
          체크인하기
        </button>
      </section>
    </main>
  );
}

export default CheckinPage;

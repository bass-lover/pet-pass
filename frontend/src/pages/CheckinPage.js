import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import '../styles/Checkin.css';

function CheckinPage() {
  const navigate = useNavigate();

  const parks = [
    {
      id: 1,
      name: '원적산공원 반려동물놀이터',
      currentUserCount: 1,
      currentDogCount: 1,
    },
    {
      id: 2,
      name: '인천대공원 반려동물 놀이터',
      currentUserCount: 2,
      currentDogCount: 2,
    },
    {
      id: 3,
      name: '송도달빛축제공원 송도 도그파크',
      currentUserCount: 2,
      currentDogCount: 2,
    },
    {
      id: 4,
      name: '혜윰공원 반려견놀이터',
      currentUserCount: 1,
      currentDogCount: 1,
    },
    {
      id: 5,
      name: '계양꽃마루 반려견쉼터',
      currentUserCount: 1,
      currentDogCount: 1,
    },
  ];

  const [dogs, setDogs] = useState([]);
  const [selectedParkId, setSelectedParkId] = useState('');
  const [selectedDogId, setSelectedDogId] = useState('');
  const [currentCheckin, setCurrentCheckin] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedCheckin = localStorage.getItem('currentCheckin');

    if (savedCheckin) {
      setCurrentCheckin(JSON.parse(savedCheckin));
    }

    const fetchDogs = async () => {
      try {
        const data = await apiRequest('/api/pet/my');
        setDogs(data.data || []);
      } catch (error) {
        console.error(error);
        alert('반려견 목록을 불러오지 못했습니다. 로그인 후 이용해주세요.');
        navigate('/login');
      }
    };

    fetchDogs();
  }, [navigate]);

  const handleCheckin = async () => {
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

    try {
      const selectedPark = parks.find(
        (park) => park.id === Number(selectedParkId)
      );

      const selectedDog = dogs.find((dog) => dog.id === Number(selectedDogId));

      const data = await apiRequest('/api/checkin/checkin', {
        method: 'POST',
        body: JSON.stringify({
          petId: Number(selectedDogId),
          parkName: selectedPark.name,
        }),
      });

      const checkinData = {
        checkinId: data.checkinId,
        parkId: selectedPark.id,
        parkName: selectedPark.name,
        dogId: selectedDog.id,
        dogName: selectedDog.pet_name,
        checkinTime: new Date().toLocaleString(),
        status: 'IN',
      };

      localStorage.setItem('currentCheckin', JSON.stringify(checkinData));
      setCurrentCheckin(checkinData);

      navigate('/checkout');
    } catch (error) {
      alert(error.message);
    }
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
                  <p style={{ color: '#666', fontSize: '13px' }}>
                    ※ 현재 이용 현황은 시연용 가상 데이터입니다.
                  </p>
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
                {dog.pet_name} / {dog.age || '-'}살
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
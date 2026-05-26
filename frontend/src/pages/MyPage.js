import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import '../styles/MyPage.css';

function MyPage() {
  const navigate = useNavigate();

  const [dogs, setDogs] = useState([]);
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);

  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    const fetchMyPageData = async () => {
      try {
        const dogData = await apiRequest('/api/pet/my');
        setDogs(dogData.data || []);

        const historyData = await apiRequest('/api/checkin/my-records');
        setHistories(historyData.data?.records || []);
      } catch (error) {
        console.error('마이페이지 데이터 조회 실패:', error);
        alert('마이페이지 정보를 불러오지 못했습니다. 다시 로그인해주세요.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPageData();
  }, [navigate]);

  const formatDateTime = (dateValue) => {
    if (!dateValue) return '-';

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    return date.toLocaleString();
  };

  const getStatusText = (status) => {
    if (status === 'checked_in') {
      return '입장 중';
    }

    if (status === 'checked_out') {
      return '퇴장 완료';
    }

    return status || '-';
  };

  if (loading) {
    return (
      <main className="mypage-container">
        <section className="mypage-card">
          <h1>마이페이지</h1>
          <p className="page-description">정보를 불러오는 중입니다.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="mypage-container">
      <h1>마이페이지</h1>
      <p className="page-description">
        내 정보, 반려견 정보, 이용 기록을 확인할 수 있습니다.
      </p>

      <section className="mypage-card">
        <h2>내 정보</h2>

        <div className="info-row">
          <span>전화번호</span>
          <strong>{user?.username || '-'}</strong>
        </div>

        <div className="info-row">
          <span>권한</span>
          <strong>{user?.role === 'admin' ? '관리자' : '일반 사용자'}</strong>
        </div>
      </section>

      <section className="mypage-card">
        <div className="section-header">
          <h2>반려견 정보</h2>
          <button
            className="small-button"
            onClick={() => navigate('/dogs/new')}
          >
            반려견 등록
          </button>
        </div>

        {dogs.length === 0 ? (
          <p className="empty-text">등록된 반려견이 없습니다.</p>
        ) : (
          <div className="dog-list">
            {dogs.map((dog) => (
              <div className="dog-item" key={dog.id}>
                <h3>{dog.pet_name}</h3>
                <p>나이: {dog.age || '-'}살</p>
                <p>종류: {dog.type || 'dog'}</p>
                <p>등록번호: {dog.description || '-'}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mypage-card">
        <h2>이용 기록</h2>

        {histories.length === 0 ? (
          <p className="empty-text">이용 기록이 없습니다.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>반려견</th>
                <th>입장 시간</th>
                <th>퇴장 시간</th>
                <th>상태</th>
              </tr>
            </thead>

            <tbody>
              {histories.map((history) => (
                <tr key={history.checkin_id}>
                  <td>{history.pet_name || '-'}</td>
                  <td>{formatDateTime(history.checkin_time)}</td>
                  <td>{formatDateTime(history.checkout_time)}</td>
                  <td>{getStatusText(history.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

export default MyPage;

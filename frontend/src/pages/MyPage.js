import { useNavigate } from 'react-router-dom';
import '../styles/MyPage.css';

function MyPage() {
  const navigate = useNavigate();

  const user = {
    name: '홍길동',
    phone: '010-1234-5678',
  };

  const dogs = [
    {
      id: 1,
      dogName: '초코',
      dogAge: 3,
      registrationNumber: 'ABC****1234',
    },
  ];

  const histories = [
    {
      id: 1,
      parkName: '반려동물 공원 A',
      checkinTime: '2026-04-10 14:00',
      checkoutTime: '2026-04-10 15:20',
      status: '퇴장 완료',
    },
  ];

  return (
    <main className="mypage-container">
      <h1>마이페이지</h1>
      <p className="page-description">
        내 정보, 반려견 정보, 이용 기록을 확인할 수 있습니다.
      </p>

      <section className="mypage-card">
        <h2>내 정보</h2>
        <div className="info-row">
          <span>이름</span>
          <strong>{user.name}</strong>
        </div>
        <div className="info-row">
          <span>전화번호</span>
          <strong>{user.phone}</strong>
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
                <h3>{dog.dogName}</h3>
                <p>나이: {dog.dogAge}살</p>
                <p>등록번호: {dog.registrationNumber}</p>
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
                <th>공원명</th>
                <th>입장 시간</th>
                <th>퇴장 시간</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {histories.map((history) => (
                <tr key={history.id}>
                  <td>{history.parkName}</td>
                  <td>{history.checkinTime}</td>
                  <td>{history.checkoutTime}</td>
                  <td>{history.status}</td>
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

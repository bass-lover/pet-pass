import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Checkin.css';

function CheckoutPage() {
  const navigate = useNavigate();
  const [currentCheckin, setCurrentCheckin] = useState(null);

  useEffect(() => {
    const savedCheckin = localStorage.getItem('currentCheckin');

    if (savedCheckin) {
      setCurrentCheckin(JSON.parse(savedCheckin));
    }
  }, []);

  const handleCheckout = () => {
    if (!currentCheckin) {
      alert('현재 체크인된 기록이 없습니다.');
      return;
    }

    const checkoutData = {
      ...currentCheckin,
      checkoutTime: new Date().toLocaleString(),
      status: 'OUT',
    };

    const savedHistories = localStorage.getItem('checkinHistories');
    const histories = savedHistories ? JSON.parse(savedHistories) : [];

    localStorage.setItem(
      'checkinHistories',
      JSON.stringify([checkoutData, ...histories])
    );

    localStorage.removeItem('currentCheckin');
    setCurrentCheckin(null);

    alert('체크아웃이 완료되었습니다.');
    navigate('/mypage');
  };

  return (
    <main className="checkin-container">
      <h1>체크아웃</h1>
      <p className="page-description">
        현재 입장 중인 기록을 확인하고 체크아웃합니다.
      </p>

      {currentCheckin ? (
        <section className="checkin-card">
          <h2>현재 이용 상태</h2>

          <div className="info-row">
            <span>상태</span>
            <strong>입장 중</strong>
          </div>

          <div className="info-row">
            <span>공원</span>
            <strong>{currentCheckin.parkName}</strong>
          </div>

          <div className="info-row">
            <span>반려견</span>
            <strong>{currentCheckin.dogName}</strong>
          </div>

          <div className="info-row">
            <span>입장 시간</span>
            <strong>{currentCheckin.checkinTime}</strong>
          </div>

          <button className="primary-button" onClick={handleCheckout}>
            체크아웃하기
          </button>
        </section>
      ) : (
        <section className="status-card">
          <h2>현재 체크인 기록이 없습니다</h2>
          <p>공원을 이용하려면 먼저 체크인을 진행해주세요.</p>
          <button
            className="secondary-button"
            onClick={() => navigate('/checkin')}
          >
            체크인하러 가기
          </button>
        </section>
      )}
    </main>
  );
}

export default CheckoutPage;

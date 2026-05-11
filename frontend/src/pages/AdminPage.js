import { useEffect, useState } from 'react';
import '../styles/Dashboard.css';

function AdminPage() {
  const [currentCheckin, setCurrentCheckin] = useState(null);
  const [histories, setHistories] = useState([]);

  useEffect(() => {
    const savedCheckin = localStorage.getItem('currentCheckin');
    const savedHistories = localStorage.getItem('checkinHistories');

    if (savedCheckin) {
      setCurrentCheckin(JSON.parse(savedCheckin));
    }

    if (savedHistories) {
      setHistories(JSON.parse(savedHistories));
    }
  }, []);

  const dummyRecords = [
    {
      id: 1,
      name: '홍길동',
      phone: '010-1234-5678',
      dogName: '초코',
      registrationNumber: 'ABC****1234',
      parkName: '반려동물 공원 A',
      checkinTime: '2026-04-30 10:00',
      checkoutTime: '2026-04-30 11:20',
      status: 'OUT',
    },
    {
      id: 2,
      name: '김철수',
      phone: '010-2222-3333',
      dogName: '보리',
      registrationNumber: 'DEF****5678',
      parkName: '반려동물 공원 B',
      checkinTime: '2026-04-30 13:10',
      checkoutTime: '-',
      status: 'IN',
    },
  ];

  const currentRecord = currentCheckin
    ? [
        {
          id: currentCheckin.checkinId,
          name: '현재 사용자',
          phone: '010-0000-0000',
          dogName: currentCheckin.dogName,
          registrationNumber: 'TEST****0000',
          parkName: currentCheckin.parkName,
          checkinTime: currentCheckin.checkinTime,
          checkoutTime: '-',
          status: 'IN',
        },
      ]
    : [];

  const historyRecords = histories.map((history) => ({
    id: history.checkinId,
    name: '현재 사용자',
    phone: '010-0000-0000',
    dogName: history.dogName,
    registrationNumber: 'TEST****0000',
    parkName: history.parkName,
    checkinTime: history.checkinTime,
    checkoutTime: history.checkoutTime || '-',
    status: history.status,
  }));

  const records = [...currentRecord, ...historyRecords, ...dummyRecords];

  const currentInCount = records.filter((record) => record.status === 'IN').length;
  const totalDogCount = currentInCount;

  const handleCsvDownload = () => {
    const header = [
      '이름',
      '전화번호',
      '반려견 이름',
      '등록번호',
      '공원명',
      '입장 시간',
      '퇴장 시간',
      '상태',
    ];

    const rows = records.map((record) => [
      record.name,
      record.phone,
      record.dogName,
      record.registrationNumber,
      record.parkName,
      record.checkinTime,
      record.checkoutTime,
      record.status,
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'checkin_records.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="dashboard-container">
      <section className="admin-header">
        <div>
          <h1>관리자 페이지</h1>
          <p>
            공원 이용 현황과 출입 기록을 조회하고 CSV 파일로 다운로드할 수 있습니다.
          </p>
        </div>

        <button className="primary-button" onClick={handleCsvDownload}>
          CSV 다운로드
        </button>
      </section>

      <section className="summary-grid">
        <div className="summary-card">
          <span>현재 이용자 수</span>
          <strong>{currentInCount}명</strong>
        </div>

        <div className="summary-card">
          <span>현재 반려견 수</span>
          <strong>{totalDogCount}마리</strong>
        </div>

        <div className="summary-card">
          <span>전체 출입 기록</span>
          <strong>{records.length}건</strong>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>출입 기록 조회</h2>
        <p className="section-description">
          관리자만 보호자 정보, 등록번호 등 상세 출입 정보를 확인할 수 있습니다.
        </p>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>전화번호</th>
                <th>반려견</th>
                <th>등록번호</th>
                <th>공원명</th>
                <th>입장 시간</th>
                <th>퇴장 시간</th>
                <th>상태</th>
              </tr>
            </thead>

            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{record.name}</td>
                  <td>{record.phone}</td>
                  <td>{record.dogName}</td>
                  <td>{record.registrationNumber}</td>
                  <td>{record.parkName}</td>
                  <td>{record.checkinTime}</td>
                  <td>{record.checkoutTime}</td>
                  <td>
                    <span
                      className={
                        record.status === 'IN'
                          ? 'status-label status-in'
                          : 'status-label status-out'
                      }
                    >
                      {record.status === 'IN' ? '입장 중' : '퇴장 완료'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default AdminPage;

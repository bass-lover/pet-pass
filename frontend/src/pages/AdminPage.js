import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import '../styles/Dashboard.css';

function AdminPage() {
  const [records, setRecords] = useState([]);
  const [currentPetCount, setCurrentPetCount] = useState(0);
  const [apiStatus, setApiStatus] = useState('loading');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const currentData = await apiRequest('/api/admin/current-pets');
        const recordData = await apiRequest('/api/admin/check-records');

        const currentCount =
          currentData?.data?.current_pet_count ??
          currentData?.current_pet_count ??
          0;

        const apiRecords =
          recordData?.data?.records ??
          recordData?.records ??
          [];

        const mappedRecords = apiRecords.map((record) => ({
          id: record.checkin_id,
          name: record.username || '사용자',
          phone: record.username || '-',
          dogName: record.pet_name || '-',
          registrationNumber: record.registration_number || '-',
          parkName: '반려동물 공원',
          checkinTime: formatDateTime(record.checkin_time),
          checkoutTime: record.checkout_time ? formatDateTime(record.checkout_time) : '-',
          status: record.status === 'checked_in' ? 'IN' : 'OUT',
        }));

        setCurrentPetCount(currentCount);
        setRecords(mappedRecords);
        setApiStatus('success');
      } catch (error) {
        console.error('관리자 API 호출 실패:', error);
        setApiStatus('error');
        alert('관리자 데이터를 불러오지 못했습니다.');
      }
    };

    fetchAdminData();
  }, []);

  const formatDateTime = (dateValue) => {
    if (!dateValue) return '-';

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    return date.toLocaleString();
  };

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
      record.status === 'IN' ? '입장 중' : '퇴장 완료',
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((value) => `"${value}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'checkin_records.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  const currentInCount = records.filter((record) => record.status === 'IN').length;
  const totalDogCount = currentPetCount || currentInCount;

  return (
    <main className="dashboard-container">
      <section className="admin-header">
        <div>
          <h1>관리자 페이지</h1>
          <p>
            공원 이용 현황과 출입 기록을 조회하고 CSV 파일로 다운로드할 수 있습니다.
          </p>

          {apiStatus === 'loading' && (
            <p className="section-description">관리자 데이터를 불러오는 중입니다.</p>
          )}

          {apiStatus === 'success' && (
            <p className="section-description">백엔드 API 데이터가 연결된 상태입니다.</p>
          )}

          {apiStatus === 'error' && (
            <p className="section-description">
              관리자 데이터를 불러오지 못했습니다. 백엔드 서버와 DB 상태를 확인해주세요.
            </p>
          )}
        </div>

        <button
          className="primary-button"
          onClick={handleCsvDownload}
          disabled={records.length === 0}
        >
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
              {records.length === 0 ? (
                <tr>
                  <td colSpan="8">출입 기록이 없습니다.</td>
                </tr>
              ) : (
                records.map((record) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default AdminPage;

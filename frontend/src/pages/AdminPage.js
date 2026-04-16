function AdminPage() {
  return (
    <main style={{ padding: '24px' }}>
      <h1>관리자 페이지</h1>
      <p>출입 기록과 현재 이용 현황을 관리합니다.</p>

      <section style={{ marginBottom: '24px' }}>
        <h2>현재 이용 현황</h2>
        <p>현재 이용자 수: 5명</p>
        <p>현재 반려견 수: 7마리</p>
      </section>

      <section>
        <h2>출입 기록</h2>
        <p>홍길동 / 초코 / 10:00 체크인</p>
        <p>김철수 / 보리 / 10:15 체크인</p>
      </section>
    </main>
  );
}

export default AdminPage;

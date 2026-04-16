function MyPage() {
  return (
    <main style={{ padding: '24px' }}>
      <h1>마이페이지</h1>
      <p>내 정보와 반려견 정보, 이용 기록을 확인합니다.</p>

      <section style={{ marginBottom: '24px' }}>
        <h2>내 정보</h2>
        <p>이름: 홍길동</p>
        <p>전화번호: 010-1234-5678</p>
      </section>

      <section style={{ marginBottom: '24px' }}>
        <h2>반려견 정보</h2>
        <p>이름: 초코</p>
        <p>나이: 3살</p>
      </section>

      <section>
        <h2>이용 기록</h2>
        <p>2026-04-10 / 공원 1 / 체크인 완료</p>
      </section>
    </main>
  );
}

export default MyPage;

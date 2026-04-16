function CheckoutPage() {
  return (
    <main style={{ padding: '24px' }}>
      <h1>체크아웃 화면</h1>
      <p>현재 입장 중인 기록을 확인하고 체크아웃합니다.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px' }}>
        <p>현재 상태: 입장 중</p>
        <p>공원: 공원 1</p>
        <p>반려견: 초코</p>
        <button>체크아웃</button>
      </div>
    </main>
  );
}

export default CheckoutPage;

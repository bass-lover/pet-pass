function CheckinPage() {
  return (
    <main style={{ padding: '24px' }}>
      <h1>체크인 화면</h1>
      <p>입장할 공원과 반려견 정보를 선택하여 체크인합니다.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px' }}>
        <select>
          <option>공원 선택</option>
          <option>공원 1</option>
          <option>공원 2</option>
        </select>

        <select>
          <option>반려견 선택</option>
          <option>초코</option>
          <option>보리</option>
        </select>

        <button>체크인</button>
      </div>
    </main>
  );
}

export default CheckinPage;

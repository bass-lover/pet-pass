function LoginPage() {
  return (
    <main style={{ padding: '24px' }}>
      <h1>로그인 화면</h1>
      <p>전화번호와 비밀번호를 입력하여 로그인합니다.</p>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px' }}>
        <input type="text" placeholder="전화번호" />
        <input type="password" placeholder="비밀번호" />
        <button type="submit">로그인</button>
      </form>
    </main>
  );
}

export default LoginPage;

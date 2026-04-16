function SignupPage() {
  return (
    <main style={{ padding: '24px' }}>
      <h1>회원가입 화면</h1>
      <p>보호자 정보와 반려견 정보를 입력하여 회원가입합니다.</p>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px' }}>
        <input type="text" placeholder="이름" />
        <input type="text" placeholder="전화번호" />
        <input type="password" placeholder="비밀번호" />
        <input type="text" placeholder="반려견 이름" />
        <input type="number" placeholder="반려견 나이" />
        <input type="text" placeholder="등록번호" />
        <button type="submit">회원가입</button>
      </form>
    </main>
  );
}

export default SignupPage;

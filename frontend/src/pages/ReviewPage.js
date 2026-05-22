import { useEffect, useState } from 'react';
import '../styles/Feature.css';

function ReviewPage() {
  const parks = [
    { id: 1, name: '반려동물 공원 A' },
    { id: 2, name: '반려동물 공원 B' },
  ];

  const [parkId, setParkId] = useState('');
  const [content, setContent] = useState('');
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedReviews = localStorage.getItem('reviews');

    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!parkId) {
      setError('공원을 선택해주세요.');
      return;
    }

    if (!content.trim()) {
      setError('후기 내용을 입력해주세요.');
      return;
    }

    if (content.length > 100) {
      setError('후기는 100자 이내로 작성해주세요.');
      return;
    }

    const selectedPark = parks.find((park) => park.id === Number(parkId));

    const newReview = {
      id: Date.now(),
      parkId: selectedPark.id,
      parkName: selectedPark.name,
      content,
      createdAt: new Date().toLocaleString(),
    };

    const updatedReviews = [newReview, ...reviews];

    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));

    setContent('');
    alert('후기가 등록되었습니다.');
  };

  const filteredReviews = parkId
    ? reviews.filter((review) => review.parkId === Number(parkId))
    : reviews;

  return (
    <main className="feature-container">
      <section className="feature-card">
        <h1>한줄 후기</h1>
        <p className="feature-description">
          공원 이용 후 간단한 후기를 남길 수 있습니다.
        </p>

        <form className="feature-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="park">공원 선택</label>
            <select
              id="park"
              value={parkId}
              onChange={(e) => setParkId(e.target.value)}
            >
              <option value="">공원을 선택하세요</option>
              {parks.map((park) => (
                <option key={park.id} value={park.id}>
                  {park.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="content">후기 내용</label>
            <textarea
              id="content"
              placeholder="예: 공원이 깨끗하고 이용하기 좋았습니다."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={100}
            />
            <span className="text-count">{content.length}/100</span>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="primary-button">
            후기 등록
          </button>
        </form>
      </section>

      <section className="feature-card">
        <h2>후기 목록</h2>

        {filteredReviews.length === 0 ? (
          <p className="empty-text">등록된 후기가 없습니다.</p>
        ) : (
          <div className="review-list">
            {filteredReviews.map((review) => (
              <div className="review-item" key={review.id}>
                <div className="review-header">
                  <strong>{review.parkName}</strong>
                  <span>{review.createdAt}</span>
                </div>
                <p>{review.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default ReviewPage;

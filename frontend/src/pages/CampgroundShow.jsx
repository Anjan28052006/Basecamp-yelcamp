import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import client, { apiErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import ShowMap from '../components/ShowMap';

export default function CampgroundShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [campground, setCampground] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [reviewBody, setReviewBody] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewError, setReviewError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    client.get(`/campground/${id}`)
      .then(({ data }) => {
        setCampground(data.campground);
        setApiKey(data.maptilerApiKey);
        setActiveImg(0);
      })
      .catch(err => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const isAuthor = user && campground?.author && (campground.author._id === user._id);

  const handleDelete = async () => {
    if (!window.confirm('Delete this campground? This cannot be undone.')) return;
    try {
      await client.delete(`/campground/${id}/delete`);
      navigate('/campgrounds');
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    if (reviewRating === 0) {
      setReviewError('Please select a star rating.');
      return;
    }
    setSubmitting(true);
    try {
      await client.post(`/campground/${id}/reviews`, {
        review: { rating: reviewRating, body: reviewBody },
      });
      setReviewBody('');
      setReviewRating(0);
      load();
    } catch (err) {
      setReviewError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await client.delete(`/campground/${id}/reviews/${reviewId}`);
      load();
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  };

  if (loading) return <div className="center-loading"><div className="spinner" /></div>;
  if (error && !campground) return <div className="container"><div className="alert alert-error">{error}</div></div>;
  if (!campground) return null;

  const images = campground.image || [];

  return (
    <div className="container show-container">
      <div className="page-head">
        <div className="eyebrow">{campground.location}</div>
        <h2>{campground.titel}</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="show-layout">
        <div>
          <div className="gallery">
            <div className="gallery-main">
              {images[activeImg] && <img src={images[activeImg].url} alt={campground.titel} />}
            </div>
            {images.length > 1 && (
              <div className="gallery-thumbs">
                {images.map((img, i) => (
                  <img
                    key={img.filename || i}
                    src={img.url}
                    alt=""
                    className={i === activeImg ? 'active' : ''}
                    onClick={() => setActiveImg(i)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="meta-row">
            <span className="meta-item">$ {campground.price} / night</span>
            <span className="meta-item">★ {(campground.reviews?.length
              ? (campground.reviews.reduce((s, r) => s + r.rating, 0) / campground.reviews.length).toFixed(1)
              : '—')} avg ({campground.reviews?.length || 0} reviews)</span>
          </div>

          <p className="show-description">{campground.description}</p>

          <section className="reviews-section">
            <h3>Reviews</h3>

            {user ? (
              <form className="form-card review-form" onSubmit={handleReviewSubmit}>
                {reviewError && <div className="alert alert-error">{reviewError}</div>}
                <div className="field">
                  <label>Your rating</label>
                  <div className="star-input" onMouseLeave={() => setHoverRating(0)}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <span
                        key={n}
                        className={n <= (hoverRating || reviewRating) ? 'filled' : ''}
                        onMouseEnter={() => setHoverRating(n)}
                        onClick={() => setReviewRating(n)}
                      >★</span>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="reviewBody">Your review</label>
                  <textarea
                    id="reviewBody"
                    value={reviewBody}
                    onChange={e => setReviewBody(e.target.value)}
                    required
                    placeholder="What was the site actually like?"
                  />
                </div>
                <button className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Posting…' : 'Post review'}
                </button>
              </form>
            ) : (
              <div className="state-block review-login-prompt">
                <Link to="/login" className="btn btn-outline">Log in to leave a review</Link>
              </div>
            )}

            {(!campground.reviews || campground.reviews.length === 0) ? (
              <p style={{ color: 'var(--color-ink-soft)' }}>No reviews yet — be the first to report back.</p>
            ) : (
              campground.reviews.map(r => (
                <div className="review-card" key={r._id}>
                  <div className="avatar">{(r.author?.username || '?').slice(0, 2).toUpperCase()}</div>
                  <div className="review-body">
                    <div className="review-meta">
                      <span className="review-author">{r.author?.username || 'Unknown'}</span>
                      <StarRating value={r.rating} />
                    </div>
                    <p style={{ margin: 0 }}>{r.body}</p>
                    {user && r.author?._id === user._id && (
                      <button className="btn btn-ghost" style={{ paddingLeft: 0, color: 'var(--color-danger)' }} onClick={() => handleDeleteReview(r._id)}>
                        Delete review
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </section>
        </div>

        <div>
          <div className="side-card">
            <div className="eyebrow">Logged by</div>
            <div className="author-row">
              <div className="avatar">{(campground.author?.username || '?').slice(0, 2).toUpperCase()}</div>
              <span>{campground.author?.username || 'Unknown'}</span>
            </div>
            {isAuthor && (
              <div className="actions-row" style={{ marginTop: 18 }}>
                <Link to={`/campgrounds/${id}/edit`} className="btn btn-outline">Edit</Link>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            )}
          </div>

          <div className="side-card">
            <div className="eyebrow">Location</div>
            {apiKey && campground.geometry?.coordinates ? (
              <ShowMap campground={campground} apiKey={apiKey} />
            ) : (
              <p style={{ color: 'var(--color-ink-soft)', fontSize: '0.85rem' }}>Map unavailable.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

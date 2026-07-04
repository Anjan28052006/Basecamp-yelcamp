import { Link } from 'react-router-dom';

export default function CampgroundCard({ campground }) {
  const image = campground.image?.[0]?.url;
  return (
    <Link to={`/campgrounds/${campground._id}`} className="card">
      <div className="card-media">
        {image && <img src={image} alt={campground.titel} loading="lazy" />}
        {campground.reviews?.length > 0 && (
          <span className="card-stamp">{campground.reviews.length} review{campground.reviews.length === 1 ? '' : 's'}</span>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-title">{campground.titel}</h3>
        <div className="card-loc">📍 {campground.location}</div>
        <p className="card-desc">{campground.description}</p>
        <div className="card-foot">
          <span className="card-price">${campground.price} <small>/ night</small></span>
        </div>
      </div>
    </Link>
  );
}

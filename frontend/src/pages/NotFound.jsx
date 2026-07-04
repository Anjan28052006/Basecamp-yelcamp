import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container" style={{ paddingTop: 80 }}>
      <div className="state-block">
        <div className="eyebrow">Off the map</div>
        <h3>This trail doesn't exist</h3>
        <p>The page you're looking for isn't logged anywhere.</p>
        <Link to="/" className="btn btn-outline">Back to basecamp</Link>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client, { apiErrorMessage } from '../api/client';
import CampgroundCard from '../components/CampgroundCard';
import ClusterMap from '../components/ClusterMap';
import { useAuth } from '../context/AuthContext';

export default function CampgroundsIndex() {
  const [camp, setCamp] = useState([]);
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    client.get('/campground')
      .then(({ data }) => {
        setCamp(data.camp || []);
        setApiKey(data.maptilerApiKey);
      })
      .catch(err => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <div className="page-head section-head">
        <div>
          <div className="eyebrow">The map</div>
          <h2>All logged campgrounds</h2>
        </div>
        {user && <Link to="/campgrounds/new" className="btn btn-primary">Log a new site</Link>}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && camp.length > 0 && apiKey && (
        <div style={{ marginBottom: 40 }}>
          <ClusterMap campgrounds={camp} apiKey={apiKey} />
        </div>
      )}

      {loading ? (
        <div className="center-loading"><div className="spinner" /></div>
      ) : camp.length === 0 ? (
        <div className="state-block">
          <h3>No campgrounds logged yet</h3>
          <p>Be the first to add one to the map.</p>
        </div>
      ) : (
        <div className="grid">
          {camp.map(c => <CampgroundCard key={c._id} campground={c} />)}
        </div>
      )}
    </div>
  );
}

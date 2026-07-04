import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client, { apiErrorMessage } from '../api/client';

export default function CampgroundForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = mode === 'edit';

  const [titel, setTitel] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deleteImages, setDeleteImages] = useState([]);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    client.get(`/campground/${id}/edit`)
      .then(({ data }) => {
        const c = data.campground;
        setTitel(c.titel || '');
        setLocation(c.location || '');
        setPrice(c.price ?? '');
        setDescription(c.description || '');
        setExistingImages(c.image || []);
      })
      .catch(err => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const toggleDeleteImage = (filename) => {
    setDeleteImages(prev =>
      prev.includes(filename) ? prev.filter(f => f !== filename) : [...prev, filename]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const formData = new FormData();
    formData.append('campground[titel]', titel);
    formData.append('campground[location]', location);
    formData.append('campground[price]', price);
    formData.append('campground[description]', description);
    Array.from(files).forEach(f => formData.append('image', f));
    deleteImages.forEach(f => formData.append('deleteImages[]', f));

    try {
      if (isEdit) {
        const { data } = await client.put(`/campground/${id}`, formData);
        navigate(`/campgrounds/${data.campground._id}`);
      } else {
        const { data } = await client.post('/campground', formData);
        navigate(`/campgrounds/${data.campground._id}`);
      }
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="center-loading"><div className="spinner" /></div>;

  return (
    <div className="container" style={{ paddingTop: 44, paddingBottom: 60 }}>
      <div className="eyebrow">{isEdit ? 'Update the record' : 'New entry'}</div>
      <h2 style={{ marginBottom: 26 }}>{isEdit ? 'Edit campground' : 'Log a new campground'}</h2>

      <form className="form-card" onSubmit={handleSubmit}>
        {error && <div className="alert alert-error">{error}</div>}

        <div className="field">
          <label htmlFor="titel">Name</label>
          <input id="titel" type="text" value={titel} onChange={e => setTitel(e.target.value)} required />
        </div>

        <div className="field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            required
            placeholder="City, State or a full address"
          />
          <div className="hint">We'll geocode this automatically to place it on the map.</div>
        </div>

        <div className="field">
          <label htmlFor="price">Price per night (USD)</label>
          <input id="price" type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
        </div>

        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required />
        </div>

        {isEdit && existingImages.length > 0 && (
          <div className="field">
            <label>Current photos</label>
            <div className="existing-images">
              {existingImages.map(img => (
                <div className={`existing-image ${deleteImages.includes(img.filename) ? 'marked' : ''}`} key={img.filename}>
                  <img src={img.url} alt="" />
                  <button type="button" className="rm" onClick={() => toggleDeleteImage(img.filename)} title="Remove">×</button>
                </div>
              ))}
            </div>
            <div className="hint">Click × to mark a photo for removal.</div>
          </div>
        )}

        <div className="field">
          <label htmlFor="images">{isEdit ? 'Add more photos' : 'Photos'}</label>
          <label htmlFor="images" className="file-drop">
            {files.length > 0 ? `${files.length} file(s) selected` : 'Click to choose images'}
          </label>
          <input
            id="images"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            multiple
            style={{ display: 'none' }}
            onChange={e => setFiles(e.target.files)}
          />
        </div>

        <button className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create campground'}
        </button>
      </form>
    </div>
  );
}

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import CampgroundsIndex from './pages/CampgroundsIndex';
import CampgroundShow from './pages/CampgroundShow';
import CampgroundForm from './pages/CampgroundForm';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campgrounds" element={<CampgroundsIndex />} />
          <Route
            path="/campgrounds/new"
            element={<ProtectedRoute><CampgroundForm mode="new" /></ProtectedRoute>}
          />
          <Route path="/campgrounds/:id" element={<CampgroundShow />} />
          <Route
            path="/campgrounds/:id/edit"
            element={<ProtectedRoute><CampgroundForm mode="edit" /></ProtectedRoute>}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 10 }}>
          <span>Basecamp — a campground log.</span>
          <span>Built on the trail, for the trail.</span>
        </div>
      </footer>
    </>
  );
}

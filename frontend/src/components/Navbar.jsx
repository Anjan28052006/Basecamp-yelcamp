import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CompassMark() {
  return (
    <svg className="mark" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.6" />
      <path d="M18.5 9.5L13 13L9.5 18.5L15 15L18.5 9.5Z" fill="currentColor" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          <CompassMark />
          Basecamp
        </Link>
        <nav className="nav-links">
          <Link to="/campgrounds">Explore</Link>
          {user && <Link to="/campgrounds/new">Post a site</Link>}
          {user ? (
            <>
              <span className="nav-user">@{user.username}</span>
              <button onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

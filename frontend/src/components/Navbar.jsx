import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CompassMark() {
  return (
    <svg className="mark" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.6" />
      <path d="M18.5 9.5L13 13L9.5 18.5L15 15L18.5 9.5Z" fill="currentColor" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/');
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          <CompassMark />
          <span>Basecamp</span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls="nav-menu"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>

        {isOpen && (
          <div
            className="nav-backdrop"
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}

        <nav id="nav-menu" className={`nav-links ${isOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <Link to="/campgrounds" onClick={closeMenu}>Explore</Link>
          {user && <Link to="/campgrounds/new" onClick={closeMenu}>Post a site</Link>}
          {user ? (
            <div className="nav-auth-group">
              <span className="nav-user">@{user.username}</span>
              <button type="button" onClick={handleLogout}>Log out</button>
            </div>
          ) : (
            <div className="nav-auth-group">
              <Link to="/login" onClick={closeMenu}>Log in</Link>
              <Link to="/register" className="nav-signup-link" onClick={closeMenu}>Sign up</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

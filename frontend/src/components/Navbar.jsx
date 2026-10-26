import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">StudySync Nova</Link>
      {token ? (
        <div className="nav-right">
          <span>{user?.name}</span>
          <button className="btn btn-outline" onClick={handleLogout}>Log out</button>
        </div>
      ) : (
        <div className="nav-right">
          <Link to="/login">Log in</Link>
          <Link to="/register">Sign up</Link>
        </div>
      )}
    </header>
  );
}
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async (retryCount = 0) => {
      try {
        const res = await fetch(`http://localhost:5000/profile`, {
          credentials: 'include'
        });
        if (res.status === 401) {
          setUser(null);
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch user');
        const userData = await res.json();
        setUser(userData);
      } catch (err) {
        console.error(err);
        // Optional: retry logic
        if (retryCount < 3) {
          setTimeout(() => fetchCurrentUser(retryCount + 1), 1000 * (retryCount + 1));
        }
      }
    };
    fetchCurrentUser();
  }, []);

  const handleLogout = () => {
    fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          setUser(null);
          navigate("/login");
        } else {
          throw new Error("Logout failed");
        }
      })
      .catch((err) => {
        console.error("Logout error:", err);
      });
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Press Start</Link>
      </div>
      <ul>
        {/* Always show Home link */}
        <li><Link to="/">Home</Link></li>
        
        {user ? (
          /* Links shown only if user is logged in */
          <>
            <li><Link to="/stock">Stock</Link></li>
            <li><Link to="/repair-list">Repair List</Link></li>
            <li><Link to="/repair">Repair</Link></li>
            <li><Link to="/clients">Clients</Link></li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          /* Links shown only if user is NOT logged in */
          <>
            <li>
  <            Link to="/login">
            <button className="nav-btn">Login</button>
              </Link>
            </li>

          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;


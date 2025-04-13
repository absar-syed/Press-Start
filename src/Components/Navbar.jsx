// The navigation bar shows logo + nav links depending on login state
// Icons are added using Font Awesome React
// When logged in: show full menu with logout
// When not logged in: show login only

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

//  font awesome imports from https://docs.fontawesome.com/v5/web/use-with/react & https://youtu.be/ReatjIrst8w 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faHouse, faDoorClosed, faDoorOpen, faWarehouse, faScrewdriverWrench, faToolbox, faUserTie } from '@fortawesome/free-solid-svg-icons';


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
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"/>
      </head>

      <div className="logo">
        <Link to="/">
        <span className="logo-text"><FontAwesomeIcon icon= {faGamepad} size="lg" /> Press Start</span></Link>
      </div>
      <ul>
        {/* Always show Home link */}
        <li><Link to="/"><FontAwesomeIcon icon= {faHouse} size="lg" /> Home</Link></li>
        
        {user ? (
          /* Links shown only if user is logged in */
          <>
            <li><Link to="/stock"><FontAwesomeIcon icon={faWarehouse} size="lg"/> Stock</Link></li>
            <li><Link to="/repair-list"><FontAwesomeIcon icon={faToolbox} size="lg"/> Repair List</Link></li>
            <li><Link to="/repair"><FontAwesomeIcon icon={faScrewdriverWrench} size="lg" /> Repair</Link></li>
            <li><Link to="/clients"><FontAwesomeIcon icon={faUserTie} size="lg" /> Clients</Link></li>
            <li>
              <button onClick={handleLogout}><FontAwesomeIcon icon={faDoorOpen} size="lg" /> Logout</button>
            </li>
          </>
        ) : (
          /* Links shown only if user is NOT logged in */
          <>
            <li>
  <            Link to="/login">
            <button className="nav-btn"><FontAwesomeIcon icon={faDoorClosed} size="lg" /> Login</button>
              </Link>
            </li>

          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;

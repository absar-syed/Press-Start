import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo"><Link to="/">Press Start</Link></div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/stock">Stock</Link></li>
        <li><Link to="/trade-in">Trade-In</Link></li>
        <li><Link to="/repair">Repair</Link></li>
        <li><Link to="/clients">Clients</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;

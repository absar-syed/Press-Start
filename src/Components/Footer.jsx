// Simple footer with copyright notice for all pages
import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Press Start. All rights reserved.</p>
    </footer>
  );
}

export default Footer;

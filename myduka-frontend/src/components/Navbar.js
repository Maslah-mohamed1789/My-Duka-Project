// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-brand">MyDuka</h1>
      </div>
      <div className="navbar-right">
        <ul className="navbar-links">
          <li><Link to="/" className="navbar-link">Home</Link></li>
          <li><Link to="/login" className="navbar-link">Login</Link></li>
          <li><Link to="/register" className="navbar-link">Register</Link></li>
          <li><Link to="/invite_admin" className="navbar-link">Invite Admin</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

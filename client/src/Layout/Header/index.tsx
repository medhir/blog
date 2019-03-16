import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => (
  <header>
    <h1>medhir</h1>
    <nav>
      <ul>
        <li><Link to="/about">about</Link></li>
        <li><Link to="/blog">blog</Link></li>
        <li><Link to="/projects">projects</Link></li>
        <li><Link to="/photos">photos</Link></li>
        <li><Link to="/upload">upload</Link></li>
      </ul>
    </nav>
  </header>
);

export default Header;
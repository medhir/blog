import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => (
  <header>
    <h1>medhir</h1>
    <nav>
      <ul>
        <li><Link to="/about">about</Link></li>
        <li><a href="/blog">blog</a></li>
        <li><Link to="/photos">photos</Link></li>
      </ul>
    </nav>
  </header>
);

export default Header;
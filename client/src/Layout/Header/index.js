import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AuthUtil } from '../../Auth/AuthUtility'
import './Header.css';

class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {
      auth: AuthUtil.authed // -> This does not work. Using Redux for auth state would be nice for sharing between components
    }
  }

  render () {
    return (
      <header>
        <h1>medhir</h1>
        <nav>
          <ul>
            <li><Link to="/about">about</Link></li>
            <li><a href="/blog">blog</a></li>
            {/* { this.state.auth ? <li><Link to="/edit/blog">blog</Link></li> : <li><a href="/blog">blog</a></li> } */}
            <li><Link to="/photos">photos</Link></li>
          </ul>
        </nav>
      </header>
    )
  }
}

export default Header;
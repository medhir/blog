import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Auth from 'Auth'
import './Header.scss'

class Header extends Component {
  render() {
    return (
      <header className="SiteHeader">
        <h1>medhir</h1>
        <nav>
          <ul>
            <li>
              <Link to="/about">about</Link>
            </li>
            <Auth
              fallback={
                <li>
                  <a href="/blog">blog</a>
                </li>
              }
            >
              <li>
                <Link to="/blog/edit">blog</Link>
              </li>
            </Auth>
            <li>
              <Link to="/photos">photos</Link>
            </li>
          </ul>
        </nav>
      </header>
    )
  }
}

export default Header

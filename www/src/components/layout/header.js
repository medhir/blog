import { Link } from "gatsby"
import React from "react"

const Header = () => (
  <header>
    <h1>medhir</h1>
    <nav>
      <ul>
        <li>
          <Link to="/about">about</Link>
        </li>
        <li>
          <Link to="/blog">blog</Link>
        </li>
        <li>
          <Link to="/photos">photos</Link>
        </li>
      </ul>
    </nav>
  </header>
)

export default Header
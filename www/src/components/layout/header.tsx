import Link from 'next/link'
import React from 'react'

const Header = () => (
  <header>
    <h1>medhir</h1>
    <nav>
      <ul>
        <li>
          <Link href="/about">
            <a>about</a>
          </Link>
        </li>
        <li>
          <Link href="/blog">
            <a>blog</a>
          </Link>
        </li>
        <li>
          <Link href="/photos">
            <a>photos</a>
          </Link>
        </li>
      </ul>
    </nav>
  </header>
)

export default Header

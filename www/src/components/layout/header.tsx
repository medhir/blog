import Link from "next/link";
import React from "react";

const Header = () => (
  <header>
    <h1>medhir.com</h1>
    <nav>
      <ul>
        <li>
          <Link href="/about">about</Link>
        </li>
        <li>
          <Link href="/blog">blog</Link>
        </li>
        <li>
          <Link href="/">media</Link>
        </li>
      </ul>
    </nav>
  </header>
);

export default Header;

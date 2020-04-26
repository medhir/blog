import React from 'react'
import PropTypes from 'prop-types'

import Header from './header'
import Footer from './footer'
import styles from './layout.module.scss'

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node,
}

export default Layout

import App from 'next/app'
import React from 'react'

// import CodeBlock from '../components/CodeBlock/index'
import '../styles.scss'

// Override the App class to put layout component around the page contents
// https://github.com/zeit/next.js#custom-app


export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
        <Component {...pageProps} />
    )
  }
}

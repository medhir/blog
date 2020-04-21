import App from 'next/app'
import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { Provider, mdComponents } from 'unified-ui'

// import CodeBlock from '../components/CodeBlock/index'
import '../styles.scss'

// Override the App class to put layout component around the page contents
// https://github.com/zeit/next.js#custom-app

/* MDX Components */
const components = {
  h1: (props) => <h1 {...props} />,
  pre: (props) => <div {...props} />,
  ...mdComponents,
  // code: CodeBlock,
}

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <MDXProvider components={components}>
        <Provider>
          <Component {...pageProps} />
        </Provider>
      </MDXProvider>
    )
  }
}

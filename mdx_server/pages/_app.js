import App, {Container} from 'next/app'
import React from 'react'
import {MDXProvider} from '@mdx-js/react'
import {Provider, mdComponents} from 'unified-ui'

// Override the App class to put layout component around the page contents
// https://github.com/zeit/next.js#custom-app

export default class MyApp extends App {
  render () {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <MDXProvider components={mdComponents}>
            <Provider>
                <Component {...pageProps} />
            </Provider>
        </MDXProvider>
      </Container>
    )
  }
}
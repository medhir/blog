// import App from 'next/app'
// import React from 'react'

// // import CodeBlock from '../components/CodeBlock/index'
// import '../styles.scss'

// // Override the App class to put layout component around the page contents
// // https://github.com/zeit/next.js#custom-app

// export default class MyApp extends App {
//   render() {
//     const { Component, pageProps } = this.props
//     return (
//         <Component {...pageProps} />
//     )
//   }
// }

import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/core/styles'
// import CssBaseline from '@material-ui/core/CssBaseline'
import '../styles.scss'
import theme from '../theme'
import Layout from '../components/layout'

export default function MyApp(props) {
  const { Component, pageProps } = props

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <React.Fragment>
      <Head>
        <title>My page</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <Layout>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          {/* <CssBaseline /> */}
          <Component {...pageProps} />
        </ThemeProvider>
      </Layout>
    </React.Fragment>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
}

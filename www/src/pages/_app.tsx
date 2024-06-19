import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import "../styles.scss";
import theme from "../theme";
import Layout from "../components/layout";

export default function MyApp(props: { Component: any; pageProps: any }) {
  const { Component, pageProps } = props;
  const metaDescription =
    "medhir.com is the personal site and blog of Medhir Bhargava, a Seattle-based product manager and engineer. Stop by for thoughts on tech, art, and more.";
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>medhir.com</title>
        <meta name="description" content={metaDescription} />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />

        <meta property="og:url" content="https://medhir.com" />
        <meta property="og:type" content="website" />
        <meta name="og:title" content="medhir.com" />
        <meta name="og:description" content={metaDescription} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="medhir.com" />
        <meta property="twitter:url" content="https://medhir.com" />
        <meta name="twitter:title" content="medhir.com" />
        <meta name="twitter:description" content={metaDescription} />
      </Head>
      <Layout>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </Layout>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

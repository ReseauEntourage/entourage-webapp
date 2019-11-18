import React from 'react'
import { Reset } from 'styled-reset'
import NextApp from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/core/styles'
import { theme } from 'src/styles/theme'
import { Nav } from 'src/components/Nav'

export default class App extends NextApp {
  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.
  //
  // static async getInitialProps(appContext) {
  //   // calls page's `getInitialProps` and fills `appProps.pageProps`
  //   const appProps = await App.getInitialProps(appContext);
  //
  //   return { ...appProps }
  // }

  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <title>Home</title>
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        </Head>
        <Reset />
        <ThemeProvider theme={theme}>
          <Nav />
          <Component {...pageProps} />
        </ThemeProvider>

      </>
    )
  }
}

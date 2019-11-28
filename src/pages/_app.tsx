import React from 'react'
import { Reset } from 'styled-reset'
import NextApp, { AppContext, AppInitialProps } from 'next/app'
import Head from 'next/head'
import { hijackEffects } from 'stop-runaway-react-effects'
import { ReactQueryConfigProvider } from 'react-query'
import { ThemeProvider } from '@material-ui/core/styles'
import { api } from 'src/api'
import { config as queryConfig } from 'src/queries'
import { theme } from 'src/styles/theme'
import { Nav } from 'src/containers/Nav'
import { Layout } from 'src/components/Layout'
import { MapProvider } from 'src/components/Map'
import { Provider as MainContextProvider } from 'src/containers/MainContext'

if (process.env.NODE_ENV !== 'production') {
  hijackEffects()
}

export default class App extends NextApp {
  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.

  static async getInitialProps(appContext: AppContext): Promise<AppInitialProps> {
    // calls page's `getInitialProps` and fills `appProps.pageProps`
    const appProps = await NextApp.getInitialProps(appContext)

    // use to get token, either anonyous token or authenticated token
    if (!process.browser) {
      await api.ssr(appContext.ctx).request({
        routeName: 'GET users/me',
      })
    }

    return {
      ...appProps,
    }
  }

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
          <ReactQueryConfigProvider config={queryConfig}>
            <MainContextProvider>
              <MapProvider>
                <Layout>
                  <>
                    <Layout.Nav>
                      <Nav />
                    </Layout.Nav>
                    <Layout.Page>
                      <Component {...pageProps} />
                    </Layout.Page>
                  </>
                </Layout>
              </MapProvider>
            </MainContextProvider>
          </ReactQueryConfigProvider>
        </ThemeProvider>
      </>
    )
  }
}

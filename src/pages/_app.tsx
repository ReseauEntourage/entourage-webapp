import { ThemeProvider } from '@material-ui/core/styles'
import NextApp, { AppContext, AppInitialProps } from 'next/app'
import Head from 'next/head'
import { hijackEffects } from 'stop-runaway-react-effects'
import { Reset } from 'styled-reset'
import React from 'react'
import { ReactQueryConfigProvider } from 'react-query'
import { Layout } from 'src/components/Layout'
import { MapProvider } from 'src/components/Map'
import { ModalsListener } from 'src/components/Modal'
import { Provider as MainContextProvider } from 'src/containers/MainContext'
import { Nav } from 'src/containers/Nav'
import { api } from 'src/core/api'
import { Dispatchers } from 'src/core/events'
import { config as queryConfig } from 'src/core/store'
import { theme } from 'src/styles'
import { isSSR } from 'src/utils/misc'

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
    if (isSSR) {
      await api.ssr(appContext.ctx).request({
        name: '/users/me GET',
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
          <link href="/favicon.ico" rel="icon" />
          <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" rel="stylesheet" />
        </Head>
        <Reset />
        <Dispatchers />
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
                      <ModalsListener />
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

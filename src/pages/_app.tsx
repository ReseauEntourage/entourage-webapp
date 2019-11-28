import React from 'react'
import { Reset } from 'styled-reset'
import NextApp, { AppContext, AppInitialProps } from 'next/app'
import Head from 'next/head'
import { ReactQueryConfigProvider } from 'react-query'
import { ThemeProvider } from '@material-ui/core/styles'
import { config as queryConfig } from 'src/queries'
import { theme } from 'src/styles/theme'
import { Nav } from 'src/containers/Nav'
import { Layout } from 'src/components/Layout'
import { MapProvider } from 'src/components/Map'
import { Provider as MainContextProvider } from 'src/containers/MainContext'
import { api, User } from 'src/api'

export default class App extends NextApp {
  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.

  static async getInitialProps(appContext: AppContext): Promise<AppInitialProps & { me: User; }> {
    // calls page's `getInitialProps` and fills `appProps.pageProps`
    const appProps = await NextApp.getInitialProps(appContext)

    const meResponse = await api.ssr(appContext.ctx).request({
      routeName: 'GET users/me',
    })

    return {
      me: meResponse.data.user,
      ...appProps,
    }
  }

  render() {
    // @ts-ignore
    const { Component, pageProps, me } = this.props

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
            <MainContextProvider me={me}>
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

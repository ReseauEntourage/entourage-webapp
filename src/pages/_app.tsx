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
import { SSRDataContext } from 'src/core/SSRDataContext'
import { api } from 'src/core/api'
import { Dispatchers } from 'src/core/events'
import { initSentry } from 'src/core/sentry'
import { config as queryConfig } from 'src/core/store'
import { theme } from 'src/styles'
import { isSSR } from 'src/utils/misc'

if (process.env.NODE_ENV !== 'production') {
  hijackEffects()
}

initSentry()

interface AppState {
  open: boolean;
}
export default class App extends NextApp<{}, {}, AppState> {
  state = {
    open: false,
  }

  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.

  static async getInitialProps(appContext: AppContext): Promise<AppInitialProps> {
    // calls page's `getInitialProps` and fills `appProps.pageProps`
    const appProps = await NextApp.getInitialProps(appContext)

    let me

    // use to get token, either anonyous token or authenticated token
    if (isSSR) {
      const meData = await api.ssr(appContext.ctx).request({
        name: '/users/me GET',
      })

      // me = meData.data.user
      me = {
        data: {
          user: meData.data.user,
        },
      }
    }

    return {
      ...appProps,
      // @ts-ignore
      me,
    }
  }

  setOpen = (open: boolean) => {
    this.setState({ open })
  }

  render() {
    // @ts-ignore
    const { Component, pageProps, me } = this.props
    const { open } = this.state

    const SSRDataValue = { me }

    return (
      <>
        <Head>
          <title>Home</title>
          <link href="/favicon.ico" rel="icon" />
          <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" rel="stylesheet" />
        </Head>
        <Reset />
        <SSRDataContext.Provider value={SSRDataValue}>
          <Dispatchers />
          <ThemeProvider theme={theme}>
            <ReactQueryConfigProvider config={queryConfig}>
              <MainContextProvider>
                <MapProvider>
                  <Layout open={open} setOpen={this.setOpen}>
                    <>
                      <Layout.Nav>
                        <Nav open={open} setOpen={this.setOpen} />
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
        </SSRDataContext.Provider>
      </>
    )
  }
}

import React from 'react'
import { Reset } from 'styled-reset'
import NextApp from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/core/styles'
import withRedux from 'next-redux-wrapper'
import { Provider } from 'react-resources-store'
import { makeStore, schemaRelations, resolver } from 'src/store'
import { theme } from 'src/styles/theme'
import { Nav } from 'src/components/Nav'
import { Layout } from 'src/components/Layout'
import { MapProvider } from 'src/components/Map'

class App extends NextApp {
  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.

  // static async getInitialProps(appContext: AppContext): Promise<any> {
  //   // calls page's `getInitialProps` and fills `appProps.pageProps`
  //   const appProps = await NextApp.getInitialProps(appContext)

  //   return { ...appProps }
  // }

  render() {
    // @ts-ignore
    const { Component, pageProps, store } = this.props

    return (
      <>
        <Head>
          <title>Home</title>
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        </Head>
        <Reset />
        <Provider
          schema={schemaRelations}
          store={store}
          resolver={resolver}
        >
          <ThemeProvider theme={theme}>
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
          </ThemeProvider>
        </Provider>
      </>
    )
  }
}

export default withRedux(makeStore, { debug: false })(App)

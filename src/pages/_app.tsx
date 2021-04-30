import { ThemeProvider, StylesProvider } from '@material-ui/core/styles'
import * as Sentry from '@sentry/react'
import NextApp, { AppContext, AppInitialProps } from 'next/app'
import Head from 'next/head'
import { PersistGate } from 'redux-persist/integration/react'
import { hijackEffects } from 'stop-runaway-react-effects'
import { Reset } from 'styled-reset'
import React from 'react'
import { ReactQueryConfigProvider } from 'react-query'
import { Provider } from 'react-redux'
import { Layout } from 'src/components/Layout'
import { ModalsListener } from 'src/components/Modal'
import { SplashScreen } from 'src/components/SplashScreen'
import { Nav } from 'src/containers/Nav'
import { SSRDataContext } from 'src/core/SSRDataContext'
import { api, LoggedUser } from 'src/core/api'
import { bootstrapStore } from 'src/core/boostrapStore'
import { initSentry } from 'src/core/sentry'
import { config as queryConfig } from 'src/core/store'
import { authUserActions } from 'src/core/useCases/authUser'
import { texts } from 'src/i18n'
import { theme } from 'src/styles'
import { isSSR, initFacebookApp } from 'src/utils/misc'

if (process.env.NODE_ENV !== 'production') {
  hijackEffects()
}

initSentry()
initFacebookApp()

export default class App extends NextApp<{ authUserData: LoggedUser; }> {
  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.

  store: ReturnType<typeof bootstrapStore>['store'] | null = null;

  persistor: ReturnType<typeof bootstrapStore>['persistor'] | null = null;

  static async getInitialProps(appContext: AppContext): Promise<AppInitialProps> {
    const { req } = appContext.ctx
    const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
    // calls page's `getInitialProps` and fills `appProps.pageProps`
    const appProps = await NextApp.getInitialProps(appContext)

    let me

    // use to get token, either anonymous token or authenticated token
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
      authUserData: me?.data.user,
      userAgent,
    }
  }

  componentDidMount() {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }

  render() {
    // @ts-ignore
    const { Component, pageProps, me, userAgent, authUserData } = this.props

    const SSRDataValue = { me, userAgent }

    if (!this.store) {
      const { store, persistor } = bootstrapStore()
      this.store = store
      this.persistor = persistor
    }

    const content = (
      <ReactQueryConfigProvider config={queryConfig}>
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
      </ReactQueryConfigProvider>
    )

    const persistorWrappedContent = this.persistor ? (
      <PersistGate
        loading={<SplashScreen />}
        onBeforeLift={() => {
          if (this.store && authUserData && !authUserData.anonymous) {
            this.store.dispatch(authUserActions.setUser({
              id: authUserData.id,
              email: authUserData.email || undefined,
              hasPassword: authUserData.hasPassword,
              avatarUrl: authUserData.avatarUrl || undefined,
              partner: authUserData.partner,
              lastName: authUserData.lastName || undefined,
              firstName: authUserData.firstName || undefined,
              address: authUserData.address || undefined,
              about: authUserData.about || undefined,
              token: authUserData.token,
              stats: authUserData.stats,
              firstSignIn: authUserData.firstSignIn || false,
            }))
          }
        }}
        persistor={this.persistor}
      >
        {content}
      </PersistGate>
    )
      : content

    return (
      <Sentry.ErrorBoundary fallback="An error has occurred">
        <Head>
          <title>{texts.nav.pageTitles.main}</title>
          <link href="/favicon.ico" rel="icon" />
          <base href="/" />
          <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" rel="stylesheet" />
        </Head>
        <Reset />
        <SSRDataContext.Provider value={SSRDataValue}>
          <>
            <StylesProvider injectFirst={true}>
              <ThemeProvider theme={theme}>
                <Provider store={this.store}>
                  {persistorWrappedContent}
                </Provider>
              </ThemeProvider>
            </StylesProvider>
          </>
        </SSRDataContext.Provider>
      </Sentry.ErrorBoundary>
    )
  }
}

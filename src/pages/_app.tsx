import { ThemeProvider, StylesProvider } from '@material-ui/core/styles'
import NextApp, { AppContext, AppInitialProps } from 'next/app'
import Head from 'next/head'
import { hijackEffects } from 'stop-runaway-react-effects'
import { Reset } from 'styled-reset'
import React from 'react'
import { ReactQueryConfigProvider } from 'react-query'
import { Provider } from 'react-redux'
import { Layout } from 'src/components/Layout'
import { ModalsListener } from 'src/components/Modal'
import { Nav } from 'src/containers/Nav'
import { SSRDataContext } from 'src/core/SSRDataContext'
import { api, LoggedUser } from 'src/core/api'
import { initSentry } from 'src/core/sentry'
import { config as queryConfig } from 'src/core/store'
import { bootstrapStore } from 'src/coreLogic/boostrapStore'
import { authUserActions } from 'src/coreLogic/useCases/authUser'
import { theme } from 'src/styles'
import { isSSR, initFacebookApp, assertIsDefined } from 'src/utils/misc'

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

    // const cookiesAuthUserTokenStorage = new CookiesAuthUserTokenStorage()

    // const authUser = new AuthUser(new HTTPAuthUserGateway(), cookiesAuthUserTokenStorage)

    const store = bootstrapStore()

    if (authUserData && !authUserData.anonymous) {
      assertIsDefined(authUserData.email)

      store.dispatch(authUserActions.setUser({
        id: authUserData.id,
        email: authUserData.email,
        hasPassword: authUserData.hasPassword,
        avatarUrl: authUserData.avatarUrl || undefined,
        partner: authUserData.partner,
        lastName: authUserData.lastName || undefined,
        firstName: authUserData.firstName || undefined,
        address: authUserData.address || undefined,
        about: authUserData.about || undefined,
        token: authUserData.token,
      }))
    }

    return (
      <>
        <Head>
          <title>Home</title>
          <link href="/favicon.ico" rel="icon" />
          <base href="/" />
          <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" rel="stylesheet" />
        </Head>
        <Reset />
        <SSRDataContext.Provider value={SSRDataValue}>
          <>
            <StylesProvider injectFirst={true}>
              <ThemeProvider theme={theme}>
                <Provider store={store}>
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
                </Provider>
              </ThemeProvider>
            </StylesProvider>
          </>
        </SSRDataContext.Provider>
      </>
    )
  }
}

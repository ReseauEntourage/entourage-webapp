import { ThemeProvider, StylesProvider } from '@material-ui/core/styles'
import * as Sentry from '@sentry/react'
import NextApp, { AppContext, AppProps } from 'next/app'
import { hijackEffects } from 'stop-runaway-react-effects'
import { Reset } from 'styled-reset'
import React from 'react'
import { ReactQueryConfigProvider } from 'react-query'
import { CookiesAuthUserTokenStorage } from '../adapters/storage/CookiesAuthUserTokenStorage'
import { Layout } from 'src/components/Layout'
import { ModalsListener } from 'src/components/Modal'
import { Nav } from 'src/containers/Nav'
import { SSRDataContext } from 'src/core/SSRDataContext'
import { api, assertsUserIsLogged } from 'src/core/api'
import { wrapperStore } from 'src/core/boostrapStore'
import { initSentry } from 'src/core/sentry'
import { config as queryConfig } from 'src/core/store'
import { authUserActions } from 'src/core/useCases/authUser'
import { theme } from 'src/styles'
import { isSSR, initFacebookApp } from 'src/utils/misc'

if (process.env.NODE_ENV !== 'production') {
  hijackEffects()
}

initSentry()
initFacebookApp()

class App extends NextApp<AppProps> {
  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.

  public static getInitialProps = wrapperStore.getInitialAppProps((store) => {
    return async (appContext: AppContext) => {
      const { req } = appContext.ctx
      const userAgent = req ? req.headers['user-agent'] : navigator.userAgent

      // use to get token, either anonymous token or authenticated token
      if (isSSR) {
        await CookiesAuthUserTokenStorage.initToken(appContext.ctx)

        const meData = await api.request({
          name: '/users/me GET',
        })

        const { user } = meData.data

        if (user && !user.anonymous) {
          assertsUserIsLogged(user)

          store.dispatch(authUserActions.setUser({
            id: user.id,
            email: user.email || undefined,
            hasPassword: user.hasPassword,
            avatarUrl: user.avatarUrl || undefined,
            partner: user.partner,
            lastName: user.lastName || undefined,
            firstName: user.firstName || undefined,
            address: user.address || undefined,
            about: user.about || undefined,
            token: user.token,
            stats: user.stats,
            firstSignIn: user.firstSignIn || false,
          }))
        }
      }

      return {
        pageProps: {
          ...(appContext.Component.getInitialProps
            ? await appContext.Component.getInitialProps({ ...appContext.ctx, store })
            : {}
          ),
        },
        userAgent,
      }
    }
  })

  componentDidMount() {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }

  render() {
    // @ts-expect-error
    const { Component, pageProps, userAgent } = this.props

    const SSRDataValue = { userAgent }

    if (!isSSR) {
      CookiesAuthUserTokenStorage.initToken().then()
    }

    return (
      <Sentry.ErrorBoundary fallback="An error has occurred">
        <Reset />
        <SSRDataContext.Provider value={SSRDataValue}>
          <StylesProvider injectFirst={true}>
            <ThemeProvider theme={theme}>
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
            </ThemeProvider>
          </StylesProvider>
        </SSRDataContext.Provider>
      </Sentry.ErrorBoundary>
    )
  }
}

export default wrapperStore.withRedux(App)

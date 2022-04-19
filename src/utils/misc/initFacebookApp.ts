import { constants } from 'src/constants'
import { AnyCantFix } from 'src/utils/types'
import { isSSR } from './isSSR'

export function initFacebookApp() {
  if (isSSR) return

  // @ts-expect-error Force fbAsyncInit on window
  window.fbAsyncInit = () => {
  // @ts-expect-error FB is global
    FB.init({
      appId: constants.FB_APP_ID,
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v3.1',
    })
  }

  const FBInit = (d: AnyCantFix, s: AnyCantFix, id: AnyCantFix) => {
    const fjs = d.getElementsByTagName(s)[0]
    if (d.getElementById(id)) return
    const js = d.createElement(s); js.id = id
    js.src = 'https://connect.facebook.net/fr_FR/sdk/xfbml.customerchat.js'
    fjs.parentNode.insertBefore(js, fjs)
  }

  FBInit(document, 'script', 'facebook-jssdk')
}

import { constants } from 'src/constants'
import { env } from 'src/core/env'

export function formatWebLink(url: string): { formattedUrl: string; isExternal: boolean; } {
  const webviewMatch = '://webview?url='
  const messageMatch = '://entourage/'
  const poisMatch = '://guidemap'

  if (url.includes(messageMatch)) {
    return {
      formattedUrl: `/messages/${url.substring(url.indexOf(messageMatch) + messageMatch.length)}`,
      isExternal: false,
    }
  }

  if (url.includes(poisMatch)) {
    return {
      formattedUrl: '/pois',
      isExternal: false,
    }
  }

  if (url.includes(env.SERVER_URL)) {
    return {
      formattedUrl: `/${url.substring(url.indexOf(env.SERVER_URL) + env.SERVER_URL.length)}`,
      isExternal: false,
    }
  }

  if (url.includes(webviewMatch)) {
    return {
      formattedUrl: url.substring(url.indexOf(webviewMatch) + webviewMatch.length),
      isExternal: true,
    }
  }

  if (url.includes('http://') || url.includes('https://')) {
    return {
      formattedUrl: url === constants.WORKSHOP_LINK_MOBILE ? constants.WORKSHOP_LINK_CARD : url,
      isExternal: true,
    }
  }

  if (url.includes('mailto:') || url.includes('tel:')) {
    return {
      formattedUrl: url,
      isExternal: true,
    }
  }

  return {
    formattedUrl: url,
    isExternal: false,
  }
}

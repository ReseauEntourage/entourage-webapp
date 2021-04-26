import { constants } from 'src/constants'
import { env } from 'src/core/env'
import { Route } from 'src/utils/types'

export function formatWebLink(url: string): { formattedUrl: string; isExternal: boolean; authRequired: boolean; } {
  const webviewMatch = '://webview?url='
  const messageMatch = '://entourage/'
  const poisMatch = '://guidemap'

  if (url.includes(messageMatch)) {
    return {
      formattedUrl: `/messages/${url.substring(url.indexOf(messageMatch) + messageMatch.length)}`,
      isExternal: false,
      authRequired: true,
    }
  }

  if (url.includes(poisMatch)) {
    return {
      formattedUrl: '/pois',
      isExternal: false,
      authRequired: false,
    }
  }

  if (url.includes(env.SERVER_URL)) {
    const formattedUrl = `/${url.substring(url.indexOf(env.SERVER_URL) + env.SERVER_URL.length)}`
    return {
      formattedUrl,
      isExternal: false,
      authRequired: formattedUrl.includes('/messages' as Route),
    }
  }

  if (url.includes(webviewMatch)) {
    return {
      formattedUrl: url.substring(url.indexOf(webviewMatch) + webviewMatch.length),
      isExternal: true,
      authRequired: false,
    }
  }

  if (url.includes('http://') || url.includes('https://')) {
    return {
      formattedUrl: url === constants.WORKSHOP_LINK_MOBILE ? constants.WORKSHOP_LINK_CARD : url,
      isExternal: true,
      authRequired: false,
    }
  }

  if (url.includes('mailto:') || url.includes('tel:')) {
    return {
      formattedUrl: url,
      isExternal: true,
      authRequired: false,
    }
  }

  return {
    formattedUrl: url,
    isExternal: false,
    authRequired: url.includes('/messages' as Route),
  }
}

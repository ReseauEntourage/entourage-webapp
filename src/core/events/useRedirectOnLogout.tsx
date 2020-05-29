import { useEffect } from 'react'
import { useQueryIAmLogged } from 'src/core/store'
import { useOnLogout } from './onLogout'

export function useRedirectOnLogout() {
  const { iAmLogged, iAmLogging } = useQueryIAmLogged()

  const redirectOnPublicPage = () => {
    window.location.href = '/actions'
  }

  useEffect(() => {
    if (!iAmLogging && !iAmLogged) {
      redirectOnPublicPage()
    }
  }, [iAmLogging, iAmLogged])

  useOnLogout(() => {
    redirectOnPublicPage()
  })
}

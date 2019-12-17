import { useOnLogout } from './onLogout'

export function useRedirectOnLogout() {
  useOnLogout(() => {
    window.location.href = '/actions'
  })
}

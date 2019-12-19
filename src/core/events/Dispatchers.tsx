import { useOnLoginDispatcher } from './onLogin'
import { useOnLogoutDispatcher } from './onLogout'

export function Dispatchers() {
  useOnLoginDispatcher()
  useOnLogoutDispatcher()

  return null
}

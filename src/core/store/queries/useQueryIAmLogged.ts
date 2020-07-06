import { useQueryMe } from './useQueryMe'

export function useQueryIAmLogged() {
  const { data: me, isLoading } = useQueryMe()

  const iAmNotAnonymous = me?.data?.user?.anonymous === false

  return {
    iAmLogging: isLoading,
    iAmLogged: iAmNotAnonymous,
  }
}

import { useQueryMe } from './useQueryMe'

export function useQueryIAmLogged() {
  const { data: me } = useQueryMe()
  return me && !me.data?.user?.anonymous
}

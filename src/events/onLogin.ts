import { useEffect } from 'react'
import { Subject } from 'rxjs'
import { useMount, usePrevious } from 'src/hooks'
import { useQueryMe } from 'src/network/queries'

const loginSubject = new Subject()

const publishOnLogin = () => loginSubject.next()

export function useOnLogin(onLogin: () => void) {
  useMount(() => {
    const subscription = loginSubject.subscribe(onLogin)
    return () => subscription.unsubscribe()
  })
}

// singleton
export function useOnLoginDispatcher() {
  const response = useQueryMe()
  const prevResponse = usePrevious(response)

  useEffect(() => {
    const prevResponseIsNotLogged = !prevResponse || !prevResponse.data || prevResponse.data.data.user.anonymous
    const prevResponseIsLogged = response.data && !response.data.data.user.anonymous

    if (prevResponseIsNotLogged && prevResponseIsLogged) {
      publishOnLogin()
    }
  }, [prevResponse, response])
}

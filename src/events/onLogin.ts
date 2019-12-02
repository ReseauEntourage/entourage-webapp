import { useEffect } from 'react'
import { Subject } from 'rxjs'
import { useMount, usePrevious } from 'src/hooks'
import { useQueryMe } from 'src/network/queries'

const loginSubject = new Subject()

function publish(me: NonNullable<ReturnType<typeof useQueryMe>['data']>) {
  loginSubject.next(me)
}

export function useOnLogin(onLogin: (me: Parameters<typeof publish>[0]) => void) {
  useMount(() => {
    // @ts-ignore
    const subscription = loginSubject.subscribe(onLogin)
    return () => subscription.unsubscribe()
  })
}

export function useOnLoginDispatcher() {
  const { data: meResponse } = useQueryMe()
  const prevMeReponse = usePrevious(meResponse)

  useEffect(() => {
    const prevMeReponseIsNotLogged = !prevMeReponse || !prevMeReponse.data || prevMeReponse.data.user.anonymous
    const prevMeReponseIsLogged = meResponse && !meResponse.data.user.anonymous

    if (prevMeReponseIsNotLogged && prevMeReponseIsLogged) {
      publish(meResponse as NonNullable<typeof meResponse>)
    }
  }, [prevMeReponse, meResponse])
}

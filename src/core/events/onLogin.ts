import { Subject } from 'rxjs'
import { useEffect } from 'react'
import { useQueryMe } from 'src/core/queries'
import { useMount, usePrevious } from 'src/utils/hooks'

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
    const meReponseIsLogged = meResponse && !meResponse.data.user.anonymous

    if (prevMeReponseIsNotLogged && meReponseIsLogged) {
      publish(meResponse as NonNullable<typeof meResponse>)
    }
  }, [prevMeReponse, meResponse])
}

import { Subject } from 'rxjs'
import { useEffect } from 'react'
import { useMount, usePrevious } from 'src/hooks'
import { useQueryMe } from 'src/network/queries'

const logoutSubject = new Subject()

function publish(me: NonNullable<ReturnType<typeof useQueryMe>['data']>) {
  logoutSubject.next(me)
}

export function useOnLogout(onLogout: (me: Parameters<typeof publish>[0]) => void) {
  useMount(() => {
    // @ts-ignore
    const subscription = logoutSubject.subscribe(onLogout)
    return () => subscription.unsubscribe()
  })
}

export function useOnLogoutDispatcher() {
  const { data: meResponse } = useQueryMe()
  const prevMeReponse = usePrevious(meResponse)

  useEffect(() => {
    const prevMeReponseIsLogged = prevMeReponse && prevMeReponse.data && !prevMeReponse.data.user.anonymous
    const meReponseIsNotLogged = meResponse && meResponse.data && meResponse.data.user.anonymous

    if (prevMeReponseIsLogged && meReponseIsNotLogged) {
      publish(meResponse as NonNullable<typeof meResponse>)
    }
  }, [prevMeReponse, meResponse])
}

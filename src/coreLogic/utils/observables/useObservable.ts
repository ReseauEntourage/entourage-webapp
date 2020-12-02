import { Observable } from 'rxjs'
import { useEffect } from 'react'

export function useObservable<T>(observable$: Observable<T> | undefined, cb: (data: T) => void) {
  useEffect(() => {
    if (observable$) {
      const subscription = observable$.subscribe(cb)
      return () => subscription.unsubscribe()
    }

    return () => null
  }, [observable$]) // eslint-disable-line
}

import { Observable } from 'rxjs'
import { useState, useEffect, useRef } from 'react'
// import { AnyCantFix } from 'src/utils/types'

export function useObservableData<T>(observable$: Observable<T>) {
  const [, setTime] = useState(Date.now())
  // const subscriptionRef = useRef<AnyCantFix>(null)
  const isRenderFromParentRef = useRef<boolean>()
  const isUnmountRef = useRef(false)

  isRenderFromParentRef.current = true

  // if (subscriptionRef.current) {
  //   subscriptionRef.current.unsubscribe()
  // }

  useEffect(() => {
    return () => {
      isUnmountRef.current = true
    }
  }, [])

  let data

  const subscription = observable$.subscribe((innerData) => {
    if (!isRenderFromParentRef.current && !isUnmountRef.current) {
      setTime(Date.now())
    } else {
      data = innerData
    }
  })

  useEffect(() => {
    return () => subscription.unsubscribe()
  }, [subscription])

  // subscriptionRef.current = subscription
  isRenderFromParentRef.current = false

  // @ts-expect-error
  return data as T
}

import { Subject } from 'rxjs'
import { useState, useCallback, useRef } from 'react'

const MIN_DELAY_START_LOADING = 500
const MIN_DELAY_END_LOADING = 2000

export function useDelayLoading(defaultValue = false) {
  const [loading, setLoading] = useState(defaultValue)
  const startTimeout = useRef(0)
  const stopTimeout = useRef(0)

  const subjectStopLoading = useRef(new Subject())

  const startWithDelay = useCallback(() => {
    startTimeout.current = setTimeout(() => {
      setLoading(true)
      stopTimeout.current = setTimeout(() => {
        subjectStopLoading.current.next()
        clearTimeout(stopTimeout.current)
      }, MIN_DELAY_END_LOADING)
    }, MIN_DELAY_START_LOADING)
  }, [])

  const stopWithDelay = useCallback(() => {
    clearTimeout(startTimeout.current)
    if (stopTimeout.current) {
      return new Promise((resolve) => {
        const sub = subjectStopLoading.current.subscribe(() => {
          setLoading(false)
          clearTimeout(stopTimeout.current)
          sub.unsubscribe()
          resolve()
        })
      })
    }

    setLoading(false)

    return null
  }, [subjectStopLoading])

  const setLoadingDelay = useCallback((value: boolean) => {
    if (value === true) {
      return startWithDelay()
    }

    return stopWithDelay()
  }, [startWithDelay, stopWithDelay])

  return [loading, setLoadingDelay] as [typeof loading, (value: boolean) => Promise<void>]
}

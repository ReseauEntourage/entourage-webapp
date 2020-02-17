import { Subject } from 'rxjs'
import { useState, useCallback, useRef, useEffect } from 'react'

const MIN_DELAY_START_LOADING = 500
const MIN_DELAY_END_LOADING = 2000

interface Options {
  minDelayEndLoading: number;
  minDelayStartLoading: number;
}

const defaultOptions = {
  minDelayEndLoading: MIN_DELAY_END_LOADING,
  minDelayStartLoading: MIN_DELAY_START_LOADING,
}

export function useDelayLoading(defaultValue = false, options: Options = defaultOptions) {
  const { minDelayEndLoading, minDelayStartLoading } = options
  const [loading, setLoading] = useState(defaultValue)
  const startTimeout = useRef(0)
  const stopTimeout = useRef(0)
  const isUnmountRef = useRef(false)

  const subjectStopLoading = useRef(new Subject())

  useEffect(() => {
    return () => {
      isUnmountRef.current = true
    }
  }, [])

  const startWithDelay = useCallback(() => {
    startTimeout.current = setTimeout(() => {
      if (isUnmountRef.current) return
      setLoading(true)
      stopTimeout.current = setTimeout(() => {
        if (isUnmountRef.current) return
        subjectStopLoading.current.next()
        clearTimeout(stopTimeout.current)
      }, minDelayEndLoading)
    }, minDelayStartLoading)
  }, [minDelayEndLoading, minDelayStartLoading])

  const stopWithDelay = useCallback(() => {
    clearTimeout(startTimeout.current)
    if (stopTimeout.current) {
      return new Promise((resolve) => {
        const sub = subjectStopLoading.current.subscribe(() => {
          if (isUnmountRef.current) return
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

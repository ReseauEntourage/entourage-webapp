import { useState, useRef, useEffect } from 'react'

const MIN_DELAY_START_LOADING = 300
const MIN_DELAY_END_LOADING = 2000

interface Options {
  minDelayEndLoading: number;
  minDelayStartLoading: number;
}

const defaultOptions = {
  minDelayEndLoading: MIN_DELAY_END_LOADING,
  minDelayStartLoading: MIN_DELAY_START_LOADING,
}

export function useDelayLoadingNext(loading: boolean, options: Options = defaultOptions): boolean {
  const [time, setTime] = useState(Date.now())
  const timeRef = useRef(time)
  timeRef.current = time

  const externalLoadingRef = useRef(loading)
  const loadingRef = useRef(false)

  externalLoadingRef.current = loading

  useEffect(() => {
    let timer: number

    if (loading && !loadingRef.current) {
      timer = setTimeout(() => {
        if (externalLoadingRef.current) {
          loadingRef.current = true
          setTime(Date.now())
        }
      }, options.minDelayStartLoading)
    }

    if (!loading && loadingRef.current) {
      const lastUdateIsTooClosed = (Date.now() - timeRef.current) < options.minDelayEndLoading

      if (lastUdateIsTooClosed) {
        timer = setTimeout(() => {
          loadingRef.current = false
          setTime(Date.now())
        }, options.minDelayEndLoading)
      } else {
        loadingRef.current = false
        setTime(Date.now())
      }
    }

    return () => clearTimeout(timer)
  }, [loading, options.minDelayEndLoading, options.minDelayStartLoading])

  return loadingRef.current
}

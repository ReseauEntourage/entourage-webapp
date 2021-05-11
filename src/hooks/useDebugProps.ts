import { useEffect } from 'react'
import { usePrevious } from 'src/utils/hooks'
import { AnyCantFix } from 'src/utils/types'

export function useDebugProps(props: AnyCantFix) {
  const prevProps = usePrevious(props)

  useEffect(() => {
    if (props && prevProps) {
      Object.keys(props).forEach((key) => {
        if (props[key] !== prevProps[key]) {
          // eslint-disable-next-line
          console.log('props ref updated ! ', key)
        }
      })
    }
  }, [props, prevProps])
}

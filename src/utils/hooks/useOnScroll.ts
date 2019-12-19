import { useCallback } from 'react'

const OFFSET_TO_FETCH = 50

const enableFetchRef = {
  current: true,
}

export function useOnScroll(fetch: () => Promise<unknown>) {
  // const enableFetchRef = useRef(true)

  const onScroll = useCallback(async (event: React.UIEvent<HTMLElement>) => {
    const { scrollHeight, offsetHeight, scrollTop } = event.currentTarget
    const scrollExist = scrollHeight > offsetHeight

    if (!scrollExist) {
      return
    }

    const scrollIsAtBottom = (offsetHeight + scrollTop) > scrollHeight - OFFSET_TO_FETCH

    if (scrollIsAtBottom) {
      if (enableFetchRef.current) {
        enableFetchRef.current = false
        try {
          await fetch()
          enableFetchRef.current = true
        } catch (e) {
          // do nothing
        }
      }
    }
  }, [fetch])

  return {
    onScroll,
  }
}

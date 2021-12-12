import { renderHook, act } from '@testing-library/react-hooks'
import { useState } from 'react'
import { useDelayLoadingNext as useDelayLoading } from './useDelayLoadingNext'

function timeout(delay: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

function useDemo(initialValue: boolean, options: Parameters<typeof useDelayLoading>[1]) {
  const [initialLoading, setInitialLoading] = useState(initialValue)

  const loading = useDelayLoading(initialLoading, options)

  return {
    loading,
    setInitialLoading,
  }
}

const defaultOptions = {
  minDelayEndLoading: 2000,
  minDelayStartLoading: 500,
}

describe('useDelayLoading', () => {
  it('should doesn\'t be loading at initial state', () => {
    const { result } = renderHook(() => useDemo(true, defaultOptions))

    expect(result.current.loading).toEqual(false)
  })

  it('should doesn\'t change loading state before 500ms', async () => {
    const { result } = renderHook(() => useDemo(false, defaultOptions))

    await act(async () => {
      result.current.setInitialLoading(true)
      expect(result.current.loading).toBe(false)

      await timeout(200)
      expect(result.current.loading).toBe(false)
      result.current.setInitialLoading(false)

      await timeout(1000)
      expect(result.current.loading).toBe(false)
    })
  })

  it('should change loading state after 500ms', async () => {
    const { result } = renderHook(() => useDemo(false, defaultOptions))

    await act(async () => {
      result.current.setInitialLoading(true)
      expect(result.current.loading).toBe(false)

      await timeout(1000)
      expect(result.current.loading).toBe(true)

      result.current.setInitialLoading(false)
      await timeout(1000)
      expect(result.current.loading).toBe(true)

      await timeout(1500)
      expect(result.current.loading).toBe(false)
    })
  })
})

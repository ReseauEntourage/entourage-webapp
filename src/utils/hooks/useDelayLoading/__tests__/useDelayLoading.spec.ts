import { renderHook, act } from '@testing-library/react-hooks'
import { useDelayLoading } from '../useDelayLoading'

function timeout(delay: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

const options = {
  minDelayEndLoading: 2000,
  minDelayStartLoading: 500,
}

describe('useDelayLoading', () => {
  it('should doesn\'t change loading state before 500ms', async () => {
    const { result } = renderHook(() => useDelayLoading(false, options))

    await act(async () => {
      result.current[1](true)
      expect(result.current[0]).toBe(false)

      await timeout(200)
      expect(result.current[0]).toBe(false)
      result.current[1](false)

      await timeout(1000)
      expect(result.current[0]).toBe(false)
    })
  })

  it('should change loading state after 500ms', async () => {
    const { result } = renderHook(() => useDelayLoading(false, options))

    await act(async () => {
      result.current[1](true)
      expect(result.current[0]).toBe(false)

      await timeout(1000)
      expect(result.current[0]).toBe(true)

      result.current[1](false)
      await timeout(1000)
      expect(result.current[0]).toBe(true)

      await timeout(1500)
      expect(result.current[0]).toBe(false)
    })
  })
})

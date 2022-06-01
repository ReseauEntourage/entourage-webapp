import { useRef, useState, useCallback } from 'react'

export type Setter<State> = (state: State | ((prevState: State) => State)) => void
export type Getter<State> = () => State

export function useStateGetter<State>(initialValue?: State): [State, Setter<State>, Getter<State>] {
  const [value, setValue] = useState<State>(initialValue as State)
  const ref = useRef(value)
  const set = useCallback((nextValue) => {
    setValue((val) => {
      const finalValue = typeof nextValue === 'function'
        ? nextValue(val)
        : nextValue

      ref.current = finalValue
      return finalValue
    })
  }, [])
  const get = useCallback(() => ref.current, [])

  return [value, set, get]
}

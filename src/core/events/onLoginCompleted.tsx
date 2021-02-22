import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectLoginIsCompleted } from '../useCases/authUser'
import { usePrevious } from 'src/utils/hooks'

export function useOnLoginCompleted(onLoginCompleted: () => void) {
  const loginIsCompleted = useSelector(selectLoginIsCompleted)
  const prevLoginIsCompleted = usePrevious(loginIsCompleted)

  useEffect(() => {
    if (!prevLoginIsCompleted && loginIsCompleted) {
      onLoginCompleted()
    }
  }, [prevLoginIsCompleted, loginIsCompleted, onLoginCompleted])
}

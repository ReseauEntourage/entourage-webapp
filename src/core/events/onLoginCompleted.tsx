import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { usePrevious } from '../../utils/hooks'
import { selectLoginIsCompleted } from '../useCases/authUser'

export function useOnLoginCompleted(onLoginCompleted: () => void) {
  const loginIsCompleted = useSelector(selectLoginIsCompleted)
  const prevLoginIsCompleted = usePrevious(loginIsCompleted)

  useEffect(() => {
    if (!prevLoginIsCompleted && loginIsCompleted) {
      onLoginCompleted()
    }
  }, [prevLoginIsCompleted, loginIsCompleted, onLoginCompleted])
}

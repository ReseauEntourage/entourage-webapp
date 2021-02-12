import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { usePrevious } from '../../utils/hooks'
import { selectLoginStepIsCompleted } from '../useCases/authUser'

export function useOnLoginStepsCompleted(onLoginStepsCompleted: () => void) {
  const loginStepIsCompleted = useSelector(selectLoginStepIsCompleted)
  const prevLoginStepIsCompleted = usePrevious(loginStepIsCompleted)

  useEffect(() => {
    if (!prevLoginStepIsCompleted && loginStepIsCompleted) {
      onLoginStepsCompleted()
    }
  }, [prevLoginStepIsCompleted, loginStepIsCompleted, onLoginStepsCompleted])
}

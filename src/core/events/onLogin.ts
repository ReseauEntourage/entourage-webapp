import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectIsLogged } from 'src/core/useCases/authUser'
import { usePrevious } from 'src/utils/hooks'

export function useOnLogin(onLogin: () => void) {
  const isLogged = useSelector(selectIsLogged)
  const prevIsLogged = usePrevious(isLogged)

  useEffect(() => {
    if (!prevIsLogged && isLogged) {
      onLogin()
    }
  }, [isLogged, prevIsLogged, onLogin])
}

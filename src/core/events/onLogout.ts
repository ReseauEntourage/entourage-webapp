import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectIsLogged } from 'src/coreLogic/useCases/authUser'
import { usePrevious } from 'src/utils/hooks'

export function useOnLogout(onLogout: () => void) {
  const isLogged = useSelector(selectIsLogged)
  const prevIsLogged = usePrevious(isLogged)

  useEffect(() => {
    if (prevIsLogged && !isLogged) {
      onLogout()
    }
  }, [isLogged, onLogout, prevIsLogged])
}

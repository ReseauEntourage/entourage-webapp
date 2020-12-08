import { useSelector } from 'react-redux'
import { selectUser } from 'src/core/useCases/authUser'
import { assertIsDefined } from 'src/utils/misc'

export function useMe() {
  return useSelector(selectUser)
}

export function useMeNonNullable() {
  const me = useMe()

  assertIsDefined(me)

  return me
}

import { useDispatch } from 'react-redux'
import { firebaseActions } from 'src/core/useCases/firebase'
import { FirebaseEventFunctions, FirebaseProps, FirebaseEventFunction } from 'src/utils/types'

type GeneratedFirebaseDispatches = Record<FirebaseEventFunction, (props?: FirebaseProps) => void>

export function useFirebase() {
  const dispatch = useDispatch()

  const dispatches: GeneratedFirebaseDispatches = FirebaseEventFunctions.reduce((acc, curr) => {
    return {
      ...acc,
      [curr as FirebaseEventFunction]: (props?: FirebaseProps) => {
        dispatch(firebaseActions[curr as FirebaseEventFunction](props))
      },
    }
  }, {} as GeneratedFirebaseDispatches)

  return dispatches
}

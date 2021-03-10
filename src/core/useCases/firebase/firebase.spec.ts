import { configureStore } from '../../configureStore'
import { PartialAppDependencies } from '../Dependencies'
import { PartialAppState, defaultInitialAppState, reducers } from '../reducers'

import { FirebaseEvents } from 'src/utils/types'
import { TestFirebaseService } from './TestFirebaseService'
import { publicActions } from './firebase.actions'
import { firebaseSaga } from './firebase.saga'

function configureStoreWithFirebase(
  params: {
    dependencies?: PartialAppDependencies;
    initialAppState?: PartialAppState;
  },
) {
  const { initialAppState, dependencies } = params

  return configureStore({
    reducers,
    initialState: {
      ...defaultInitialAppState,
      ...initialAppState,
    },
    dependencies,
    sagas: [firebaseSaga],
  })
}

describe('Firebase', () => {
  it(`
   Given initial state
   When user does a specific action
   Then the corresponding event should be sent to Firebase
  `, async () => {
    const firebaseService = new TestFirebaseService()

    const store = configureStoreWithFirebase({ dependencies: { firebaseService } })

    firebaseService.setUser.mockReturnValueOnce()
    firebaseService.sendEvent.mockReturnValueOnce()

    const firebaseEvent = {
      event: FirebaseEvents[0],
      props: {
        value: '',
      },
    }

    store.dispatch(publicActions.sendFirebaseEvent(firebaseEvent))

    await store.waitForActionEnd()

    expect(firebaseService.sendEvent).toHaveBeenCalledWith(firebaseEvent.event, firebaseEvent.props)
  })
})

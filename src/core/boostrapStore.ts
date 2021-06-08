import { createWrapper } from 'next-redux-wrapper'
import { StateFromReducersMapObject } from 'redux'
import { HTTPMessagesGateway } from '../adapters/gateways/HTTPMessagesGateway'
import { HTTPPOIsGateway } from '../adapters/gateways/HTTPPOIsGateway'
import { FirebaseService } from '../adapters/services/FirebaseService'
import { HTTPAuthUserGateway } from 'src/adapters/gateways/HTTPAuthUserGateway'
import { HTTPFeedGateway } from 'src/adapters/gateways/HTTPFeedGateway'
import { GeolocationService } from 'src/adapters/services/GeolocationService'
import { CookiesAuthUserTokenStorage } from 'src/adapters/storage/CookiesAuthUserTokenStorage'
import { LocalAuthUserSensitizationStorage } from 'src/adapters/storage/LocalAuthUserSensitizationStorage'
import { configureStore } from './configureStore'
import { AppDependencies } from './useCases/Dependencies'
import { authUserSaga } from './useCases/authUser'
import { feedSaga } from './useCases/feed'
import { firebaseSaga } from './useCases/firebase'
import { locationSaga } from './useCases/location'
import { messagesSaga } from './useCases/messages'
import { poisSaga } from './useCases/pois'
import { reducers } from './useCases/reducers'

export function bootstrapStore() {
  const sagas = [
    authUserSaga,
    feedSaga,
    poisSaga,
    locationSaga,
    firebaseSaga,
    messagesSaga,
  ]

  const dependencies: AppDependencies = {
    authUserGateway: new HTTPAuthUserGateway(),
    feedGateway: new HTTPFeedGateway(),
    poisGateway: new HTTPPOIsGateway(),
    authUserTokenStorage: new CookiesAuthUserTokenStorage(),
    authUserSensitizationStorage: new LocalAuthUserSensitizationStorage(),
    geolocationService: new GeolocationService(),
    firebaseService: new FirebaseService(),
    messagesGateway: new HTTPMessagesGateway(),
  }

  const store = configureStore({
    reducers,
    sagas,
    dependencies,
  })

  return { store }
}

export type AppState = StateFromReducersMapObject<typeof reducers>;

export const wrapperStore = createWrapper(() => bootstrapStore().store)

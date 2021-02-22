import { StateFromReducersMapObject } from 'redux'
import { persistStore } from 'redux-persist'
import { HTTPPOIsGateway } from '../adapters/gateways/HTTPPOIsGateway'
import { HTTPAuthUserGateway } from 'src/adapters/gateways/HTTPAuthUserGateway'
import { HTTPFeedGateway } from 'src/adapters/gateways/HTTPFeedGateway'
import { GeolocationService } from 'src/adapters/services/GeolocationService'
import { CookiesAuthUserTokenStorage } from 'src/adapters/storage/CookiesAuthUserTokenStorage'
import { LocalAuthUserSensitizationStorage } from 'src/adapters/storage/LocalAuthUserSensitizationStorage'
import { configureStore } from './configureStore'
import { AppDependencies } from './useCases/Dependencies'
import { authUserSaga } from './useCases/authUser'
import { feedSaga } from './useCases/feed'
import { locationSaga } from './useCases/location/location.saga'
import { poisSaga } from './useCases/pois'
import { reducers } from './useCases/reducers'

export function bootstrapStore() {
  const sagas = [
    authUserSaga,
    feedSaga,
    poisSaga,
    locationSaga,
  ]

  const dependencies: AppDependencies = {
    authUserGateway: new HTTPAuthUserGateway(),
    feedGateway: new HTTPFeedGateway(),
    poisGateway: new HTTPPOIsGateway(),
    authUserTokenStorage: new CookiesAuthUserTokenStorage(),
    authUserSensitizationStorage: new LocalAuthUserSensitizationStorage(),
    geolocationService: new GeolocationService(),
  }

  const store = configureStore({
    reducers,
    sagas,
    dependencies,
  })

  const persistor = persistStore(store)

  return { store, persistor }
}

export type AppState = StateFromReducersMapObject<typeof reducers>;

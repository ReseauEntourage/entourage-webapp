import { StateFromReducersMapObject } from 'redux'
import { HTTPPOIsGateway } from '../adapters/gateways/HTTPPOIsGateway'
import { HTTPAuthUserGateway } from 'src/adapters/gateways/HTTPAuthUserGateway'
import { HTTPFeedGateway } from 'src/adapters/gateways/HTTPFeedGateway'
import { CookiesAuthUserTokenStorage } from 'src/adapters/tokenStorage/CookiesAuthUserTokenStorage'
import { configureStore } from './configureStore'
import { AppDependencies } from './useCases/Dependencies'
import { authUserSaga } from './useCases/authUser'
import { feedSaga } from './useCases/feed'
import { poisSaga } from './useCases/pois'
import { reducers } from './useCases/reducers'

export function bootstrapStore() {
  const sagas = [
    authUserSaga,
    feedSaga,
    poisSaga,
  ]

  const dependencies: AppDependencies = {
    authUserGateway: new HTTPAuthUserGateway(),
    feedGateway: new HTTPFeedGateway(),
    poisGateway: new HTTPPOIsGateway(),
    authUserTokenStorage: new CookiesAuthUserTokenStorage(),
  }

  return configureStore({
    reducers,
    sagas,
    dependencies,
  })
}

export type AppState = StateFromReducersMapObject<typeof reducers>;

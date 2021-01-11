import { StateFromReducersMapObject } from 'redux'
import { HTTPApiGateway } from 'src/adapters/gateways/HTTPApiGateway'
import { HTTPAuthUserGateway } from 'src/adapters/gateways/HTTPAuthUserGateway'
import { HTTPFeedGateway } from 'src/adapters/gateways/HTTPFeedGateway'
import { CookiesAuthUserTokenStorage } from 'src/adapters/tokenStorage/CookiesAuthUserTokenStorage'
import { configureStore } from './configureStore'
import { AppDependencies } from './useCases/Dependencies'
import { authUserSaga } from './useCases/authUser'
import { entitiesSaga } from './useCases/entities'
import { feedSaga } from './useCases/feed'
import { reducers } from './useCases/reducers'

export function bootstrapStore() {
  const sagas = [
    entitiesSaga,
    authUserSaga,
    feedSaga,
  ]

  const dependencies: AppDependencies = {
    authUserGateway: new HTTPAuthUserGateway(),
    feedGateway: new HTTPFeedGateway(),
    authUserTokenStorage: new CookiesAuthUserTokenStorage(),
    apiGateway: new HTTPApiGateway(),
  }

  return configureStore({
    reducers,
    sagas,
    dependencies,
  })
}

export type AppState = StateFromReducersMapObject<typeof reducers>;

import { StateFromReducersMapObject } from 'redux'
import { HTTPAuthUserGateway } from 'src/adapters/gateways/HTTPAuthUserGateway'
import { HTTPFeedGateway } from 'src/adapters/gateways/HTTPFeedGateway'
import { CookiesAuthUserTokenStorage } from 'src/adapters/storage/CookiesAuthUserTokenStorage'
import { LocalAuthUserSensitizationStorage } from 'src/adapters/storage/LocalAuthUserSensitizationStorage'
import { configureStore } from './configureStore'
import { AppDependencies } from './useCases/Dependencies'
import { authUserSaga } from './useCases/authUser'
import { feedSaga } from './useCases/feed'
import { reducers } from './useCases/reducers'

export function bootstrapStore() {
  const sagas = [
    authUserSaga,
    feedSaga,
  ]

  const dependencies: AppDependencies = {
    authUserGateway: new HTTPAuthUserGateway(),
    feedGateway: new HTTPFeedGateway(),
    authUserTokenStorage: new CookiesAuthUserTokenStorage(),
    authUserSensitizationStorage: new LocalAuthUserSensitizationStorage(),
  }

  return configureStore({
    reducers,
    sagas,
    dependencies,
  })
}

export type AppState = StateFromReducersMapObject<typeof reducers>;

import { StateFromReducersMapObject } from 'redux'
import { HTTPAuthUserGateway } from 'src/adatpers/gateways/HTTPAuthUserGateway'
import { HTTPFeedGateway } from 'src/adatpers/gateways/HTTPFeedGateway'
import { CookiesAuthUserTokenStorage } from 'src/adatpers/tokenStorage/CookiesAuthUserTokenStorage'
import { configureStore } from './configureStore'
import { authUserReducer, authUserSaga, Dependencies as AuthUserDependencies } from './useCases/authUser'
import { feedReducer, feedSaga, Dependencies as FeedDependencies } from './useCases/feed'

interface Dependencies extends AuthUserDependencies, FeedDependencies {}

const reducers = {
  authUser: authUserReducer,
  feed: feedReducer,
}

export function bootstrapStore() {
  const sagas = [
    authUserSaga,
    feedSaga,
  ]

  const dependencies: Dependencies = {
    authUserGateway: new HTTPAuthUserGateway(),
    feedGateway: new HTTPFeedGateway(),
    authUserTokenStorage: new CookiesAuthUserTokenStorage(),
  }

  return configureStore({
    reducers,
    sagas,
    dependencies,
  })
}

export type AppState = StateFromReducersMapObject<typeof reducers>;

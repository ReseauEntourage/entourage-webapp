import { StateFromReducersMapObject } from 'redux'
import { BrowserLocale } from 'src/adapters/browser/BrowserLocale'
import { HTTPAuthUserGateway } from 'src/adapters/gateways/HTTPAuthUserGateway'
import { HTTPFeedGateway } from 'src/adapters/gateways/HTTPFeedGateway'
import { CookiesAuthUserTokenStorage } from 'src/adapters/storage/CookiesAuthUserTokenStorage'
import { CookiesLocaleStorage } from 'src/adapters/storage/CookiesLocaleStorage'
import { configureStore } from './configureStore'
import { AppDependencies } from './useCases/Dependencies'
import { authUserSaga } from './useCases/authUser'
import { feedSaga } from './useCases/feed'
import { localeSaga } from './useCases/locale'
import { reducers } from './useCases/reducers'

export function bootstrapStore() {
  const sagas = [
    authUserSaga,
    feedSaga,
    localeSaga,
  ]

  const dependencies: AppDependencies = {
    authUserGateway: new HTTPAuthUserGateway(),
    feedGateway: new HTTPFeedGateway(),
    authUserTokenStorage: new CookiesAuthUserTokenStorage(),
    localeBrowser: new BrowserLocale(),
    localeStorage: new CookiesLocaleStorage(),
  }

  return configureStore({
    reducers,
    sagas,
    dependencies,
  })
}

export type AppState = StateFromReducersMapObject<typeof reducers>;

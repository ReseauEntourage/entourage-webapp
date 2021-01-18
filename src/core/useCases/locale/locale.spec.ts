import { configureStore } from '../../configureStore'
import { PatialAppDependencies } from '../Dependencies'
import { PartialAppState, defaultInitialAppState, reducers } from '../reducers'
import { TestLocaleBrowser } from './TestLocaleBrowser'
import { TestLocaleStorage } from './TestLocaleStorage'
import { fakeLocale1, fakeLocale2 } from './__mocks__'
import { publicActions } from './locale.actions'
import { localeSaga } from './locale.saga'
import {
  selectLocale,
} from './locale.selectors'

function configureStoreWithLocale(
  params: {
    dependencies?: PatialAppDependencies;
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
    sagas: [localeSaga],
  })
}

describe('Locale', () => {
  it(`
    Given the site has loaded
    If user has no local saved in storage
    Then the default locale should be the browser's locale
      And the locale should be saved in storage
  `, async () => {
    const localeStorage = new TestLocaleStorage()
    const localeBrowser = new TestLocaleBrowser()
    localeStorage.getSavedLocale.mockReturnValueOnce(null)
    localeBrowser.getBrowserLocale.mockReturnValueOnce(fakeLocale1)
    localeStorage.storeLocale.mockReturnValueOnce()

    const store = configureStoreWithLocale({ dependencies: { localeStorage, localeBrowser } })
    store.dispatch(publicActions.getLocale())

    await store.waitForActionEnd()

    expect(selectLocale(store.getState())).toEqual(fakeLocale1)
  })

  it(`
    Given the site has loaded
    If the user has a saved locale
    Then the locale should be the one saved in storage
  `, async () => {
    const localeStorage = new TestLocaleStorage()
    const localeBrowser = new TestLocaleBrowser()
    localeStorage.getSavedLocale.mockReturnValueOnce(fakeLocale1)
    localeBrowser.getBrowserLocale.mockReturnValueOnce(fakeLocale2)

    const store = configureStoreWithLocale({ dependencies: { localeStorage, localeBrowser } })
    store.dispatch(publicActions.getLocale())

    await store.waitForActionEnd()

    expect(selectLocale(store.getState())).toEqual(fakeLocale1)
  })

  it(`
    Given a locale has been loaded
    If the user changes the language
    Then the corresponding locale should be saved in storage
      And the locale should be the chosen one
  `, async () => {
    const localeStorage = new TestLocaleStorage()

    localeStorage.getSavedLocale.mockReturnValueOnce(fakeLocale1)

    localeStorage.storeLocale.mockReturnValueOnce()

    const store = configureStoreWithLocale({ dependencies: { localeStorage } })

    store.dispatch(publicActions.getLocale())

    store.dispatch(publicActions.setLocale({ locale: fakeLocale2 }))

    await store.waitForActionEnd()

    expect(selectLocale(store.getState())).toEqual(fakeLocale2)
  })
})

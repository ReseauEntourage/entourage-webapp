import { call, put, getContext } from 'redux-saga/effects'
import { CallReturnType } from '../../utils/CallReturnType'
import { takeEvery } from 'src/core/utils/takeEvery'
import { ILocaleBrowser } from './ILocaleBrowser'
import { ILocaleStorage } from './ILocaleStorage'
import { ActionType, actions, Actions } from './locale.actions'
import { LocaleState } from './locale.reducer'

interface AppState {
  locale: LocaleState;
}

export interface Dependencies {
  localeStorage: ILocaleStorage;
  localeBrowser: ILocaleBrowser;
}

function* getLocale() {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { localeStorage } = dependencies

  const locale: CallReturnType<typeof String> = yield call(
    localeStorage.getSavedLocale,
  )

  if (!locale) {
    yield put(actions.getBrowserLocale())
  } else {
    yield put(actions.setLocaleSucceeded({ locale }))
  }
}

// function* getBrowserLocale() {
//   const dependencies: Dependencies = yield getContext('dependencies')
//   const { localeBrowser } = dependencies

//   const response: CallReturnType<typeof String> = yield call(
//     localeBrowser.getBrowserLocale,
//   )
//   yield put(actions.setLocale({ locale: response }))
// }

// function* setLocale(action: Actions['setLocale']) {
//   const dependencies: Dependencies = yield getContext('dependencies')
//   const { localeStorage } = dependencies
//   const { payload: { locale } } = action
//   yield call(localeStorage.storeLocale, locale)

//   yield put(actions.setLocaleSucceeded({ locale }))
// }

// export function* localeSaga() {
//   yield takeEvery(ActionType.GET_LOCALE, getLocale)

//   yield takeEvery(ActionType.GET_BROWSER_LOCALE, getBrowserLocale)

//   yield takeEvery(ActionType.SET_LOCALE, setLocale)
// }

function* initLocale() {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { localeStorage } = dependencies

  const locale: localeStorage.getSavedLocale() || localeBrowser.getBrowserLocale()

  yield put(setLocale(locale))
}

function* saveLocalToColdStorage(action: Actions['setLocale']) {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { localeStorage } = dependencies
  const { payload: { locale } } = action
  yield call(localeStorage.storeLocale, locale)
}

export function* localeSaga() {
  yield takeEvery(ActionType.INIT_LOCALE, initLocale)
  yield takeEvery(ActionType.SET_LOCALE, saveLocalToColdStorage)
}

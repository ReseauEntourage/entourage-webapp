import { call, put, getContext } from 'redux-saga/effects'
import { allowedLocales, defaultLocale } from '../../../i18n'
import { takeEvery } from 'src/core/utils/takeEvery'
import { IDeviceLocale } from './IDeviceLocale'
import { ILocaleStorage } from './ILocaleStorage'
import { ActionType, actions, Actions } from './locale.actions'

export interface Dependencies {
  localeStorage: ILocaleStorage;
  deviceLocale: IDeviceLocale;
}

function* initLocale() {
  const dependencies: Dependencies = yield getContext('dependencies')
  const { localeStorage, deviceLocale } = dependencies

  let locale = localeStorage.getSavedLocale() || deviceLocale.getDeviceLocale()

  if (!allowedLocales.includes(locale)) {
    locale = defaultLocale
  }

  yield put(actions.setLocale({ locale }))
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

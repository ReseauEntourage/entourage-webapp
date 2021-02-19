/* eslint-disable global-require, @typescript-eslint/no-var-requires */
import { Reducer } from 'redux'
import { isSSR } from 'src/utils/misc'

export function persistReducer(key: string, reducer: Reducer, options = {}): Reducer {
  if (!isSSR) {
    const { persistReducer: basePersistReducer } = require('redux-persist')
    const storage = require('redux-persist/lib/storage').default
    return basePersistReducer(
      {
        key,
        storage,
        ...options,
      },
      reducer,
    )
  }
  return reducer
}

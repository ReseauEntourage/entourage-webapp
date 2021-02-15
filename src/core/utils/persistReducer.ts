import { Reducer } from 'redux'
import { persistReducer as basePersistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { isSSR } from 'src/utils/misc'

export function persistReducer(key: string, reducer: Reducer, options = {}): Reducer {
  if (!isSSR) {
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

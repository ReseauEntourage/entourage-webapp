import { StateFromReducersMapObject } from 'redux'
import { authUserReducer } from './authUser'
import { feedReducer } from './feed'

export const reducers = {
  authUser: authUserReducer,
  feed: feedReducer,
}

export type AppState = StateFromReducersMapObject<typeof reducers>
export type PartialAppState = Partial<AppState>

export const defaultInitialAppState = Object.keys(reducers).reduce((acc, reducerName) => {
  return {
    ...acc,
    // @ts-expect-error
    [reducerName]: reducers[reducerName](undefined, {}),
  }
}, {} as AppState)

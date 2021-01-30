import { StateFromReducersMapObject } from 'redux'
import { authUserReducer } from './authUser'
import { feedReducer } from './feed'
import { poisReducer } from './pois'
import { positionReducer } from './position'

export const reducers = {
  authUser: authUserReducer,
  feed: feedReducer,
  pois: poisReducer,
  position: positionReducer,
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

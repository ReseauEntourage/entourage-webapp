import { StateFromReducersMapObject } from 'redux'
import { authUserReducer } from './authUser'
import { feedReducer } from './feed'
import { locationReducer } from './location'
import { messagesReducer } from './messages'
import { notificationsReducer } from './notifications'
import { poisReducer } from './pois'

export const reducers = {
  authUser: authUserReducer,
  feed: feedReducer,
  pois: poisReducer,
  location: locationReducer,
  messages: messagesReducer,
  notifications: notificationsReducer,
}

export type AppState = StateFromReducersMapObject<typeof reducers>
export type PartialAppState = Partial<AppState>

export const defaultInitialAppState = Object.keys(reducers).reduce((acc, reducerName) => {
  return {
    ...acc,
    // @ts-expect-error output type already defined
    [reducerName]: reducers[reducerName](undefined, {}),
  }
}, {} as AppState)

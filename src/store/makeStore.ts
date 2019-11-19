import { createStore, combineReducers } from 'redux'
import { createReducers } from 'react-resources-store'
import { schemaRelations } from './schemaRelations'

/**
* @param {object} initialState
* @param {boolean} options.isServer indicates whether it is a server side or client side
* @param {Request} options.req NodeJS Request object (not set when client applies initialState from server)
* @param {Request} options.res NodeJS Request object (not set when client applies initialState from server)
* @param {boolean} options.debug User-defined debug mode param
* @param {string} options.storeKey This key will be used to preserve store in global namespace for safe HMR
*/
export function makeStore(initialState: {} /* , options: any */) {
  const reducers = combineReducers(createReducers(schemaRelations))

  const enhancer = typeof window !== 'undefined'
  // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    && window.__REDUX_DEVTOOLS_EXTENSION__
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    && window.__REDUX_DEVTOOLS_EXTENSION__()

  return createStore(
    reducers,
    initialState,
    enhancer || undefined,
  )
}

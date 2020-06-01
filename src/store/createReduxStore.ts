import { applyMiddleware, createStore, combineReducers, ReducersMapObject } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { AnyToFix } from 'src/utils/types'

interface CreateReduxStoreArgs {
  dependencies: AnyToFix;
  epics: AnyToFix;
  initialState?: AnyToFix;
  reducers: ReducersMapObject<AnyToFix, AnyToFix>;
}

export const createReduxStore = (args: CreateReduxStoreArgs) => {
  const { dependencies, reducers, epics, initialState = {} } = args

  const epicMiddleware = createEpicMiddleware(
    { dependencies },
  )

  const rootEpic = combineEpics<AnyToFix>(
    ...epics,
  )

  const store = createStore(
    combineReducers({ ...reducers }),
    initialState,
    composeWithDevTools(applyMiddleware(epicMiddleware)),
  )

  epicMiddleware.run(rootEpic)

  return store
}

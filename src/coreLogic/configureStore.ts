import {
  createStore,
  combineReducers,
  applyMiddleware,
  StateFromReducersMapObject,
  ActionFromReducersMapObject,
  Store,
  PreloadedState,
  compose,
} from 'redux'
import createSagaMiddleware, { Saga } from 'redux-saga'
import { all, call } from 'redux-saga/effects'
import { AnyCantFix } from 'src/utils/types'

interface ConfigureStoreParams<R> {
  dependencies?: {
    [key: string]: AnyCantFix;
  };
  reducers: R;
  sagas?: Saga[];
  initialState?: PreloadedState<StateFromReducersMapObject<R>>;
}

export function configureStore<
  Reducers,
  Output = Store<StateFromReducersMapObject<Reducers>, ActionFromReducersMapObject<Reducers>>
>(params: ConfigureStoreParams<Reducers>): Output {
  const { dependencies, reducers, sagas = [], initialState } = params

  const sagaMiddleware = createSagaMiddleware({
    context: {
      dependencies,
    },
  })

  const rootReducer = combineReducers(reducers)

  const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose

  const enhancer = composeEnhancers(
    applyMiddleware(sagaMiddleware),
  )

  const store = createStore(
    rootReducer,
    initialState,
    enhancer,
  )

  function* rootSaga() {
    yield all(sagas.map(call))
  }

  sagaMiddleware.run(rootSaga)

  // @ts-expect-error
  return store
}

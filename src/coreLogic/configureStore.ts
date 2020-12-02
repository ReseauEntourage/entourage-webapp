import {
  createStore,
  combineReducers,
  applyMiddleware,
  StateFromReducersMapObject,
  ActionFromReducersMapObject,
  Store,
  PreloadedState,
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

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(sagaMiddleware),
  )

  function* rootSaga() {
    yield all(sagas.map(call))
  }

  sagaMiddleware.run(rootSaga)

  // @ts-expect-error
  return store
}

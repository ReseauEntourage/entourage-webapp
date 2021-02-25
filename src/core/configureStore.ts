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

const dev = process.env.NODE_ENV !== 'production'

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
  Output = Store<
  StateFromReducersMapObject<Reducers>,
  ActionFromReducersMapObject<Reducers>
  > & { waitForActionEnd(): Promise<void>; }
>(params: ConfigureStoreParams<Reducers>): Output {
  const { dependencies, reducers, sagas = [], initialState } = params

  let sagaRunningCount = 0

  function startAction() {
    sagaRunningCount += 1
  }

  function endAction() {
    sagaRunningCount -= 1
  }

  const sagaMiddleware = createSagaMiddleware({
    context: {
      dependencies,
      startAction,
      endAction,
    },
  })

  const rootReducer = combineReducers(reducers)

  const composeEnhancers = dev && typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
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

  function waitForActionEnd() {
    return new Promise<void>((resolve) => {
      if (sagaRunningCount === 0) {
        resolve()
      } else {
        const timer = setInterval(() => {
          if (sagaRunningCount === 0) {
            clearInterval(timer)
            resolve()
          }
        }, 50)
      }
    })
  }

  // @ts-expect-error
  store.waitForActionEnd = waitForActionEnd

  // @ts-expect-error
  return store
}

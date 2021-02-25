import { getContext, takeEvery as takeEveryBase } from 'redux-saga/effects'

function trackTake<A>(fn: (action: A) => void) {
  return function* saga(action: A) {
    const startAction: () => void = yield getContext('startAction')
    const endAction: () => void = yield getContext('endAction')
    startAction()
    yield fn(action)
    endAction()
  }
}

export function takeEvery<A extends { type: string; }>(actionType: A['type'], saga: (action: A) => void) {
  return takeEveryBase(actionType, trackTake(saga))
}

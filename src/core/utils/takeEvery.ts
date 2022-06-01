import { getContext, takeEvery as takeEveryBase } from 'redux-saga/effects'
import { AnyGeneratorOutput } from 'src/utils/types'

function trackTake<A>(fn: (action: A) => void) {
  return function* saga(action: A): AnyGeneratorOutput {
    const startAction = yield getContext('startAction')
    const endAction = yield getContext('endAction')
    startAction()
    yield fn(action)
    endAction()
  }
}

export function takeEvery<A extends { type: string; }>(actionType: A['type'], saga: (action: A) => void) {
  return takeEveryBase(actionType, trackTake(saga))
}

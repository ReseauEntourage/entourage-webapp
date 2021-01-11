import { normalize } from 'normalizr'
import { call, put, race, take, getContext } from 'redux-saga/effects'
import { api, schema } from 'src/core/api'
import { ACTION_API_KEY_STARTED, ApiAction } from 'src/core/utils/createApiPayload'
import { takeEvery } from 'src/core/utils/takeEvery'
import { AnyCantFix } from 'src/utils/types'
import { IApiGateway } from './IApiGateway'

export interface Dependencies {
  apiGateway: IApiGateway;
}

type ActionWithPayloadApi = ApiAction

function actionIsApi(action: AnyCantFix): action is ActionWithPayloadApi {
  return action.payload?.ACTION_API_KEY === ACTION_API_KEY_STARTED
}

function* actionSaga(action: AnyCantFix) {
  if (!actionIsApi(action)) {
    return
  }

  const dependencies: Dependencies = yield getContext('dependencies')
  const { apiGateway } = dependencies

  if (!action.types || !action.types[0] || !action.types[1]) {
    throw new Error(`types array for api action is invalid on redux action ${action.type}`)
  }

  const [successActionType, failActionType] = action.types

  let response
  let responseType
  let ACTION_API_KEY
  let entities
  let result

  try {
    const raceData = yield race({
      response: call(apiGateway.request, action.payload),
      sameAction: take(action.type),
    })

    if (raceData.response) {
      response = raceData.response
      responseType = successActionType
      ACTION_API_KEY = 'ACTION_API_KEY_SUCCEEDED'
      const normalizedData = normalize(response.data, schema[action.payload.name].normalizrSchema())
      entities = normalizedData.entities
      result = normalizedData.result
    }
  } catch (error) {
    const isServerError = !!error?.response?.status

    if (isServerError) {
      response = error.response
      responseType = failActionType
      ACTION_API_KEY = 'ACTION_API_KEY_FAILED'
    } else {
      throw error
    }
  }

  if (response) {
    yield put({
      type: responseType,
      response,
      apiMeta: {
        ACTION_API_KEY,
        payload: action.payload,
        entities,
        result,
      },
    })
  }
}

export function* entitiesSaga() {
  yield takeEvery('*', actionSaga)
}

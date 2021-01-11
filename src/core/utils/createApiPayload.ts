import { AxiosResponse } from 'axios'
import { RequestName, RequestConfig, RequestResponse, RequestError } from 'src/core/api'
import { AnyCantFix } from 'src/utils/types'

export const ACTION_API_KEY_STARTED = 'ACTION_API_KEY_STARTED'

export function createApiPayload<R extends RequestName>(
  config: RequestConfig<R>,
) {
  return {
    ...config,
    ACTION_API_KEY: ACTION_API_KEY_STARTED,
  }
}

export type ApiAction = {
  type: string;
  payload: ReturnType<typeof createApiPayload>;
  types: [string, string];
}

export type GetSuccessAction<Fn extends (arg?: AnyCantFix) => AnyCantFix> = {
  type: ReturnType<Fn>['types'][0];
  response: AxiosResponse<RequestResponse<ReturnType<Fn>['payload']['name']>>;
}

export type GetFailAction<Fn extends (arg?: AnyCantFix) => AnyCantFix> = {
  type: ReturnType<Fn>['types'][1];
  response: AxiosResponse<RequestError<ReturnType<Fn>['payload']['name']>>;
}

export type ActionFromApiAction<Fn extends (arg?: AnyCantFix) => AnyCantFix> =
  | ReturnType<Fn>
  | GetSuccessAction<Fn>
  | GetFailAction<Fn>

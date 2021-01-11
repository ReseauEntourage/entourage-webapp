import { api } from 'src/core/api'

export interface IApiGateway {
  request: typeof api.request;
}

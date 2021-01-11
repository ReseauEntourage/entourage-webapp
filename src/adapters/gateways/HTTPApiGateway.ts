import { api } from 'src/core/api'
import { IApiGateway } from 'src/core/useCases/entities'

export class HTTPApiGateway implements IApiGateway {
  request = api.request
}

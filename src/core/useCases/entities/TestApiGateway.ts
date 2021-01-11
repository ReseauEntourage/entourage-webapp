import { AxiosResponse } from 'axios'
import { Response } from 'typescript-request-schema'
import { RequestName, Schema, Request } from 'src/core/api'
import { jestFn, JestFn } from 'src/core/utils/jestFn'

export class TestApiGateway {
  routes = {} as { [R in RequestName]: JestFn<Promise<Partial<AxiosResponse<Response<R, Schema>>>>>; }

  mockRoute<R extends RequestName>(route: R) {
    if (!this.routes[route]) {
      this.routes[route] = jestFn(route)
    }
    return this.routes[route] as JestFn<Promise<Partial<AxiosResponse<Response<R, Schema>>>>>
  }

  // @ts-expect-error
  request: Request = (config) => {
    if (!this.routes[config.name]) {
      throw new Error(`Route config.name is not mocked. Use apiService.mockRoue('${config.name}')`)
    }
    return this.routes[config.name](config)
  }
}

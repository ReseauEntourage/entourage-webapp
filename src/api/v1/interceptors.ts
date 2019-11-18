import { AxiosInstance } from 'axios'
import humps from 'humps'
import { getTokenFromCookies } from './services/authToken'

export function addAxiosInterceptors(client: AxiosInstance) {
  let userToken: string | void

  function getUserToken(): string | void {
    if (userToken) {
      return userToken
    }

    userToken = getTokenFromCookies()

    return userToken
  }

  client.interceptors.request.use((request) => ({
    ...request,
    params: {
      ...humps.decamelizeKeys(request.params || {}),
      token: getUserToken() || undefined,
    },
    data: request.data && humps.decamelizeKeys(request.data),
  }))

  client.interceptors.response.use((response) => ({
    ...response,
    data: response.data && humps.camelizeKeys(response.data),
  }))
}

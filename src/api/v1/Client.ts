import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise } from 'axios'
import humps from 'humps'
import { getTokenFromCookies } from './services/authToken'

export class Client {
  private axios: AxiosInstance

  private userToken = getTokenFromCookies()

  constructor(baseURL: string) {
    this.axios = axios.create({
      baseURL,
    })

    this.axios.interceptors.request.use((request) => ({
      ...request,
      params: {
        ...request.params,
        token: this.getUserToken() || undefined,
      },
      data: request.data && humps.decamelizeKeys(request.data),
    }))

    this.axios.interceptors.response.use((response) => ({
      ...response,
      data: response.data && humps.camelizeKeys(response.data),
    }))
  }

  private getUserToken(): string | void {
    if (this.userToken) {
      return this.userToken
    }

    this.userToken = getTokenFromCookies()

    return this.userToken
  }

  request<Data = unknown>(axiosRequestConfig: AxiosRequestConfig): AxiosPromise<Data> {
    return this.axios.request(axiosRequestConfig)
  }
}

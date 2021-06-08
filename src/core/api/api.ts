import axios, { AxiosRequestConfig, AxiosPromise, Method } from 'axios'
import { Config, Response } from 'typescript-request-schema'
import { env } from 'src/core/env'
import { AnyToFix } from 'src/utils/types'
import { addAxiosInterceptors } from './interceptors'
import { schema, TypeScriptRequestSchemaConf } from './schema'

type Schema = typeof schema
type RequestName = keyof Schema
type ExtraConfig = AxiosRequestConfig
type RequestConfig<T extends RequestName> = Config<T, Schema, ExtraConfig, TypeScriptRequestSchemaConf>
type RequestResponse<T extends RequestName> = AxiosPromise<Response<T, Schema>>
type Request = <T extends RequestName>(config: RequestConfig<T>) => RequestResponse<T>

const axiosInstance = axios.create({
  baseURL: env.API_V1_URL,
})

const request: Request = (config) => {
  const {
    name,
    pathParams,
    data,
    params,
    ...restConfig
  } = config

  const { url, method } = schema[name]

  const urlWithPathParams = typeof url === 'function'
    ? url(pathParams as AnyToFix)
    : url

  return axiosInstance.request({
    url: urlWithPathParams,
    method: method as Method,
    data,
    params,
    ...restConfig,
  })
}

addAxiosInterceptors(axiosInstance)

type APIInstance = {
  request: typeof request;
}

export const api: APIInstance = {
  request,
}

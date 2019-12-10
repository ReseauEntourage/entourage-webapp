import axios, { AxiosRequestConfig, AxiosPromise } from 'axios'
import { NextPageContext } from 'next'
import { ObjectParams, FnParams, Extends } from 'typescript-object-schema'
import { env } from 'src/core'
import { createAnonymousUser, getTokenFromCookies } from 'src/network/services'
import { AnyToFix } from 'src/types'
import { addAxiosInterceptors } from './interceptors'
import { schema } from './schema'

type Schema = typeof schema
type SchemaKeys = keyof Schema

type Config<T extends SchemaKeys> =
  { name: T; }
  & FnParams<Schema[T], 'url', 'pathParams'>
  & ObjectParams<Schema[T], 'params'>
  & ObjectParams<Schema[T], 'data'>
  & Extends<Schema[T], AxiosRequestConfig>

type Request = <T extends SchemaKeys>(config: Config<T>) => AxiosPromise<Schema[T]['response']>

const axiosInstance = axios.create({ baseURL: env.API_V1_URL })

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
    method,
    data,
    params,
    ...restConfig,
  })
}

addAxiosInterceptors(axiosInstance)

type APIInstanceWithSSR = {
  request: typeof request;
  ssr: (ctx: NextPageContext) => {
    request: typeof request;
  };
}

export const api: APIInstanceWithSSR = {
  request,
  ssr: (ctx) => ({
    request: async (config) => {
      const token = getTokenFromCookies(ctx) || await createAnonymousUser(ctx)

      const configWithToken = {
        ...config,
        params: {
          // @ts-ignore
          ...(config.params || {}),
          token,
        },
      }

      return request(configWithToken)
    },
  }),
}

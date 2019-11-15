import { AxiosPromise, AxiosRequestConfig } from 'axios'
import { compile, pathToRegexp } from 'path-to-regexp'
import { Schema } from './Schema'
import { Client } from './Client'

type SchemaKeys = keyof typeof Schema
type GetType<Key extends SchemaKeys> = typeof Schema[Key]['type']

interface AxiosRequestConfigBase<Key extends SchemaKeys> {
  params: GetType<Key>['params'];
  data: GetType<Key>['body'];
}

type AxiosRequestConfigOmit<Key extends SchemaKeys> =
  GetType<Key>['params'] extends void
    ? GetType<Key>['body'] extends void
      ? AxiosRequestConfig
      : Omit<AxiosRequestConfigBase<Key>, 'params'>
    : GetType<Key>['body'] extends void
      ? Omit<AxiosRequestConfigBase<Key>, 'data'>
      : AxiosRequestConfigBase<Key>

type AxiosRequestConfigFinal<Key extends SchemaKeys> = AxiosRequestConfigOmit<Key>

export function createResource<Key extends SchemaKeys>(
  client: Client,
  ApiKey: Key,
): ((config: AxiosRequestConfigFinal<Key>) => AxiosPromise<GetType<Key>['response']>) {
  return (config) => {
    const { path, method } = Schema[ApiKey]
    const toPath = compile(path)
    // @ts-ignore
    const nextParams = { ...(config || {}).params }
    const url = toPath(nextParams)
    const keys: {name: string;}[] = []
    // @ts-ignore
    pathToRegexp(path, keys)

    keys.forEach((key) => {
      delete nextParams[key.name]
    })

    const finalConfig = {
      ...config,
      url,
      method,
      params: nextParams,
    }

    return client.request(finalConfig as AxiosRequestConfig)
  }
}

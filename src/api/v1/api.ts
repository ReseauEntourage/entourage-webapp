import { AxiosInstance } from 'axios'
import { createAxiosInstance } from 'request-schema'
import { env } from 'src/core/env'
import { schema } from './schema'
import { addAxiosInterceptors } from './interceptors'

const axiosInstance = createAxiosInstance({ baseURL: env.API_V1_URL }, schema)
addAxiosInterceptors(axiosInstance as AxiosInstance)

export const api = axiosInstance

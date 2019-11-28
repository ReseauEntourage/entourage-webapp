import { AxiosInstance } from 'axios'
import { NextPageContext } from 'next'
import { createAxiosInstance } from 'request-schema'
import { env } from 'src/core'
import { createAnonymousUser, getTokenFromCookies } from 'src/network/services'
import { schema } from './schema'
import { addAxiosInterceptors } from './interceptors'

const axiosInstance = createAxiosInstance({ baseURL: env.API_V1_URL }, schema)
addAxiosInterceptors(axiosInstance as AxiosInstance)

type InstanceWithSSR = typeof axiosInstance & {
  ssr: (ctx: NextPageContext) => {
    request: typeof axiosInstance['request'];
  };
}

export const api: InstanceWithSSR = {
  ...axiosInstance,
  ssr: (ctx) => ({
    request: async (config) => {
      const token = getTokenFromCookies(ctx) || await createAnonymousUser(ctx)

      const configWithToken = {
        ...config,
        params: {
          ...(config.params || {}),
          token,
        },
      }

      return axiosInstance.request(configWithToken)
    },
  }),
}
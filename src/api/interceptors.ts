import { AxiosInstance } from 'axios'
import humps from 'humps'
import { env } from 'src/core'
import { notifServerError } from 'src/utils'
import { getTokenFromCookies } from './services/authToken'

export function addAxiosInterceptors(client: AxiosInstance) {
  function getUserToken(): string | void {
    // TODO: improve with token cache in memory for browser side
    return getTokenFromCookies()
  }

  client.interceptors.request.use((request) => {
    const { params = {} } = request

    return {
      ...request,
      params: {
        ...humps.decamelizeKeys(request.params || {}),
        token: params.token || getUserToken(),
        api_key: env.API_KEY, // eslint-disable-line
      },
      data: request.data && humps.decamelizeKeys(request.data),
    }
  })

  client.interceptors.response.use(
    (response) => {
      return {
        ...response,
        data: response.data && humps.camelizeKeys(response.data),
      }
    },
    (error) => {
      console.error(error)

      if (error.response && error.response.status >= 500) {
        const errorMessage = `\n${error.response.status} SERVER ERROR: ${error.request.path}\n`
        console.error(errorMessage)
        throw errorMessage
      }

      const timer = setTimeout(() => {
        notifServerError(error)
      }, 500)

      // eslint-disable-next-line
      error.stopPropagation = () => {
        clearTimeout(timer)
      }

      throw error
    },
  )
}

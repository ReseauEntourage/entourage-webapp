import { AppState } from '../../AppState'
import { User } from '../../models/User.model'
import { retrieveAuthUserRequestName } from './users.actions'

export function getAuthUserIsLogging(state: AppState): boolean {
  const request = state.users.requests[retrieveAuthUserRequestName]

  if (!request) return false

  return request.status === 'PENDING'
}

export function getAuthUser(state: AppState): null | User {
  const { authUserId } = state

  if (!authUserId) return null

  return state.users.resources[authUserId]
}

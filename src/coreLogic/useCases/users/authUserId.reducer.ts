import { UserActions } from './users.actions'

type AuthUserId = number | null

export function authUserIdReducer(state: AuthUserId = null, action: UserActions): AuthUserId {
  if (
    action.type === 'READ_RESOURCES_SUCCEEDED'
    && action.resourceType === 'users'
    && action.requestName === 'retrieveAuthUser'
  ) {
    return action.resources?.[0]?.id || null
  }

  if (action.type === 'AUTH_USER_LOGOUT') {
    return null
  }

  return state
}

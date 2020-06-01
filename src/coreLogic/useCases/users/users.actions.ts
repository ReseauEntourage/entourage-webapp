import { User } from '../../models/User.model'
import { ReduxResourceAction } from 'src/store'

const resourceType = 'users'

export const retrieveAuthUserRequestName = 'retrieveAuthUser'

type ResourceType = typeof resourceType
type RequestName = typeof retrieveAuthUserRequestName

interface RetrieveAuthUserPending extends ReduxResourceAction {
  requestKey: RequestName;
  requestName: RequestName;
  resourceType: ResourceType;
  type: 'READ_RESOURCES_PENDING';
}

interface RetrieveAuthUserSuccess extends ReduxResourceAction {
  requestKey: RequestName;
  requestName: RequestName;
  resourceType: ResourceType;
  resources: User[];
  type: 'READ_RESOURCES_SUCCEEDED';
}

interface LogoutAuthUser {
  type: 'AUTH_USER_LOGOUT';
}

export type UserActions =
  | RetrieveAuthUserPending
  | RetrieveAuthUserSuccess
  | LogoutAuthUser

export function retrieveAuthUser(): RetrieveAuthUserPending {
  return {
    type: 'READ_RESOURCES_PENDING',
    resourceType,
    requestName: retrieveAuthUserRequestName,
    requestKey: retrieveAuthUserRequestName,
  }
}

export const retrieveAuthUserSuccess = (authUser: User | null): RetrieveAuthUserSuccess => {
  return {
    type: 'READ_RESOURCES_SUCCEEDED',
    resourceType,
    requestName: retrieveAuthUserRequestName,
    requestKey: retrieveAuthUserRequestName,
    resources: authUser ? [authUser] : [],
  }
}

export const authUserLogout = (): LogoutAuthUser => {
  return {
    type: 'AUTH_USER_LOGOUT',
  }
}

export const publicActions = {
  retrieveAuthUser,
}

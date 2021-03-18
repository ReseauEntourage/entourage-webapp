import { AuthUserState } from './authUser.reducer'

interface AppState {
  authUser: AuthUserState;
}

export function selectIsLogging(state: AppState) {
  return state.authUser.isLogging
}

export function selectStep(state: AppState) {
  return state.authUser.step
}

export function selectIsLogged(state: AppState) {
  return !!state.authUser.user
}

export function selectUser(state: AppState) {
  return state.authUser.user
}

export function selectUserIsUpdating(state: AppState) {
  return state.authUser.userUpdating
}

export function selectUserInfosAreIncomplete(state: AppState) {
  const { user } = state.authUser
  if (user) {
    const { firstName, lastName, address } = user

    return !firstName || !lastName || !address
  }
  return true
}

export function selectErrors(state: AppState) {
  return state.authUser.errors
}

export function selectLoginIsCompleted(state: AppState) {
  return state.authUser.loginIsCompleted
}

export function selectShowSensitizationPopup(state: AppState) {
  return state.authUser.showSensitizationPopup
}


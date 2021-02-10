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

export function selectErrors(state: AppState) {
  return state.authUser.errors
}

export function selectLoginStepIsCompleted(state: AppState) {
  return !state.authUser.step
}

export function selectShowSensitizationPopup(state: AppState) {
  return state.authUser.showSensitizationPopup
}


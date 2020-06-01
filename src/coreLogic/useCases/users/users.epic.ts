import { ActionsObservable, StateObservable } from 'redux-observable'
import { map, switchMap, filter } from 'rxjs/operators'
import { AppState } from '../../AppState'
import { EntourageGateway } from '../../gateways/EntourageGateway.interface'
import { UserActions, retrieveAuthUserSuccess } from './users.actions'

export const retrieveAuthUserEpic = (
  action$: ActionsObservable<UserActions>,
  state$: StateObservable<AppState>,
  { entourageGateway }: { entourageGateway: EntourageGateway; },
) => action$.pipe(
  filter((action) => {
    return action.type === 'READ_RESOURCES_PENDING'
      && action.resourceType === 'users'
      && action.requestName === 'retrieveAuthUser'
  }),
  switchMap(() => entourageGateway.authenticateUser().pipe(
    map((user): UserActions => {
      if (user?.id) {
        return retrieveAuthUserSuccess(user)
      }

      return retrieveAuthUserSuccess(null)
    }),
  )),
)

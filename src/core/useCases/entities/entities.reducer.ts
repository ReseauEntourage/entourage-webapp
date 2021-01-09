import produce from 'immer'
import { Action as FeedAction, ActionType as FeedActionType } from '../feed'
import { Action, EntitiesActionType } from './entities.actions'
import {
  Entourage,
  User,
} from './models'

interface Entity<T> {
  [key: string]: T;
}

export interface EntitiesState {
  entourages: Entity<Entourage>;
  users: Entity<User>;
}

export const defaultEntitiesState: EntitiesState = {
  entourages: {},
  users: {},
}

export function entitiesReducer(
  state: EntitiesState = defaultEntitiesState,
  action: Action | FeedAction,
): EntitiesState {
  switch (action.type) {
    case EntitiesActionType.UPDATE_ENTITIES: {
      return produce(state, (draftState) => {
        Object.entries(action.payload.entities).forEach(([entityName, entityResources]) => {
          const draftEntityResources = draftState[entityName as keyof EntitiesState]

          Object.entries(entityResources || {}).forEach(([entityId, nextEntity]) => {
            const prevEntity = draftEntityResources[entityId]

            draftEntityResources[entityId] = {
              ...prevEntity,
              ...nextEntity,
            }
          })
        })
      })
    }

    case FeedActionType.JOIN_ENTOURAGE_SUCCEEDED: {
      return {
        ...state,
        entourages: produce(state.entourages, (entourage) => {
          const item = entourage[action.payload.entourageUuid]
          item.joinStatus = action.payload.status
        }),
      }
    }

    case FeedActionType.LEAVE_ENTOURAGE_SUCCEEDED: {
      return {
        ...state,
        entourages: produce(state.entourages, (entourage) => {
          const item = entourage[action.payload.entourageUuid]
          item.joinStatus = 'not_requested'
        }),
      }
    }

    case FeedActionType.CLOSE_ENTOURAGE_SUCCEEDED: {
      return {
        ...state,
        entourages: produce(state.entourages, (entourages) => {
          const item = entourages[action.payload.entourageUuid]
          item.status = 'closed'
        }),
      }
    }

    case FeedActionType.REOPEN_ENTOURAGE_SUCCEEDED: {
      return {
        ...state,
        entourages: produce(state.entourages, (entourages) => {
          const item = entourages[action.payload.entourageUuid]
          item.status = 'open'
        }),
      }
    }

    default:
      return state
  }
}

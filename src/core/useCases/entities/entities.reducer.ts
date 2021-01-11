import produce from 'immer'
import { Action as FeedAction, ActionType as FeedActionType } from '../feed'
import { schema } from 'src/core/api'
import { assertIsDefined } from 'src/utils/misc'
import { Action, EntitiesActionType } from './entities.actions'
import { entitiesSchema } from './entities.schemas'
import {
  Entourage,
  User,
} from './models'

interface Entity<T> {
  [key: string]: T;
}

interface ApiAction {
  type: 'UNUSED_KEY';
  apiMeta: {
    ACTION_API_KEY: 'ACTION_API_KEY_SUCCEEDED' | 'ACTION_API_KEY_FAILED';
    payload: {
      name: string;
    };
  };
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
  action: Action | FeedAction | ApiAction,
): EntitiesState {
  // @ts-expect-error
  if (action.apiMeta?.ACTION_API_KEY === 'ACTION_API_KEY_SUCCEEDED') {
    return produce(state, (draftState) => {
      // @ts-expect-error
      Object.entries(action.apiMeta.entities).forEach(([entityName, entityResources]) => {
        // @ts-expect-error
        const entitySchema = entitiesSchema[entityName]
        assertIsDefined(schema, `normalize schema doesn't exist for entity ${entityName}`)

        const draftEntityResources = draftState[entityName as keyof EntitiesState]

        // @ts-expect-error
        Object.entries(entityResources || {}).forEach(([entityId, nextEntity]) => {
          const prevEntity = draftEntityResources[entityId]

          // eslint-disable-next-line
          const mergeStrategy = entitySchema._mergeStrategy || ((a: any, b: any) => ({ ...a, ...b }))
          draftEntityResources[entityId] = mergeStrategy(prevEntity, nextEntity)
        })
      })
    })
  }

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

import { ActionFromMapObject, ActionsFromMapObject } from 'src/utils/types'
import { EntitiesState } from './entities.reducer'

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export const EntitiesActionType = {
  UPDATE_ENTITIES: 'ENTITIES/UPDATE',
} as const

export type EntitiesActionType = keyof typeof EntitiesActionType;

// ------------------------------------------------------------------------

function updateEntities(
  payload: {
    entities: {
      [P in keyof EntitiesState]?: {
        [key: string]: Partial<EntitiesState[P]>;
      };
    };
  },
) {
  return {
    type: EntitiesActionType.UPDATE_ENTITIES,
    payload,
  }
}

// ------------------------------------------------------------------------

export const publicActions = {
  updateEntities,
}

const privateActions = {}

export const actions = {
  ...publicActions,
  ...privateActions,
}

export type Actions = ActionsFromMapObject<typeof actions>
export type Action = ActionFromMapObject<typeof actions>;

import { schema } from 'normalizr'
import { EntitiesState } from './entities.reducer'

// type EntityName = keyof EntitiesState

function createEntity(
  entityName: keyof EntitiesState,
  idAttribute: 'uuid' | 'id',
) {
  return new schema.Entity(entityName, {}, { idAttribute })
}

export const entourageSchema = createEntity('entourages', 'uuid')
export const userSchema = createEntity('users', 'id')

entourageSchema.define({
  author: userSchema,
})

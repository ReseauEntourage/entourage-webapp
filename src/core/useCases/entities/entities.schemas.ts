import { schema } from 'normalizr'
// import { EntitiesState } from './entities.reducer'

export const entourageSchema = new schema.Entity('entourages', {}, {
  idAttribute: (value) => value.data.uuid,
  mergeStrategy: (entourageA, entourageB) => {
    return {
      ...entourageA,
      ...entourageB,
      data: {
        ...entourageA?.data,
        ...entourageB?.data,
      },
    }
  },
})

export const userSchema = new schema.Entity('users', undefined, { idAttribute: 'id' })

entourageSchema.define({
  data: {
    author: userSchema,
  },
})

export const entitiesSchema = {
  entourages: entourageSchema,
  users: userSchema,
}

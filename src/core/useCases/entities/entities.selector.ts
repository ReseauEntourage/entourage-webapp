import { denormalize, schema as normalizrSchema } from 'normalizr'
import { AppState } from '../reducers'
import { schema as apiSchema } from 'src/core/api'

type NormalizrSchema =
  | normalizrSchema.Entity
  | normalizrSchema.Entity[]
  | { [key: string]: NormalizrSchema; }

export function selectEntities(
  state: AppState,
  ids: string[],
  schema: NormalizrSchema,
) {
  return denormalize(ids, schema, state.entities)
}

export function selectEntitiesFromRequest<R extends keyof typeof apiSchema>(
  state: AppState,
  ids: string[],
  requestName: R,
) {
  // @ts-expect-error
  const schema = apiSchema[requestName].normalizrSchema

  if (!schema) {
    throw new Error(`schema of ${requestName} is undefined`)
  }

  type Output = typeof apiSchema[R]['response']

  return denormalize(schema(ids), schema(), state.entities) as Output
}

import { schema } from './schema'

type Schema = typeof schema

export type RequestResponse<SchemaKeys extends keyof Schema> = Schema[SchemaKeys]['response'];

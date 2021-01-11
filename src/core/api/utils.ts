import { schema } from './schema'

type Schema = typeof schema

export type RequestResponse<SchemaKeys extends keyof Schema> = Schema[SchemaKeys]['response'];
export type RequestError<SchemaKeys extends keyof Schema> = Schema[SchemaKeys]['error'];

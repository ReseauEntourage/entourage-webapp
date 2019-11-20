import { StoreState } from 'react-resources-store'
import * as feeds from './feeds'
import * as pois from './pois'

export const resourcesConfig = {
  feeds,
  pois,
}

export const schemaRelations = {
  feeds: feeds.relations,
  pois: pois.relations,
}

interface ResourcesSchema {
  feeds: feeds.Resource;
  pois: pois.Resource;
}

export type ResourcesState = StoreState<ResourcesSchema>;
export type ResourceType = keyof ResourcesState
export type Resource<T extends ResourceType> = ResourcesSchema[T]
export type ResourceConfig<T extends ResourceType> = (typeof resourcesConfig)[T]

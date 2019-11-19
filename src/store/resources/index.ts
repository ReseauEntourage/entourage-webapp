import { StoreState } from 'react-resources-store'
import * as feeds from './feeds'

interface ResourcesSchema {
  feeds: feeds.Resource;
}

export const resourcesConfig = {
  feeds,
}

export type ResourcesState = StoreState<ResourcesSchema>;
export type ResourceType = keyof ResourcesState
export type Resource<T extends ResourceType> = ResourcesSchema[T]
export type ResourceConfig<T extends ResourceType> = (typeof resourcesConfig)[T]

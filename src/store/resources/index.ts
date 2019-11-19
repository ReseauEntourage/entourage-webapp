import { StoreState } from 'react-resources-store'
import * as Feeds from './feeds'

export * from './feeds'

interface ResourcesSchema {
  feeds: Feeds.FeedResource;
}

export type ResourcesState = StoreState<ResourcesSchema>;

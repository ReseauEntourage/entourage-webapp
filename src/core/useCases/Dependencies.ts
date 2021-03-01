import { Dependencies as AuthUserDependencies } from './authUser'
import { Dependencies as FeedDependencies } from './feed'
import { Dependencies as LocationDependencies } from './location'
import { Dependencies as POIsDependencies } from './pois'

export interface AppDependencies extends
  AuthUserDependencies,
  FeedDependencies,
  POIsDependencies,
  LocationDependencies
{}

export type PartialAppDependencies = Partial<AppDependencies>;

import { Dependencies as AuthUserDependencies } from './authUser'
import { Dependencies as FeedDependencies } from './feed'
import { Dependencies as FirebaseDependencies } from './firebase'
import { Dependencies as LocationDependencies } from './location'
import { Dependencies as POIsDependencies } from './pois'

export interface AppDependencies extends
  AuthUserDependencies,
  FeedDependencies,
  POIsDependencies,
  LocationDependencies,
  FirebaseDependencies
{}

export type PartialAppDependencies = Partial<AppDependencies>;

import { Dependencies as AuthUserDependencies } from './authUser'
import { Dependencies as FeedDependencies } from './feed'
import { Dependencies as FirebaseDependencies } from './firebase'
import { Dependencies as LocationDependencies } from './location'
import { Dependencies as MessagesDependencies } from './messages'
import { Dependencies as POIsDependencies } from './pois'

export interface AppDependencies extends
  AuthUserDependencies,
  FeedDependencies,
  POIsDependencies,
  LocationDependencies,
  FirebaseDependencies,
  MessagesDependencies
{}

export type PartialAppDependencies = Partial<AppDependencies>;

import { Dependencies as AuthUserDependencies } from './authUser'
import { Dependencies as FeedDependencies } from './feed'
import { Dependencies as POIsDependencies } from './pois'

export interface AppDependencies extends AuthUserDependencies, FeedDependencies, POIsDependencies {}

export type PartialAppDependencies = Partial<AppDependencies>;

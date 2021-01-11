import { Dependencies as AuthUserDependencies } from './authUser'
import { Dependencies as EntitiesDependencies } from './entities'
import { Dependencies as FeedDependencies } from './feed'

export interface AppDependencies extends AuthUserDependencies, FeedDependencies, EntitiesDependencies {}

export type PatialAppDependencies = Partial<AppDependencies>;

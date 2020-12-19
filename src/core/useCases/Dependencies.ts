import { Dependencies as AuthUserDependencies } from './authUser'
import { Dependencies as FeedDependencies } from './feed'

export interface AppDependencies extends AuthUserDependencies, FeedDependencies {}

export type PatialAppDependencies = Partial<AppDependencies>;

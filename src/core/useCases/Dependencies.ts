import { Dependencies as AuthUserDependencies } from './authUser'
import { Dependencies as FeedDependencies } from './feed'
import { Dependencies as LocaleDependencies } from './locale'

export interface AppDependencies extends AuthUserDependencies, FeedDependencies, LocaleDependencies {}

export type PatialAppDependencies = Partial<AppDependencies>;

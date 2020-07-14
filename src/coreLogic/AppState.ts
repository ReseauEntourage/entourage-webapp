import { ResourcesState } from 'src/store'
import { Feed } from './models/Feed.model'
import { User } from './models/User.model'

export interface AppState {
  authUserId: number | null;
  feed: Feed;
  users: ResourcesState<User>;
}

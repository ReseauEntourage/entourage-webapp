import { ResourcesState } from 'src/store'
import { User } from './models/User.model'

export interface AppState {
  authUserId: number | null;
  users: ResourcesState<User>;
}

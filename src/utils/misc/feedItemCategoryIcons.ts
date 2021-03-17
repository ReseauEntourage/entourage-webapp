import {
  LocalMall,
  LocalLaundryService,
  People,
  Help,
  MoreHoriz,
  Create,
  SvgIconComponent,
} from '@material-ui/icons'
import { FeedDisplayCategory } from 'src/core/api'

export const feedItemCategoryIcons: Record<FeedDisplayCategory, SvgIconComponent> = {
  info: Help,
  // eslint-disable-next-line @typescript-eslint/camelcase
  mat_help: LocalMall,
  other: MoreHoriz,
  skill: Create,
  social: People,
  resource: LocalLaundryService,
}

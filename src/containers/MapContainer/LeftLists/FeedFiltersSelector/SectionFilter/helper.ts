import FreeBreakfastOutlinedIcon from '@material-ui/icons/FreeBreakfastOutlined'

import { FilterFeedCategory } from 'src/utils/types'

type IconType = typeof FreeBreakfastOutlinedIcon
export const mapCategoriesToIcons: Record<FilterFeedCategory, IconType> = {
  [FilterFeedCategory.MAT_HELP]: FreeBreakfastOutlinedIcon,
  [FilterFeedCategory.RESOURCE]: FreeBreakfastOutlinedIcon,
  [FilterFeedCategory.SOCIAL]: FreeBreakfastOutlinedIcon,
  [FilterFeedCategory.OTHER]: FreeBreakfastOutlinedIcon,
}

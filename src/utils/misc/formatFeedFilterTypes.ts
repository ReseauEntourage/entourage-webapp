import { FilterEntourageType, FilterFeedCategory } from '../types'

const feedTypeFilterResolver: Record<FilterEntourageType, Record<FilterFeedCategory, string>> = {
  [FilterEntourageType.ASK_FOR_HELP]: {
    [FilterFeedCategory.SOCIAL]: 'as',
    [FilterFeedCategory.RESOURCE]: 'ar',
    [FilterFeedCategory.MAT_HELP]: 'am',
    [FilterFeedCategory.OTHER]: 'ao,ai,ak',
  },
  [FilterEntourageType.CONTRIBUTION]: {
    [FilterFeedCategory.SOCIAL]: 'cs',
    [FilterFeedCategory.RESOURCE]: 'cr',
    [FilterFeedCategory.MAT_HELP]: 'cm',
    [FilterFeedCategory.OTHER]: 'co,ci,ck',
  },
}

export function formatTypes(types: Record<FilterEntourageType, FilterFeedCategory[]>): string {
  const filtersTab = [
    ...types[FilterEntourageType.ASK_FOR_HELP].map(
      (value) => feedTypeFilterResolver[FilterEntourageType.ASK_FOR_HELP][value],
    ),
    ...types[FilterEntourageType.CONTRIBUTION].map(
      (value) => feedTypeFilterResolver[FilterEntourageType.CONTRIBUTION][value],
    ),
  ]

  return filtersTab.join(',')
}

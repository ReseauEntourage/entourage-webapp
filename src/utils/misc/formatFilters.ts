import { FilterEntourageType, FilterFeedCategory, FilterPOICategory } from '../types'

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

export function formatFeedTypes(types: Record<FilterEntourageType, FilterFeedCategory[]>): string {
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

const poisCategoriesFilterResolver: Record<FilterPOICategory, number> = {
  [FilterPOICategory.OTHER]: 0,
  [FilterPOICategory.EATING]: 1,
  [FilterPOICategory.SLEEPING]: 2,
  [FilterPOICategory.HEALING]: 3,
  [FilterPOICategory.ORIENTATION]: 5,
  [FilterPOICategory.REINTEGRATION]: 7,
  [FilterPOICategory.PARTNERS]: 8,
  [FilterPOICategory.TOILETS]: 40,
  [FilterPOICategory.FOUNTAINS]: 41,
  [FilterPOICategory.SHOWERS]: 42,
  [FilterPOICategory.LAUNDRIES]: 43,
  [FilterPOICategory.WELL_BEING]: 6,
  [FilterPOICategory.CLOTHES]: 61,
  [FilterPOICategory.DONATION_BOX]: 62,
  [FilterPOICategory.CLOAKROOM]: 63,
}

export function formatPOIsCategories(types: FilterPOICategory[]): string {
  const filtersTab = types.map((value) => poisCategoriesFilterResolver[value])

  return filtersTab.join(',')
}

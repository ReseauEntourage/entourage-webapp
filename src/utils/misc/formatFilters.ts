import { FilterEntourageType, FilterFeedCategory, FilterPOICategory, FilterPOIPartner } from '../types'
import { POIPartnersTypes, POICategory } from 'src/core/api'

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

export function formatFeedTypes(
  actionTypes: Record<FilterEntourageType, FilterFeedCategory[]>,
  events: boolean,
): string {
  const filtersTab = [
    ...actionTypes[FilterEntourageType.ASK_FOR_HELP].map(
      (value) => feedTypeFilterResolver[FilterEntourageType.ASK_FOR_HELP][value],
    ),
    ...actionTypes[FilterEntourageType.CONTRIBUTION].map(
      (value) => feedTypeFilterResolver[FilterEntourageType.CONTRIBUTION][value],
    ),
  ]

  if (events) {
    filtersTab.push('ou')
  }

  return `${filtersTab.join(',')}`
}

export const poisCategoriesFilterResolver: Record<FilterPOICategory, POICategory> = {
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

export function formatPOIsCategories(categories: FilterPOICategory[]): string {
  const filtersTab = categories.map((value) => poisCategoriesFilterResolver[value])

  return filtersTab.join(',')
}

const poisPartnersFilterResolver: Record<FilterPOIPartner, POIPartnersTypes> = {
  [FilterPOIPartner.DONATIONS]: 'donations',
  [FilterPOIPartner.VOLUNTEERS]: 'volunteers',
}

export function formatPOIsPartners(partner: FilterPOIPartner[]): string {
  const filtersTab = partner.map((value) => poisPartnersFilterResolver[value])

  return filtersTab.join(',')
}


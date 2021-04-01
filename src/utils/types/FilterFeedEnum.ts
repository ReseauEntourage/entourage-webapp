/**
 * FeedFilter enums
 */

export const FilterFeedCategory = {
  SOCIAL: 'social',
  MAT_HELP: 'mat_help',
  RESOURCE: 'resource',
  OTHER: 'other',
} as const

type FilterFeedCategoryKeys = keyof typeof FilterFeedCategory;
export type FilterFeedCategory = typeof FilterFeedCategory[FilterFeedCategoryKeys]

export const FilterEntourageType = {
  CONTRIBUTION: 'contribution',
  ASK_FOR_HELP: 'ask_for_help',
} as const

type FilterEntourageTypeKeys = keyof typeof FilterEntourageType
export type FilterEntourageType = typeof FilterEntourageType[FilterEntourageTypeKeys]

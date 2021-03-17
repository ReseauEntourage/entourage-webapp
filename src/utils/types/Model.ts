type ID = string

export interface BaseModel {
  id: ID;
}

export interface Address extends BaseModel {}

export interface Announcement extends BaseModel {}

export interface Category extends BaseModel {}

export interface ChatMessage extends BaseModel {}

export interface EntourageInvitation extends BaseModel {}

export interface Entourage extends BaseModel {}

export interface Feed extends BaseModel {}

export interface JoinRequest extends BaseModel {}

export interface Partner extends BaseModel {}

export interface Poi extends BaseModel {}

export interface User extends BaseModel {}

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

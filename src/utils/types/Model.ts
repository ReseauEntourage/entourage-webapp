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
  SOCIAL: 'SOCIAL',
  MAT_HELP: 'MAT_HELP',
  RESOURCE: 'RESOURCE',
  OTHER: 'OTHER',
} as const

export type FilterFeedCategory = keyof typeof FilterFeedCategory

export const FilterEntourageType = {
  CONTRIBUTION: 'CONTRIBUTION',
  ASK_FOR_HELP: 'ASK_FOR_HELP',
} as const

export type FilterEntourageType = keyof typeof FilterEntourageType

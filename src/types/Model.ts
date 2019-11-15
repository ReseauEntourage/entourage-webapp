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

import { LocationState } from "../../core/useCases/location"

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

type CityLocation = Pick<LocationState, 'center' | 'displayAddress'>

export type Cities = 'paris' | 'lyon' | 'rennes' | 'lille' | 'hauts-de-seine' | 'seine-saint-denis'

export const EntourageCities: Record<Cities, CityLocation> = {
  paris: {
    displayAddress: 'Paris, France',
    center: {
      lat: 48.856614,
      lng: 2.3522219,
    },
  },
  lyon: {
    displayAddress: 'Lyon, France',
    center: {
      lat: 45.764043,
      lng: 4.835659,
    },
  },
  lille: {
    displayAddress: 'Lille, France',
    center: {
      lat: 50.62925,
      lng: 3.057256,
    },
  },
  rennes: {
    displayAddress: 'Rennes, France',
    center: {
      lat: 48.117266,
      lng: -1.6777926,
    },
  },
  'hauts-de-seine': {
    displayAddress: 'Hauts-de-Seine, France',
    center: {
      lat: 48.828508,
      lng: 2.2188068,
    },
  },
  'seine-saint-denis': {
    displayAddress: 'Seine-Saint-Denis, France',
    center: {
      lat: 48.9137455,
      lng: 2.4845729,
    },
  },
}

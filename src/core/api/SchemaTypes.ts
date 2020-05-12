import { DateISO, AnyToFix } from 'src/utils/types'

export type UserType = 'public'

export type FeedType = 'Entourage' | 'Tour'

export type FeedStatus = 'open' | 'closed' | 'suspended'

export type FeedGroupType = 'action' | 'outing' | 'conversation'

export type FeedEntourageType = 'contribution' | 'ask_for_help'

export type FeedDisplayCategory =
  | 'event'
  | 'info'
  | 'mat_help'
  | 'other'
  | 'resource'
  | 'skill'
  | 'social'

export type FeedJoinStatus =
  | 'accepted'
  | 'pending'
  | 'rejected'
  | 'cancelled'
  | 'not_requested'

export type Location = {
  latitude: number;
  longitude: number;
}

export type EntourageTypes = 'medical' | 'barehands' | 'alimentary'

export type POICategory =
  | { id: 1; name: 'Se nourrir'; }
  | { id: 2; name: 'Se loger'; }
  | { id: 3; name: 'Se soigner'; }
  | { id: 4; name: 'Se rafraîchir'; }
  | { id: 5; name: 'S\'orienter'; }
  | { id: 6; name: 'S\'occuper de soi'; }
  | { id: 7; name: 'Se réinsérer'; }

/**
 * Values splited by coma: 1,2,3,4,5,6,7
 *
 * 1 = Se nourrir
 * 2 = Se loger
 * 3 = Se soigner
 * 4 = Se rafraîchir
 * 5 = S'orienter
 * 6 = S'occuper de soi
 * 7 = Se réinsérer
 */
export type POICategoriesIds = string

/**
 * Values splited by coma: as,ae,am,ar,ai,ak,ao
 *
 * as : ask_for_help_social
 * ae = ask_for_help_event
 * am = ask_for_help_mat_help
 * ar = ask_for_help_resource
 * ai = ask_for_help_info
 * ak = ask_for_help_skill
 * ao = ask_for_help_other
 * cs = contribution_social
 * ce = contribution_event
 * cm = contribution_mat_help
 * cr = contribution_resource
 * ci = contribution_info
 * ck = contribution_skill
 * co = contribution_other
 * ou = outing (event)
 */
export type FeedTypesFilter = string

export interface FeedOutingMetadata {
  displayAddress: string;
  googlePlaceId: string;
  placeName: string;
  startsAt: DateISO;
  streetAddress: string;
}

export type FeedMetadata = FeedOutingMetadata

export interface UserPartner {
  default: boolean;
  id: string;
  largeLogoUrl: string;
  name: string;
  smallLogoUrl: string;
}

export interface AnonymousUser {
  about: string | null;
  address: null;
  anonymous: boolean;
  avatarUrl: string | null;
  conversation: {
    uuid: string;
  };
  displayName: null;
  email: null;
  firebaseProperties: {
    ActionZoneCP: string;
    ActionZoneDep: string;
  };
  firstName: null;
  hasPassword: boolean;
  id: null;
  lastName: null;
  memberships: unknown[];
  organization: null;
  partner: null;
  roles: unknown[];
  stats: {
    encounterCount: number;
    entourageCount: number;
    tourCount: number;
  };
  token: string;
  userType: UserType;
  uuid: string;
}

export interface LoggedUser {
  about: string | null;
  address: null | {
    displayAddress: string;
    latitude: number;
    longitude: number;
  };
  anonymous: boolean;
  avatarUrl: string | null;
  conversation: {
    uuid: string;
  };
  displayName: string | null;
  email: string | null;
  firebaseProperties: {
    ActionZoneCP: string;
    ActionZoneDep: string;
  };
  firstName: string | null;
  hasPassword: boolean;
  id: number;
  lastName: string | null;
  memberships: unknown[];
  organization: null;
  partner: null;
  roles: unknown[];
  stats: {
    encounterCount: number;
    entourageCount: number;
    tourCount: number;
  };
  token: string;
  userType: UserType;
  uuid: string;
}

export type User = AnonymousUser | LoggedUser;

export interface FeedItemEntourage {
  data: {
    author: {
      avatarUrl?: string;
      displayName: string;
      id: number;
      partner: UserPartner | null;
    };
    createdAt: DateISO;
    description: string;
    displayCategory: FeedDisplayCategory;
    entourageType: FeedEntourageType;
    groupType: FeedGroupType;
    id: number;
    joinStatus: FeedJoinStatus;
    location: Location;
    metadata: FeedMetadata;
    numberOfPeople: number;
    numberOfUnreadMessages: number | null;
    public: boolean;
    shareUrl: string;
    status: FeedStatus;
    title: string;
    updatedAt: DateISO;
    uuid: string;
  };
  heatmapSize: number;
  type: 'Entourage';
}

export interface FeedItemTour {
  data: {
    author: {
      avatarUrl?: string;
      displayName: string;
      id: number;
      partner: UserPartner | null;
    };
    distance: number;
    endTime: DateISO;
    id: number;
    joinStatus: FeedJoinStatus;
    numberOfPeople: number;
    numberOfUnreadMessages: number | null;
    organizationDescription: string;
    organizationName: string;
    startTime: DateISO;
    status: FeedStatus;
    tourPoints: AnyToFix[];
    tourType: string;
    updatedAt: DateISO;
    uuid: string;
    vehicleType: 'feet';
  };
  heatmapSize: number;
  type: 'Tour';
}

export interface DTOCreateEntourageAsAction {
  description: string;
  displayCategory: FeedDisplayCategory;
  entourageType: FeedEntourageType;
  location: {
    latitude: number;
    longitude: number;
  };
  title: string;
}

export interface DTOUpdateEntourageAsAction {
  description: string;
  displayCategory: FeedDisplayCategory;
  entourageType: FeedEntourageType;
  title: string;
}

export interface DTOCreateEntourageAsEvent {
  description: string;
  groupType: string;
  location: {
    latitude: number;
    longitude: number;
  };
  metadata: {
    googlePlaceId: string;
    placeName: string;
    startsAt: string;
    streetAddress: string;
  };
  title: string;
}

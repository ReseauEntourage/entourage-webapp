import { DateISO, AnyToFix } from 'src/utils/types'

export type UserType = 'public'

export type FeedType = 'Entourage' | 'Tour'

export type FeedStatus = 'open' | 'closed' | 'suspended'

export type FeedGroupType = 'action' | 'outing' | 'conversation'

export type FeedEntourageType = 'contribution' | 'ask_for_help'

export type EntourageIdOrUUIDParams =
  | { entourageId: number; entourageUuid?: string; }
  | { entourageId?: number; entourageUuid: string; }

export type FeedDisplayCategory =
  | 'mat_help'
  | 'other'
  | 'resource'
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
| 0
| 1
| 2
| 3
| 5
| 7
| 8
| 40
| 41
| 42
| 43
| 6
| 61
| 62
| 63

export type POISource = 'entourage' | 'soliguide'

export type POIPartnersTypes = 'donations' | 'volunteers'

export interface POIItem {
  uuid: string;
  name: string;
  longitude: number;
  latitude: number;
  address: string;
  phone: string | null;
  categoryId: POICategory;
  partnerId: string | null;
}

export interface POIDetailsItem {
  uuid: string;
  name: string;
  longitude: number;
  latitude: number;
  address: string;
  phone: string | null;
  description: string | null;
  categoryIds: POICategory[];
  partnerId: string | null;
  website: string | null;
  email: string | null;
  hours: string | null;
  languages: string | null;
  audience: string | null;
  source: POISource;
  sourceUrl: string | null;
}

/**
 * Values splitted by coma: donations,volunteers
 *
 * 'donations'
 * 'volunteers'
 */
export type POIPartnersFilters = string

/**
 * Values splited by coma: 1,2,3,4,5,6,7
 *
 * 0 = 'Autre'
 * 1 = 'Se nourrir'
 * 2 = 'Se loger'
 * 3 = 'Se soigner'
 * 5 = 'S'orienter'
 * 7 = 'Se réinsérer'
 * 8 = 'Partenaires'
 * 40 = 'Toilettes'
 * 41 = 'Fontaines'
 * 42 = 'Douches'
 * 43 = 'Laveries'
 * 6 = 'Bien-être & activités'
 * 61 = 'Vêtements & matériels'
 * 62 = 'Boîtes à dons & lire'
 * 63 = 'Bagageries'
 *
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
  endsAt: DateISO;
  googlePlaceId: string;
  placeName: string;
  startsAt: DateISO;
  streetAddress: string;
}

export type FeedMetadata = FeedOutingMetadata

export interface UserStats {
  encounterCount: number;
  entourageCount: number;
  tourCount: number;
  actionsCount: number;
  eventsCount: number;
  goodWavesParticipation: boolean;
}

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
  featureFlags: {
    organizationAdmin: boolean;
  };
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
  token: string;
  stats: UserStats;
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
  featureFlags: {
    organizationAdmin: boolean;
  };
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
  partner: UserPartner;
  roles: unknown[];
  stats: UserStats;
  token: string;
  userType: UserType;
  uuid: string;
  firstSignIn: boolean;
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
    online: boolean;
  };
  heatmapSize: number;
  type: 'Entourage';
}

export interface FeedItemAnnouncement {
  data: {
    id: number;
    uuid: string;
    title: string;
    body: string;
    imageUrl?: string;
    action: string;
    url: string;
    webappUrl?: string;
    iconUrl: string;
    author?: null;
  };
  type: 'Announcement';
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

export interface Message {
  author: {
    avatarUrl: string;
    displayName: string;
    id: number;
    partner: null; // TO DEFINED
  };
  createdAt: DateISO;
  description: string;
  displayCategory: FeedDisplayCategory;
  entourageType: FeedEntourageType;
  groupType: FeedGroupType;
  id: number;
  joinStatus: FeedJoinStatus;
  lastMessage?: {
    author: {
      firstName: string;
      lastName: string;
    };
    text: string;
  };
  location: Location;
  metadata: {
    city: string;
    displayAddress: string;
  };
  numberOfPeople: number;
  numberOfUnreadMessages: number;
  public: boolean;
  shareUrl: string;
  status: FeedStatus;
  title: string;
  updatedAt: DateISO;
  uuid: string;
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

export interface DTOCloseEntourage {
  outcome: {
    success: boolean;
  };
  status: 'closed';
}

export interface DTOReopenEntourage {
  status: 'open';
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

export interface DTOUpdateEntourageAsEvent {
  description?: string;
  groupType?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  metadata: {
    googlePlaceId?: string;
    placeName?: string;
    startsAt?: string;
    streetAddress?: string;
  };
  title?: string;
}
export interface UserPartnerWithDetails extends UserPartner {
  address: string;
  description: string;
  donationsNeeds: string;
  email: string;
  phone: string;
  userRoleTitle: string;
  volunteersNeeds: string;
  websiteUrl: string;
}

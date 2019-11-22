
import { DateISO } from 'src/types/utils'

export type UserType = 'public'

export type FeedType = 'Entourage'

export type FeedStatus = 'open' | 'closed' | 'suspended'

export type FeedGroupType = 'action' | 'outing' | 'conversation'

export type FeedEntourageType = 'contribution' | 'ask_for_help'

export type FeedDisplayCategory =
  | 'info'
  | 'social'
  | 'resource'
  | 'other'
  | 'mat_help'
  | 'event'
  | 'skill'

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
type FeedTypesFilter = string

export const schema = {
  'POST anonymous_users': {
    url: 'anonymous_users',
    method: 'POST',
    params: null,
    data: null,
    response: {} as {
      user: {
        about: null;
        address: null;
        anonymous: true;
        avatarUrl: null;
        displayName: null;
        email: null;
        firstName: null;
        firebaseProperties: {
          ActionZoneDep: string;
          ActionZoneCP: string;
        };
        hasPassword: boolean;
        id: null;
        lastName: null;
        organization: null;
        partner: null;
        placeholders: string[];
        roles: unknown[];
        stats: {
          tourCount: number;
          encounterCount: number;
          entourageCount: number;
        };
        token: string;
        userType: UserType;
        uuid: string;
      };
    },
  },
  'GET feeds': {
    url: 'feeds',
    method: 'GET',
    params: {} as {
      announcements?: 'v1';
      types?: FeedTypesFilter;
      /**
       * Number of hours to filter
       */
      timeRange?: number;
      /**
       * Show past events (defaults to false)
       */
      longitude: number;
      latitude: number;
      showPastEvents?: boolean;
      pageToken?: string;
    },
    data: null,
    response: {} as {
      feeds: {
        data: {
          author: {
            id: number;
            displayName: string;
            avatarUrl?: string;
            partner: unknown;
          };
          createdAt: DateISO;
          description: string;
          displayCategory: FeedDisplayCategory;
          entourageType: EntourageTypes;
          groupType: FeedGroupType;
          id: number;
          joinStatus: FeedJoinStatus;
          location: Location;
          metadata: {};
          numberOfPeople: number;
          numberOfUnreadMessages: number | null;
          public: boolean;
          shareUrl: string;
          status: FeedStatus;
          title: string;
          updatedAt: DateISO;
          uuid: string;
        };
        type: FeedType;
        heatmapSize: number;
      }[];
    },
  },
  'GET myfeeds': {
    url: 'myfeeds',
    method: 'GET',
    params: {} as void | {
      /**
       * currentUser has accepted an invite to join
       */
      acceptedInvitation?: boolean;
      /**
       * currentUser is the author
       */
      createdByMe?: boolean;
      /**
       * Types of entourages separated by coma
       */
      entourageTypes?: EntourageTypes;
      /**
       * Page number
       */
      page?: number;
      /**
       * Number of entourages per page
       */
      per?: number;
      showTours?: boolean; // TO VALIDATE
      status?: 'all' | 'active' | 'close';
      /**
       * Number of hours to filter
       */
      timeRange?: number;
      /**
       * Types of tours separated by coma
       */
      tourTypes?: string;
    },
    data: null,
    response: {} as {
      feeds: {
        data: {
          author: {
            id: number;
            displayName: string;
            avatarUrl: string;
            partner: null; // TO DEFINED
          };
          createdAt: DateISO;
          description: string;
          displayCategory: FeedDisplayCategory;
          entourageType: FeedEntourageType;
          groupType: FeedGroupType;
          id: string;
          joinStatus: FeedJoinStatus;
          lastMessage: {
            text: string;
            author: {
              firstName: string;
              lastName: string;
            };
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
        };
        type: FeedType;
        heatmapSize: number;
      }[];
    },
  },
  'GET users/me': {
    url: 'users/me',
    method: 'GET',
    params: null,
    data: null,
    response: {} as {
      user: {
        about: null;
        address: null;
        anonymous: true;
        avatarUrl: null;
        conversation: {
          uuid: string;
        };
        displayName: null;
        email: null;
        firebaseProperties: {
          ActionZoneDep: string;
          ActionZoneCP: string;
        };
        firstName: null;
        hasPassword: boolean;
        id: null;
        lastName: null;
        memberships: unknown[];
        organization: null;
        partner: null;
        placeholders: string[];
        roles: unknown[];
        stats: {
          tourCount: number;
          encounterCount: number;
          entourageCount: number;
        };
        token: string;
        userType: UserType;
        uuid: string;
      };
    },
  },
  'GET pois': {
    url: 'pois',
    method: 'GET',
    params: {} as {
      latitude: number;
      longitude: number;
      distance: number;
      categoryIds: POICategoriesIds;
    },
    data: null,
    response: {} as {
      categories: POICategory[];
      pois: {
        adress: string;
        audience: string;
        category: POICategory;
        categoryId: number;
        description: string;
        email: string;
        id: number;
        latitude: number;
        longitude: number;
        name: string;
        phone: string;
        validated: boolean;
        website: string;
      }[];
    },
  },
}

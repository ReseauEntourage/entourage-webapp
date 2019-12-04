import { DateISO } from 'src/types/utils'

import {
  FeedTypesFilter,
  UserPartner,
  FeedDisplayCategory,
  FeedEntourageType,
  FeedGroupType,
  FeedJoinStatus,
  FeedMetadata,
  FeedStatus,
  EntourageTypes,
  FeedType,
  POICategoriesIds,
  POICategory,
  User,
  Location,
} from './SchemaTypes'

export const schema = {
  'POST /anonymous_users': {
    url: 'anonymous_users',
    method: 'POST',
    params: null,
    data: null,
    response: {} as {
      user: User;
    },
  },
  'GET /feeds': {
    url: 'feeds',
    method: 'GET',
    params: {} as {
      announcements?: 'v1';
      /**
       * Show past events (defaults to false)
       */
      latitude: number;
      longitude: number;
      pageToken?: string;
      showPastEvents?: boolean;
      /**
       * Number of hours to filter
       */
      timeRange?: number;
      types?: FeedTypesFilter;
    },
    data: null,
    response: {} as {
      feeds: {
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
        type: FeedType;
      }[];
      nextPageToken?: string;
    },
  },
  'GET /myfeeds': {
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
          id: string;
          joinStatus: FeedJoinStatus;
          lastMessage: {
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
        };
        heatmapSize: number;
        type: FeedType;
      }[];
    },
  },
  'POST /users': {
    url: 'users',
    method: 'POST',
    params: null,
    data: {} as {
      user: {
        phone: string;
      };
    },
    response: {} as {},
  },
  'GET /users/me': {
    url: 'users/me',
    method: 'GET',
    params: null,
    data: null,
    response: {} as {
      user: User;
    },
  },
  'PATCH /users/me': {
    url: 'users/me',
    method: 'PATCH',
    params: null,
    data: {} as {
      user: {
        about?: string;
        address?: {
          googlePlaceId: string;
          googleSessionToken: string;
        };
        email?: string;
        firstName?: string;
        lastName?: string;
        password?: string;
      };
    },
    response: {} as {
      user: User;
    },
  },
  'GET /pois': {
    url: 'pois',
    method: 'GET',
    params: {} as {
      categoryIds: POICategoriesIds;
      distance: number;
      latitude: number;
      longitude: number;
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
  'GET /entourages/:entourageId/users': {
    url: (params: { entourageId: string; }) => `entourages/${params.entourageId}/users`,
    method: 'GET',
    params: {} as null | {
      page?: number;
      per?: number;
    },
    data: null,
    response: {} as {
      users: {
        avatarUrl: string;
        communityRoles: unknown[];
        displayName: string;
        groupRole: 'member';
        id: number;
        message: null;
        partner: UserPartner;
        requestedAt: DateISO;
        role: 'member';
        status: FeedJoinStatus;
      }[];
    },
  },
  'POST /users/lookup': {
    url: 'users/lookup',
    method: 'POST',
    params: null,
    data: {} as {
      phone: string;
    },
    response: {} as {
      secretType: 'password' | 'code';
      status: 'not_found' | 'unavailable' | 'found';
      // présent uniquement si status = found
      // entre 8 et 256 caracters
    },
  },
  'POST /login': {
    url: 'login',
    method: 'POST',
    params: null,
    data: {} as {
      user: {
        phone: string;
        secret: string;
      };
    },
    response: {} as {
      firstSignIn: boolean;
      user: User;
    },
  },
}

export type FeedItem = typeof schema['GET /feeds']['response']['feeds'][0]['data']

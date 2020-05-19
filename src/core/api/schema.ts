import { DateISO } from 'src/utils/types'

import {
  EntourageTypes,
  FeedDisplayCategory,
  FeedEntourageType,
  FeedGroupType,
  FeedItemTour,
  FeedItemEntourage,
  FeedJoinStatus,
  FeedStatus,
  FeedType,
  FeedTypesFilter,
  Location,
  POICategory,
  POICategoriesIds,
  User,
  UserPartner,
  DTOCreateEntourageAsEvent,
  DTOUpdateEntourageAsEvent,
  DTOCreateEntourageAsAction,
  DTOUpdateEntourageAsAction,
} from './SchemaTypes'

export const schema = {
  '/anonymous_users POST': {
    url: 'anonymous_users',
    method: 'POST',
    params: null,
    data: null,
    response: {} as {
      user: User;
    },
  },
  '/entourages POST': {
    url: 'entourages',
    method: 'POST',
    params: null,
    data: {} as {
      entourage: DTOCreateEntourageAsAction | DTOCreateEntourageAsEvent;
    },
    response: {} as {
      entourage: {
        author: User;
        createdAt: DateISO;
        description: string;
        displayCategory: FeedDisplayCategory;
        entourageType: FeedEntourageType;
        groupType: FeedGroupType;
        id: number;
        joinStatus: FeedJoinStatus;
        location: {
          latitude: number;
          longitude: number;
        };
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
    },
  },
  '/entourages PATCH': {
    url: ({ entourageId }: { entourageId: number; }) => `entourages/${entourageId}`,
    method: 'PATCH',
    params: null,
    data: {} as {
      entourage: DTOUpdateEntourageAsAction | DTOUpdateEntourageAsEvent;
    },
    response: {} as {},
  },
  '/entourages/:entourageId/chat_messages GET': {
    url: (params: { entourageId: number; }) => `/entourages/${params.entourageId}/chat_messages`,
    method: 'GET',
    params: {} as void | {
      before?: DateISO;
    },
    data: null,
    response: {} as {
      chatMessages: {
        content: string;
        createdAt: DateISO;
        id: number;
        messageType: 'text';
        user: {
          avatarUrl: User['avatarUrl'];
          displayName: NonNullable<User['displayName']>;
          id: NonNullable<User['id']>;
          partner: User['partner'];
        };
      }[];
    },
  },
  '/entourages/:entourageId/chat_messages POST': {
    url: (params: { entourageId: number; }) => `/entourages/${params.entourageId}/chat_messages`,
    method: 'POST',
    params: null,
    data: {} as {
      chatMessage: {
        content: string;
      };
    },
    response: {} as {},
  },
  '/entourages/:entourageId/users GET': {
    url: (params: { entourageId: string | number; }) => `entourages/${params.entourageId}/users`,
    method: 'GET',
    params: {} as void | {
      context?: 'groupFeed';
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
  '/entourages/:entourageId/users POST': {
    url: (params: { entourageId: number; }) => `entourages/${params.entourageId}/users`,
    method: 'POST',
    params: null,
    data: null,
    response: {} as {},
  },
  '/entourages/:entourageId/users/:userId PUT': {
    url: (params: { entourageId: number; userId: number; }) => {
      return `entourages/${params.entourageId}/users/${params.userId}`
    },
    method: 'PUT',
    params: null,
    data: {} as {
      user: {
        status: 'accepted';
      };
    },
    response: null,
  },
  '/entourages/:entourageId/users/:userId DELETE': {
    url: (params: { entourageId: number; userId: number; }) => {
      return `entourages/${params.entourageId}/users/${params.userId}`
    },
    method: 'DELETE',
    params: null,
    data: null,
    response: null,
  },
  '/feeds GET': {
    url: 'feeds',
    method: 'GET',
    params: {} as {
      announcements?: 'v1';
      /**
       * Show past events (defaults to false)
       */
      entourageTypes?: string;
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
      feeds: (FeedItemEntourage | FeedItemTour)[];
      nextPageToken?: string;
    },
  },
  '/login POST': {
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
  '/myfeeds GET': {
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
          id: number;
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
  '/pois GET': {
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
  '/users POST': {
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
  '/users/:id GET': {
    url: (params: { userId: number; }) => `users/${params.userId}`,
    method: 'GET',
    params: null,
    response: {} as {
      user: {
        about: string;
        avatarUrl: string;
        conversation: { uuid: string; };
        displayName: string;
        firstName: string;
        id: number;
        lastName: string;
        // memberships: [];
        organization: {
          address: string;
          description: string;
          logoUrl: string;
          name: string;
          phone: string;
        };
        partner?: {
          address: string;
          default: boolean;
          description: string;
          email: string;
          id: number;
          largeLogoUrl: string;
          name: string;
          phone: string;
          smallLogoUrl: string;
          userRoleTitle: string;
          websiteUrl: string;
        };
        stats: {
          encounterCount: number;
          entourageCount: number;
          tourCount: number;
        };
        userType: 'pro';
      };
    },
  },
  '/users/me GET': {
    url: 'users/me',
    method: 'GET',
    params: null,
    data: null,
    response: {} as {
      user: User;
    },
  },
  '/users/me PATCH': {
    url: 'users/me',
    method: 'PATCH',
    params: null,
    data: {} as {
      user: {
        about?: string;
        avatarKey?: string;
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
  '/users/me/address POST': {
    url: 'users/me/address',
    method: 'POST',
    params: null,
    data: {} as {
      address: {
        googlePlaceId: string;
        googleSessionToken: string;
      };
    },
    response: {} as {},
  },
  '/users/me/presigned_avatar_upload/ POST': {
    url: '/users/me/presigned_avatar_upload/',
    method: 'POST',
    params: null,
    data: {} as {
      contentType: string;
    },
    response: {} as {
      avatarKey: string;
      presignedUrl: string;
    },
  },
  '/users/lookup POST': {
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
}

export type FeedItem = typeof schema['/feeds GET']['response']['feeds'][0]['data']

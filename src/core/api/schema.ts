import { validateSchema } from 'typescript-request-schema'
import { DateISO } from 'src/utils/types'

import {
  EntourageTypes,
  EntourageIdOrUUIDParams,
  FeedDisplayCategory,
  FeedEntourageType,
  FeedGroupType,
  FeedItemTour,
  FeedItemAnnouncement,
  FeedItemEntourage,
  FeedJoinStatus,
  FeedStatus,
  FeedType,
  FeedTypesFilter,
  Location,
  POICategoriesIds,
  User,
  UserPartner,
  DTOCreateEntourageAsEvent,
  DTOUpdateEntourageAsEvent,
  DTOCreateEntourageAsAction,
  DTOUpdateEntourageAsAction,
  UserPartnerWithDetails,
  DTOCloseEntourage,
  DTOReopenEntourage,
  POIItem,
  POIDetailsItem,
  POIPartnersFilters,
} from './SchemaTypes'

export interface TypeScriptRequestSchemaConf {
  DataKey: 'data';
  MethodKey: 'method';
  PathParamsKey: 'pathParams';
  QueryParamsKey: 'params';
  ResponseKey: 'response';
  RouteNameKey: 'name';
  URLKey: 'url';
}

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
    url: (params: EntourageIdOrUUIDParams) => `entourages/${params.entourageId || params.entourageUuid}`,
    method: 'PATCH',
    params: null,
    data: {} as {
      entourage: DTOUpdateEntourageAsAction | DTOUpdateEntourageAsEvent | DTOCloseEntourage | DTOReopenEntourage;
    },
    response: {} as {},
  },
  '/entourages/:entourageId GET': {
    url: (params: EntourageIdOrUUIDParams) => `/entourages/${params.entourageId || params.entourageUuid}`,
    method: 'GET',
    params: null,
    data: null,
    response: {} as {
      entourage: {
        author: User;
        createdAt: DateISO;
        description: string;
        displayCategory: FeedDisplayCategory;
        entourageType: FeedEntourageType;
        groupType: FeedGroupType;
        id: number | null;
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
  '/entourages/:entourageId/chat_messages GET': {
    url: (params: EntourageIdOrUUIDParams) => `/entourages/${params.entourageId || params.entourageUuid}/chat_messages`,
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
    url: (params: EntourageIdOrUUIDParams) => `/entourages/${params.entourageId || params.entourageUuid}/chat_messages`,
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
    url: (params: EntourageIdOrUUIDParams) => `entourages/${params.entourageId || params.entourageUuid}/users`,
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
    url: (params: EntourageIdOrUUIDParams) => `entourages/${params.entourageId || params.entourageUuid}/users`,
    method: 'POST',
    params: null,
    data: null,
    response: {} as {
      user: {
        id: number;
        status: FeedJoinStatus;
      };
    },
  },
  '/entourages/:entourageId/users/:userId PUT': {
    url: (params: EntourageIdOrUUIDParams & { userId: number; }) => {
      return `entourages/${params.entourageId || params.entourageUuid}/users/${params.userId}`
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
    url: (params: EntourageIdOrUUIDParams & { userId: number; }) => {
      return `entourages/${params.entourageId || params.entourageUuid}/users/${params.userId}`
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
      feeds: (FeedItemEntourage | FeedItemTour | FeedItemAnnouncement)[];
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
      v: 2;
      categoryIds?: POICategoriesIds;
      partnersFilters?: POIPartnersFilters;
      distance?: number;
      latitude: number;
      longitude: number;
    },
    data: null,
    response: {} as {
      pois: POIItem[];
    },
  },
  '/pois/:poiUuid GET': {
    url: (params: { poiUuid: string; }) => `/pois/${params.poiUuid}`,
    method: 'GET',
    data: null,
    params: {} as {
      v: 2;
    },
    response: {} as {
      poi: POIDetailsItem;
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
    data: null,
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
        partner?: UserPartnerWithDetails;
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
  '/users/me/code PATCH': {
    url: 'users/me/code',
    method: 'PATCH',
    params: null,
    data: {} as {
      code: {
        action: 'regenerate';
      };
      user: {
        phone: string;
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
        googleSessionToken: google.maps.places.AutocompleteSessionToken;
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

validateSchema<TypeScriptRequestSchemaConf>(schema)

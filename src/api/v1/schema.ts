
import { DateISO } from 'src/types/utils'

type UserType = 'public'

type FeedType = 'Entourage'
type FeedStatus = 'open'
type FeedGroupType = 'action'
type FeedEntourageType = 'contribution'
type FeedDisplayCategory = 'info'
type FeedJoinStatus = 'accepted'

export const Schema = {
  'POST anonymous_users': {
    path: 'anonymous_users',
    method: 'POST',
    type: {} as {
      params: void;
      body: void;
      response: {
        user: {
          id: null;
          email: null;
          displayName: null;
          firstName: null;
          lastName: null;
          roles: unknown[];
          about: null;
          token: string;
          avatarUrl: null;
          userType: UserType;
          partner: null;
          hasPassword: boolean;
          anonymous: true;
          uuid: string;
          firebaseProperties: {
            ActionZoneDep: string;
            ActionZoneCP: string;
          };
          placeholders: string[];
          organization: null;
          stats: {
            tourCount: number;
            encounterCount: number;
            entourageCount: number;
          };
          address: null;
        };
      };
    },
  },
  'GET myfeeds': {
    path: 'myfeeds',
    method: 'GET',
    type: {} as {
      params: {
        status: 'all';
        showTours: boolean;
        timeRange: number;
      };
      body: void;
      response: {
        feeds: {
          type: FeedType;
          data: {
            id: string;
            uuid: string;
            status: FeedStatus;
            title: string;
            groupType: FeedGroupType;
            public: boolean;
            metadata: {
              city: string;
              displayAddress: string;
            };
            entourageType: FeedEntourageType;
            displayCategory: FeedDisplayCategory;
            joinStatus: FeedJoinStatus;
            numberOfUnreadMessages: number;
            numberOfPeople: number;
            createdAt: DateISO;
            updatedAt: DateISO;
            description: string;
            shareUrl: string;
            author: {
              id: string;
              displayName: string;
              avatarUrl: string;
              partner: null; // TO DEFINED
            };
            location: {
              latitude: number;
              longitude: number;
            };
            lastMessage: {
              text: string;
              author: {
                firstName: string;
                lastName: string;
              };
            };
          };
          heatmapSize: number;
        }[];
      };
    },
  },
  'GET users/me': {
    path: 'users/me',
    method: 'GET',
    type: {} as {
      params: void;
      body: void;
      response: {
        user: {
          id: null;
          email: null;
          displayName: null;
          firstName: null;
          lastName: null;
          roles: unknown[];
          about: null;
          token: string;
          avatarUrl: null;
          userType: UserType;
          partner: null;
          memberships: unknown[];
          hasPassword: boolean;
          conversation: {
            uuid: string;
          };
          anonymous: true;
          uuid: string;
          firebaseProperties: {
            ActionZoneDep: string;
            ActionZoneCP: string;
          };
          placeholders: string[];
          organization: null;
          stats: {
            tourCount: number;
            encounterCount: number;
            entourageCount: number;
          };
          address: null;
        };
      };
    },
  },
}

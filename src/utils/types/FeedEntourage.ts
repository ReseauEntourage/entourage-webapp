import { UserPartner, FeedDisplayCategory, FeedEntourageType, FeedJoinStatus, FeedStatus,
  FeedGroupType } from 'src/core/api'
import { DateISO } from './utils'

export interface FeedOutingActionMetadata {
  displayAddress: string;
  city: string;
}
export interface FeedOutingEventMetadata {
  startsAt: DateISO;
  displayAddress: string;
  endsAt?: DateISO;
  googlePlaceId?: string;
  placeName?: string;
  streetAddress?: string;
  landscapeUrl?: string;
  landscapeThumbnailUrl?: string;
  portraitUrl?: string;
  portraitThumbnailUrl?: string;
}

export type FeedMetadata<type extends FeedGroupType> = type extends 'action' ?
  FeedOutingActionMetadata : FeedOutingEventMetadata

export type FeedBaseEntourage<GroupType extends FeedGroupType = FeedGroupType> = {
  author: {
    id: number;
    avatarUrl: string | null; // check is always null (and key is defined)
    displayName: string;
    partner: UserPartner | null;
  };
  createdAt: string;
  updatedAt: string;
  id: number;
  uuid: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  numberOfPeople: number;
  numberOfUnreadMessages: number;
  metadata: FeedMetadata<GroupType>;
  displayCategory: FeedDisplayCategory;
  entourageType: FeedEntourageType;
  groupType: GroupType;
  joinStatus: FeedJoinStatus;
  status: FeedStatus;
  online: boolean;
  eventUrl: GroupType extends 'outing' ? string : null;
  postalCode: string;
  shareUrl: string;
}

// Could be use with new version of TS
// export type BaseEntourage<GroupType extends MyFeedGroupType> = {
//   author: {
//     id: number;
//     avatarUrl: string | null; // check is always null (and key is defined)
//     displayName: string;
//     partner: UserPartner | null;
//   };
//   createdAt: string;
//   updatedAt: string;
//   id: number;
//   uuid: string;
//   title: string;
//   location: {
//     latitude: number;
//     longitude: number;
//   };
//   numberOfPeople: number;
//   numberOfUnreadMessages: number;
// } & GroupType extends 'conversation' ? ConversationDefaultValues : {
//     description: string | null;
//     metadata: FeedMetadata<GroupType>;
//     displayCategory: FeedDisplayCategory;
//     entourageType: FeedEntourageType;
//     groupType: GroupType;
//     joinStatus: FeedJoinStatus;
//     status: FeedStatus;
//     online: boolean;
//     eventUrl: GroupType extends 'outing' ? string : null;
//     postalCode: string;
//     shareUrl: string;
//   }

// Could be used for to improve typing of Conversation
// interface ConversationDefaultValues {
//   description: null;
//   metadata: {};
//   displayCategory: null;
//   entourageType: 'contribution';
//   groupType: 'conversation';
//   joinStatus: 'accepted';
//   status: 'open';
//   online: false;
//   public: false;
//   eventUrl: null;
//   postalCode: '00000';
//   shareUrl: null;
// }

// interface ConversationMetadata {
//   lastMessage: {
//     author: {
//       firstName: string;
//       lastName: string;
//     };
//     text: string;
//   } | null;
// }


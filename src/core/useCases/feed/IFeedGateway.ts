import { LocationState } from '../location'
import { FeedJoinStatus, FeedTypesFilter } from 'src/core/api'
import { FeedState, FeedEntourage, FeedAnnouncement } from './feed.reducer'

interface FeedItemsFilter {
  location: Pick<LocationState, 'center' | 'zoom'>;
  timeRange: number;
  types: FeedTypesFilter;
}

export interface IFeedGateway {
  retrieveFeedItems(data: {
    filters: FeedItemsFilter;
    nextPageToken?: FeedState['nextPageToken'];
  }): Promise<{
    items: (FeedEntourage | FeedAnnouncement)[];
    nextPageToken: FeedState['nextPageToken'];
  }>;

  retrieveFeedItem(data: { entourageUuid: string; }): Promise<{
    center: LocationState['center'];
    displayAddress: LocationState['displayAddress'];
    item: FeedEntourage;
  }>;

  joinEntourage(entourageUuid: string): Promise<{ status: FeedJoinStatus; }>;
  leaveEntourage(entourageUuid: string, userId: number): Promise<void | null>;
  closeEntourage(entourageUuid: string, success: boolean): Promise<void | null>;
  reopenEntourage(entourageUuid: string): Promise<void | null>;

}

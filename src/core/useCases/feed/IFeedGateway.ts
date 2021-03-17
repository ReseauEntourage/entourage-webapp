import { LocationState } from '../location'
import { FeedJoinStatus } from 'src/core/api'
import { FeedState, FeedItem } from './feed.reducer'

interface FeedItemsFilter {
  location: Pick<LocationState, 'center' | 'zoom'>;
  types: FeedState['filters'];
}

export interface IFeedGateway {
  retrieveFeedItems(data: {
    filters: FeedItemsFilter;
    nextPageToken?: FeedState['nextPageToken'];
  }): Promise<{
    items: FeedItem[];
    nextPageToken: FeedState['nextPageToken'];
  }>;

  retrieveFeedItem(data: { entourageUuid: string; }): Promise<Pick<LocationState, 'center' | 'displayAddress'>>;

  joinEntourage(entourageUuid: string): Promise<{ status: FeedJoinStatus; }>;
  leaveEntourage(entourageUuid: string, userId: number): Promise<void | null>;
  closeEntourage(entourageUuid: string, success: boolean): Promise<void | null>;
  reopenEntourage(entourageUuid: string): Promise<void | null>;

}

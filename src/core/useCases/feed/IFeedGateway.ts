import { PositionState } from '../position'
import { FeedJoinStatus } from 'src/core/api'
import { FeedState, FeedItem } from './feed.reducer'

export interface IFeedGateway {
  retrieveFeedItems(data: {
    filters: { center: PositionState['position']['center']; zoom: PositionState['position']['zoom']; };
    nextPageToken?: FeedState['nextPageToken'];
  }): Promise<{
    items: FeedItem[];
    nextPageToken: FeedState['nextPageToken'];
  }>;

  retrieveFeedItem(data: { entourageUuid: string; }): Promise<{
    center: {
      lat: number;
      lng: number;
    };
    cityName: string;
  }>;

  joinEntourage(entourageUuid: string): Promise<{ status: FeedJoinStatus; }>;
  leaveEntourage(entourageUuid: string, userId: number): Promise<void | null>;
  closeEntourage(entourageUuid: string, success: boolean): Promise<void | null>;
  reopenEntourage(entourageUuid: string): Promise<void | null>;

}

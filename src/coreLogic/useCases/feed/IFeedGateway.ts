import { FeedState, FeedItem } from './feed.reducer'

export interface IFeedGateway {
  retrieveFeedItems(data: {
    filters: Pick<FeedState['filters'], 'center' | 'zoom'>;
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

  joinEntourage(entourageUuid: string): Promise<void | null>;
  leaveEntourage(entourageUuid: string, userId: number): Promise<void | null>;
}

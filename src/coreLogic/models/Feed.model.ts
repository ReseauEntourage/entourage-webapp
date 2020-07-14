import { FeedItem } from './FeedItem.model'

export interface Feed {
  fetching: boolean;
  filters: {
    center: {
      lat: number;
      lng: number;
    };
    zoom: number;
  };
  items: FeedItem[];
  nextPageToken: string | null;
}

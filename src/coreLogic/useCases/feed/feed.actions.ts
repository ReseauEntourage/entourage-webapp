import { FeedItem } from 'src/coreLogic/models/FeedItem.model'

interface RetrieveFeed {
  filters?: {
    center: {
      lat: number;
      lng: number;
    };
    zoom: number;
  };
  type: 'RETRIEVE_FEED';
}

export function retrieveFeed(filters?: RetrieveFeed['filters']): RetrieveFeed {
  return {
    type: 'RETRIEVE_FEED',
    filters,
  }
}

interface RetrieveFeedSuccess {
  payload: {
    items: FeedItem[];
    nextPageToken: string | null;
  };
  type: 'RETRIEVE_FEED_SUCCESS';
}

export function retrieveFeedSuccess(payload: RetrieveFeedSuccess['payload']): RetrieveFeedSuccess {
  return {
    type: 'RETRIEVE_FEED_SUCCESS',
    payload,
  }
}

interface RetrieveFeedNextPage {
  type: 'RETRIEVE_FEED_NEXT_PAGE';
}

export function retrieveFeedNextPage(): RetrieveFeedNextPage {
  return {
    type: 'RETRIEVE_FEED_NEXT_PAGE',
  }
}

interface RetrieveFeedNextPageSuccess {
  payload: {
    items: FeedItem[];
    nextPageToken: string | null;
  };
  type: 'RETRIEVE_FEED_NEXT_PAGE_SUCCESS';
}

export function retrieveFeedNextPageSuccess(
  payload: RetrieveFeedNextPageSuccess['payload'],
): RetrieveFeedNextPageSuccess {
  return {
    type: 'RETRIEVE_FEED_NEXT_PAGE_SUCCESS',
    payload,
  }
}

export type FeedActions =
  | RetrieveFeed
  | RetrieveFeedSuccess
  | RetrieveFeedNextPage
  | RetrieveFeedNextPageSuccess

export const publicActions = {
  retrieveFeed,
  retrieveFeedNextPage,
}

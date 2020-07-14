import { AppState } from '../../AppState'
import { constants } from 'src/constants'
import { FeedActions } from './feed.actions'

type FeedState = AppState['feed']

export const initialState: FeedState = {
  fetching: false,
  items: [],
  filters: {
    center: constants.DEFAULT_LOCATION.CENTER,
    zoom: constants.DEFAULT_LOCATION.ZOOM,
  },
  nextPageToken: null,
}

export function feedReducer(state: FeedState = initialState, action: FeedActions): FeedState {
  switch (action.type) {
    case 'RETRIEVE_FEED': {
      return {
        ...state,
        fetching: true,
        filters: {
          ...state.filters,
          ...action.filters,
        },
      }
    }

    case 'RETRIEVE_FEED_SUCCESS': {
      return {
        ...state,
        fetching: false,
        items: action.payload.items,
        nextPageToken: action.payload.nextPageToken,
      }
    }

    case 'RETRIEVE_FEED_NEXT_PAGE': {
      return {
        ...state,
        fetching: state.nextPageToken !== null,
      }
    }

    case 'RETRIEVE_FEED_NEXT_PAGE_SUCCESS': {
      return {
        ...state,
        fetching: false,
        items: [
          ...state.items,
          ...action.payload.items,
        ],
        nextPageToken: action.payload.nextPageToken,
      }
    }

    default:
      return state
  }
}

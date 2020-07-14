import { AppState } from '../../AppState'

export function selectFeed(state: AppState): AppState['feed']['items'] {
  return state.feed.items
}

export function selectFeedFilters(state: AppState): AppState['feed']['filters'] {
  return state.feed.filters
}

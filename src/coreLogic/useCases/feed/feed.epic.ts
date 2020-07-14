import { ActionsObservable, StateObservable, ofType } from 'redux-observable'
import { map, switchMap, filter } from 'rxjs/operators'
import { AppState } from '../../AppState'
import { EntourageGateway } from 'src/coreLogic/gateways/EntourageGateway.interface'
import { FeedActions, retrieveFeedSuccess, retrieveFeedNextPageSuccess } from './feed.actions'

export const retrieveFeedEpic = (
  action$: ActionsObservable<FeedActions>,
  state$: StateObservable<AppState>,
  { entourageGateway }: { entourageGateway: EntourageGateway; },
) => action$.pipe(
  ofType('RETRIEVE_FEED'),
  switchMap(() => {
    return entourageGateway.retrieveFeed(
      {
        center: state$.value.feed.filters.center,
        zoom: state$.value.feed.filters.zoom,
      },
      null,
    ).pipe(
      map((feed) => retrieveFeedSuccess(feed)),
    )
  }),
)

export const retrieveFeedNextPageEpic = (
  action$: ActionsObservable<FeedActions>,
  state$: StateObservable<AppState>,
  { entourageGateway }: { entourageGateway: EntourageGateway; },
) => action$.pipe(
  ofType('RETRIEVE_FEED_NEXT_PAGE'),
  filter(() => state$.value.feed.nextPageToken !== null),
  switchMap(() => {
    return entourageGateway.retrieveFeed(
      {
        center: state$.value.feed.filters.center,
        zoom: state$.value.feed.filters.zoom,
      },
      state$.value.feed.nextPageToken,
    ).pipe(
      map((feed) => retrieveFeedNextPageSuccess(feed)),
    )
  }),
)

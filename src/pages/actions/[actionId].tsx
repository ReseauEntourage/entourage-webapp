import { NextPageContext } from 'next'
import React from 'react'
import { connect } from 'react-redux'
import { ActionsPage } from '../actions'
import { AppState } from 'src/core/boostrapStore'
import {
  feedActions,
  selectFeedIsFetching,
  selectFeedIsIdle,
  selectFeedItemDetailsIsFetching,
} from 'src/core/useCases/feed'
import { selectLocationIsInit } from 'src/core/useCases/location'
import { StatelessPage } from 'src/utils/types'

interface Props {}

const Action: StatelessPage<Props> = () => (
  <ActionsPage />
)

Action.getInitialProps = (context: NextPageContext) => {
  const { query, store } = context
  const actionId = query.actionId as string

  return new Promise((resolve) => {
    const storeUnsubcribe = store.subscribe(() => {
      const feedIsIdle = selectFeedIsIdle(store.getState())
      const feedIsFetching = selectFeedIsFetching(store.getState())
      const feedItemDetailsIsFetching = selectFeedItemDetailsIsFetching(store.getState())
      const locationIsInit = selectLocationIsInit(store.getState())

      const isReady = !feedIsIdle && !feedIsFetching && !feedItemDetailsIsFetching && locationIsInit

      if (isReady) {
        resolve()
        storeUnsubcribe()
      }
    })

    store.dispatch(feedActions.init())
    store.dispatch(feedActions.setCurrentFeedItemUuid(actionId))
  })
}

export default connect((state: AppState) => state)(Action)

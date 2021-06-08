import { AppContext } from 'next/app'
import React from 'react'
import { ActionsMetadata } from 'src/containers/ActionsMetadata'
import { MapActions } from 'src/containers/MapContainer'
import { wrapperStore } from 'src/core/boostrapStore'
import {
  feedActions,
  selectFeedIsFetching,
  selectFeedIsIdle,
  selectFeedItemDetailsIsFetching,
} from 'src/core/useCases/feed'
import { selectLocationIsInit } from 'src/core/useCases/location'
import { StatelessPage } from 'src/utils/types'

interface Props {}

const Actions: StatelessPage<Props> = () => {
  return (
    <>
      <ActionsMetadata />
      <MapActions />
    </>
  )
}

Actions.getInitialProps = wrapperStore.getInitialPageProps((store) => {
  return (ctx: AppContext['ctx']) => {
    const actionId = ctx.query.actionId as string

    if (actionId) {
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

    return Promise.resolve()
  }
})

export default Actions

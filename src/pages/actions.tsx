import { AppContext } from 'next/app'
import React from 'react'
import { ActionsMetadata } from '../containers/ActionsMetadata'
import { wrapperStore } from '../core/boostrapStore'
import { feedActions, selectFeedIsFetching, selectFeedIsIdle } from '../core/useCases/feed'
import { MapActions } from 'src/containers/MapContainer'
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
    const poiId = ctx.query.actionId as string

    if (poiId) {
      return new Promise((resolve) => {
        store.subscribe(() => {
          const feedIsIdle = selectFeedIsIdle(store.getState())
          const feedIsFetching = selectFeedIsFetching(store.getState())
          // const feedItemDetailsIsFetching = selectFeedItemDetailsIsFetching(store.getState())

          const isReady = !feedIsIdle && !feedIsFetching

          if (isReady) {
            resolve()
          }
        })

        store.dispatch(feedActions.init())
        store.dispatch(feedActions.setCurrentFeedItemUuid(poiId))
      })
    }

    return Promise.resolve()
  }
})

export default Actions

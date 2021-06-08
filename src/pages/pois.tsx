import { AppContext } from 'next/app'
import React from 'react'
import { selectLocationIsInit } from '../core/useCases/location'
import { MapPOIs } from 'src/containers/MapContainer'
import { POIsMetadata } from 'src/containers/POIsMetadata'
import { wrapperStore } from 'src/core/boostrapStore'
import {
  poisActions,
  selectPOIsIsIdle,
  selectPOIsIsFetching,
  selectPOIDetailsIsFetching,
} from 'src/core/useCases/pois'
import { StatelessPage } from 'src/utils/types'

interface Props {}

const POIs: StatelessPage<Props> = () => {
  return (
    <>
      <POIsMetadata />
      <MapPOIs />
    </>
  )
}

POIs.getInitialProps = wrapperStore.getInitialPageProps((store) => {
  return (ctx: AppContext['ctx']) => {
    const poiId = ctx.query.poiId as string

    if (poiId) {
      return new Promise((resolve) => {
        const storeUnsubcribe = store.subscribe(() => {
          const POIsIsIdle = selectPOIsIsIdle(store.getState())
          const POIsIsFetching = selectPOIsIsFetching(store.getState())
          const POIDetailsIsFetching = selectPOIDetailsIsFetching(store.getState())
          const locationIsInit = selectLocationIsInit(store.getState())

          const isReady = !POIsIsIdle && !POIsIsFetching && !POIDetailsIsFetching && locationIsInit

          if (isReady) {
            resolve()
            storeUnsubcribe()
          }
        })

        store.dispatch(poisActions.init())
        store.dispatch(poisActions.setCurrentPOIUuid(poiId))
      })
    }

    return Promise.resolve()
  }
})

export default POIs

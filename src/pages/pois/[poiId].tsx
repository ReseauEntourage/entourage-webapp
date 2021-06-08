import { NextPageContext } from 'next'
import React from 'react'
import { POIsPage } from '../pois'
import { selectLocationIsInit } from 'src/core/useCases/location'
import {
  poisActions,
  selectPOIsIsIdle,
  selectPOIsIsFetching,
  selectPOIDetailsIsFetching,
} from 'src/core/useCases/pois'
import { StatelessPage } from 'src/utils/types'

interface Props {}

const POI: StatelessPage<Props> = () => (
  <POIsPage />
)

POI.getInitialProps = (context: NextPageContext) => {
  const { query, store } = context

  const poiId = query.poiId as string

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

export default POI

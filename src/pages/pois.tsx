import { AppContext } from 'next/app'
import React from 'react'
import { SplashScreen } from 'src/components/SplashScreen'
import { MapPOIs } from 'src/containers/MapContainer'
import { POIsMetadata } from 'src/containers/POIsMetadata'
import { wrapperStore } from 'src/core/boostrapStore'
import { poisActions, selectPOIsIsIdle, selectPOIsIsFetching, selectPOIDetailsIsFetching } from 'src/core/useCases/pois'
import { useLoadGoogleMapApi } from 'src/utils/misc'
import { StatelessPage } from 'src/utils/types'

interface Props {}

const POIs: StatelessPage<Props> = () => {
  const googleMapApiIsLoaded = useLoadGoogleMapApi()

  return (
    <>
      <POIsMetadata />
      { !googleMapApiIsLoaded ? <SplashScreen /> : <MapPOIs /> }
    </>
  )
}

POIs.getInitialProps = wrapperStore.getInitialPageProps((store) => {
  return (ctx: AppContext['ctx']) => {
    const poiId = ctx.query.poiId as string

    return new Promise((resolve) => {
      store.subscribe(() => {
        const POIsIsIdle = selectPOIsIsIdle(store.getState())
        const POIsIsFetching = selectPOIsIsFetching(store.getState())
        const POIDetailsIsFetching = selectPOIDetailsIsFetching(store.getState())

        const isReady = !POIsIsIdle && !POIsIsFetching && !POIDetailsIsFetching

        if (isReady) {
          resolve()
        }
      })

      store.dispatch(poisActions.init())
      store.dispatch(poisActions.setCurrentPOIUuid(poiId))
    })
  }
})

export default POIs

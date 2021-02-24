import Head from 'next/head'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { MapPOIs, usePOIId } from 'src/containers/MapContainer'
import { useDefaultCityLocation } from 'src/containers/Nav'
import { locationActions } from 'src/core/useCases/location'
import { poisActions } from 'src/core/useCases/pois'
import { texts } from 'src/i18n'
import { useMount } from 'src/utils/hooks'
import { StatelessPage } from 'src/utils/types'

interface Props {}

const POIs: StatelessPage<Props> = () => {
  const dispatch = useDispatch()
  const poiId = usePOIId()
  const cityLocation = useDefaultCityLocation()

  useMount(() => {
    dispatch(poisActions.init())

    return () => {
      dispatch(poisActions.cancel())
    }
  })

  useEffect(() => {
    if (cityLocation) {
      dispatch(locationActions.setLocation({
        location: cityLocation,
      }))
    } else if (poiId) {
      dispatch(poisActions.setCurrentPOIUuid(poiId))
    } else {
      dispatch(poisActions.retrievePOIsOrInitLocation())
    }
  }, [poiId, dispatch, cityLocation])

  return (
    <>
      <Head>
        <title>{texts.nav.pageTitles.pois} - {texts.nav.pageTitles.main}</title>
      </Head>
      <MapPOIs />
    </>
  )
}

// Actions.getInitialProps = async (ctx) => {
//    Wait until React Queries support SSR. Coming soon
//    see https://github.com/tannerlinsley/react-query/issues/14
// }

export default POIs

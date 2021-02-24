import Head from 'next/head'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useDefaultCityLocation } from '../containers/Nav'
import { useActionId, MapActions } from 'src/containers/MapContainer'
import { feedActions } from 'src/core/useCases/feed'
import { locationActions } from 'src/core/useCases/location'
import { texts } from 'src/i18n'
import { useMount } from 'src/utils/hooks'
import { StatelessPage } from 'src/utils/types'

interface Props {}

const Actions: StatelessPage<Props> = () => {
  const dispatch = useDispatch()
  const actionId = useActionId()
  const cityLocation = useDefaultCityLocation()

  useMount(() => {
    dispatch(feedActions.init())
    return () => {
      dispatch(feedActions.cancel())
    }
  })

  useEffect(() => {
    if (cityLocation) {
      dispatch(locationActions.setLocation({
        location: cityLocation,
      }))
    } else if (actionId) {
      dispatch(feedActions.setCurrentItemUuid(actionId))
    } else {
      dispatch(feedActions.retrieveFeedOrInitPosition())
    }
  }, [actionId, cityLocation, dispatch])

  return (
    <>
      <Head>
        <title>{texts.nav.pageTitles.actions} - {texts.nav.pageTitles.main}</title>
      </Head>
      <MapActions />
    </>
  )
}

// Actions.getInitialProps = async (ctx) => {
//    Wait until React Queries support SSR. Coming soon
//    see https://github.com/tannerlinsley/react-query/issues/14
// }

export default Actions

import Head from 'next/head'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useActionId } from '../containers/MapContainer/useActionId'
import { MapContainer } from 'src/containers/MapContainer'
import { feedActions } from 'src/core/useCases/feed'
import { GoogleMapProvider } from 'src/utils/misc'
import { StatelessPage } from 'src/utils/types'

interface Props {}

const Actions: StatelessPage<Props> = () => {
  const dispatch = useDispatch()
  const actionId = useActionId()

  useEffect(() => {
    dispatch(feedActions.setCurrentItemUuid(actionId || null))
  }, [actionId, dispatch])

  return (
    <>
      <Head>
        <title>Actions</title>
      </Head>
      <GoogleMapProvider>
        <MapContainer />
      </GoogleMapProvider>
    </>
  )
}

// Actions.getInitialProps = async (ctx) => {
//    Wait until React Queries support SSR. Coming soon
//    see https://github.com/tannerlinsley/react-query/issues/14
// }

export default Actions

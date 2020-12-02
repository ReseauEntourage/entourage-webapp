import Head from 'next/head'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useActionId } from '../containers/MapContainer/useActionId'
import { MapContainer } from 'src/containers/MapContainer'
import { feedActions } from 'src/coreLogic/useCases/feed'
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
      <MapContainer />
    </>
  )
}

// Actions.getInitialProps = async (ctx) => {
//    Wait until React Queries support SSR. Coming soon
//    see https://github.com/tannerlinsley/react-query/issues/14
// }

export default Actions

import Head from 'next/head'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { MapActions } from '../containers/MapContainer/MapActions'
import { useActionId } from '../containers/MapContainer/useActionId'
import { feedActions } from 'src/core/useCases/feed'
import { texts } from 'src/i18n'
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

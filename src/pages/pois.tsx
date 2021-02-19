import Head from 'next/head'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { MapPOIs } from '../containers/MapContainer/MapPOIs'
import { usePOIId } from '../containers/MapContainer/usePOIId'
import { poisActions } from '../core/useCases/pois'
import { texts } from 'src/i18n'
import { StatelessPage } from 'src/utils/types'

interface Props {}

const POIs: StatelessPage<Props> = () => {
  const dispatch = useDispatch()
  const poiId = usePOIId()

  useEffect(() => {
    dispatch(poisActions.init())
    dispatch(poisActions.setCurrentPOIUuid(poiId || null))
  }, [poiId, dispatch])

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

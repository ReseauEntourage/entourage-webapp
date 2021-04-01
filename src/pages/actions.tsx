import Head from 'next/head'
import React from 'react'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { MapActions } from 'src/containers/MapContainer'
import { texts } from 'src/i18n'
import { useLoadGoogleMapApi } from 'src/utils/misc'
import { StatelessPage } from 'src/utils/types'

interface Props {}

const Actions: StatelessPage<Props> = () => {
  const googleMapApiIsLoaded = useLoadGoogleMapApi()

  return (
    <>
      <Head>
        <title>{texts.nav.pageTitles.actions} - {texts.nav.pageTitles.main}</title>
      </Head>
      { !googleMapApiIsLoaded ? <OverlayLoader /> : <MapActions /> }
    </>
  )
}

// Actions.getInitialProps = async (ctx) => {
//    Wait until React Queries support SSR. Coming soon
//    see https://github.com/tannerlinsley/react-query/issues/14
// }

export default Actions

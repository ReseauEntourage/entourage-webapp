import Head from 'next/head'
import React from 'react'
import { OverlayLoader } from 'src/components/OverlayLoader'
import { MapActions } from 'src/containers/MapContainer'
import { texts } from 'src/i18n'
import { useLoadGoogleMapApi } from 'src/utils/misc'
import { StatelessPage } from 'src/utils/types'

interface Props {}

const Actions: StatelessPage<Props> = () => {
  const googleMapIsLoaded = useLoadGoogleMapApi()

  return (
    <>
      <Head>
        <title>{texts.nav.pageTitles.actions} - {texts.nav.pageTitles.main}</title>
      </Head>
      { googleMapIsLoaded ? <MapActions /> : <OverlayLoader /> }
    </>
  )
}

// Actions.getInitialProps = async (ctx) => {
//    Wait until React Queries support SSR. Coming soon
//    see https://github.com/tannerlinsley/react-query/issues/14
// }

export default Actions

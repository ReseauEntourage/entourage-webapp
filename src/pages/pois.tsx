import Head from 'next/head'
import React from 'react'
import { SplashScreen } from 'src/components/SplashScreen'
import { MapPOIs } from 'src/containers/MapContainer'
import { texts } from 'src/i18n'
import { useLoadGoogleMapApi } from 'src/utils/misc'
import { StatelessPage } from 'src/utils/types'

interface Props {}

const POIs: StatelessPage<Props> = () => {
  const googleMapApiIsLoaded = useLoadGoogleMapApi()

  return (
    <>
      <Head>
        <title>{texts.nav.pageTitles.pois} - {texts.nav.pageTitles.main}</title>
      </Head>
      { !googleMapApiIsLoaded ? <SplashScreen /> : <MapPOIs /> }
    </>
  )
}

// Actions.getInitialProps = async (ctx) => {
//    Wait until React Queries support SSR. Coming soon
//    see https://github.com/tannerlinsley/react-query/issues/14
// }

export default POIs

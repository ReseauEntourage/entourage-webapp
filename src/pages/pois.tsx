import React from 'react'
import { SplashScreen } from 'src/components/SplashScreen'
import { MapPOIs } from 'src/containers/MapContainer'
import { MetaData } from 'src/containers/MetaData'
import { env } from 'src/core/env'
import { texts } from 'src/i18n'
import { useLoadGoogleMapApi } from 'src/utils/misc'
import { StatelessPage } from 'src/utils/types'

interface Props {}

const POIs: StatelessPage<Props> = () => {
  const googleMapApiIsLoaded = useLoadGoogleMapApi()

  return (
    <>
      <MetaData
        description={texts.nav.pageDescriptions.pois}
        title={`${texts.nav.pageTitles.pois} - ${texts.nav.pageTitles.main}`}
        url={`${env.SERVER_URL}/pois`}
      />
      { !googleMapApiIsLoaded ? <SplashScreen /> : <MapPOIs /> }
    </>
  )
}

// Actions.getInitialProps = async (ctx) => {
//    Wait until React Queries support SSR. Coming soon
//    see https://github.com/tannerlinsley/react-query/issues/14
// }

export default POIs

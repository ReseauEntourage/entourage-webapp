import React from 'react'
import { SplashScreen } from 'src/components/SplashScreen'
import { MapActions } from 'src/containers/MapContainer'
import { MetaData } from 'src/containers/MetaData'
import { env } from 'src/core/env'
import { texts } from 'src/i18n'
import { useLoadGoogleMapApi } from 'src/utils/misc'
import { StatelessPage } from 'src/utils/types'

interface Props {}

const Actions: StatelessPage<Props> = () => {
  const googleMapApiIsLoaded = useLoadGoogleMapApi()

  return (
    <>
      <MetaData
        description={texts.nav.pageDescriptions.actions}
        title={`${texts.nav.pageTitles.actions} - ${texts.nav.pageTitles.main}`}
        url={`${env.SERVER_URL}/actions`}
      />
      { !googleMapApiIsLoaded ? <SplashScreen /> : <MapActions /> }
    </>
  )
}

// Actions.getInitialProps = async (ctx) => {
//    Wait until React Queries support SSR. Coming soon
//    see https://github.com/tannerlinsley/react-query/issues/14
// }

export default Actions

import React from 'react'
import { Messages as MessagesComponent, useEntourageUuid } from 'src/containers/Messages'

import { MetaData } from 'src/containers/MetaData'
import { PrivateRoute } from 'src/containers/PrivateRoute'
import { env } from 'src/core/env'
import { texts } from 'src/i18n'
import { useFirebase, useMount } from 'src/utils/hooks'
import { StatelessPage } from 'src/utils/types'

interface Props {}

export const MessagesPage = () => {
  const { sendEvent } = useFirebase()
  const entourageUuid = useEntourageUuid()

  useMount(() => {
    sendEvent('View__Messages')
  })

  return (
    <>
      <MetaData
        title={`${texts.nav.pageTitles.messages} - ${texts.nav.pageTitles.main}`}
        url={`${env.SERVER_URL}/messages${entourageUuid ? `/${entourageUuid}` : ''}`}
      />
      <PrivateRoute>
        <MessagesComponent />
      </PrivateRoute>
    </>
  )
}

const Messages: StatelessPage<Props> = () => (
  <MessagesPage />
)

export default Messages

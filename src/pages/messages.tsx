import React from 'react'
import { Messages, useEntourageUuid } from 'src/containers/Messages'

import { MetaData } from 'src/containers/MetaData'
import { PrivateRoute } from 'src/containers/PrivateRoute'
import { env } from 'src/core/env'
import { texts } from 'src/i18n'
import { useFirebase, useMount } from 'src/utils/hooks'

export default function MessagesPage() {
  const { sendEvent } = useFirebase()
  const entourageUuid = useEntourageUuid()

  useMount(() => {
    sendEvent('View__Messages')
  })

  return (
    <>
      <MetaData
        title={`${texts.nav.pageTitles.messages} - ${texts.nav.pageTitles.main}`}
        url={`${env.SERVER_URL}/messages/${entourageUuid ?? ''}`}
      />
      <PrivateRoute>
        <Messages />
      </PrivateRoute>
    </>
  )
}

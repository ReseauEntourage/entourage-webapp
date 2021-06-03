import React from 'react'
import { Messages, useEntourageUuid } from 'src/containers/Messages'

import { MetaData } from 'src/containers/MetaData'
import { PrivateRoute } from 'src/containers/PrivateRoute'
import { env } from 'src/core/env'
import { texts } from 'src/i18n'
import { useFirebase, useMount } from 'src/utils/hooks'
import { StatelessPage } from 'src/utils/types'

interface MessagesProps {}

const MessagesPage: StatelessPage<MessagesProps> = () => {
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
        <Messages />
      </PrivateRoute>
    </>
  )
}

export default MessagesPage

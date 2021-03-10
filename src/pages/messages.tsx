import Head from 'next/head'
import React from 'react'
import { Messages } from 'src/containers/Messages'
import { PrivateRoute } from 'src/containers/PrivateRoute'
import { texts } from 'src/i18n'
import { useFirebase, useMount } from 'src/utils/hooks'
import { StatelessPage } from 'src/utils/types'

interface MessagesProps {}

const MessagesPage: StatelessPage<MessagesProps> = () => {
  const { sendEvent } = useFirebase()
  useMount(() => {
    sendEvent('View__Messages')
  })

  return (
    <>
      <Head>
        <title>{texts.nav.pageTitles.messages} - {texts.nav.pageTitles.main}</title>
      </Head>
      <PrivateRoute>
        <Messages />
      </PrivateRoute>
    </>
  )
}

export default MessagesPage

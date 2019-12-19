import Head from 'next/head'
import React from 'react'
import { Messages } from 'src/containers/Messages'
import { useRedirectOnLogout } from 'src/events'
import { StatelessPage } from 'src/utils/types'

interface MessagesProps {}

const MessagesPage: StatelessPage<MessagesProps> = () => {
  useRedirectOnLogout()

  return (
    <>
      <Head>
        <title>Message</title>
      </Head>
      <Messages />
    </>
  )
}

export default MessagesPage

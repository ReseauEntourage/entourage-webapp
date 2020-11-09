import Head from 'next/head'
import React from 'react'
import { Messages } from 'src/containers/Messages'
import { PrivateRoute } from 'src/containers/PrivateRoute'
import { StatelessPage } from 'src/utils/types'

interface MessagesProps {}

const MessagesPage: StatelessPage<MessagesProps> = () => {
  return (
    <>
      <Head>
        <title>Message</title>
      </Head>
      <PrivateRoute>
        <Messages />
      </PrivateRoute>
    </>
  )
}

export default MessagesPage

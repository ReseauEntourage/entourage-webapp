import Head from 'next/head'
import React from 'react'
import { Messages } from 'src/containers/Messages'
import { StatelessPage } from 'src/types'

interface MessagesProps {}

const MessagesPage: StatelessPage<MessagesProps> = () => {
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

import Head from 'next/head'
import React from 'react'
import { StatelessPage } from 'src/types'

interface MessagesProps {}

const Messages: StatelessPage<MessagesProps> = () => {
  return (
    <>
      <Head>
        <title>Message</title>
      </Head>
      <div>Messages...</div>
    </>
  )
}

export default Messages

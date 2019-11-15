import React, { useEffect } from 'react'
import Head from 'next/head'
import { autoLoginOnStart } from 'src/api/v1'

const Home: React.SFC = () => {
  useEffect(() => {
    autoLoginOnStart()
  })

  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        Home
      </div>
    </div>
  )
}

export default Home

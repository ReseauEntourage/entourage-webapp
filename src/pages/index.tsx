import React from 'react'
import Head from 'next/head'
import { Map } from 'src/components/Map'

const Home: React.SFC = () => {
  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>

      <div>
        <Map />
      </div>
    </div>
  )
}

export default Home

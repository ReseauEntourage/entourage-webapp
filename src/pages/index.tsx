import React from 'react'
import Head from 'next/head'
import { StatelessPage } from 'src/types'
import { MapContainer } from 'src/containers/MapContainer'

interface Props {}

const Home: StatelessPage<Props> = () => {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <MapContainer />
    </>
  )
}

// Home.getInitialProps = async (ctx) => {
//    Wait until React Queries support SSR. Coming soon
//    see https://github.com/tannerlinsley/react-query/issues/14
// }

export default Home

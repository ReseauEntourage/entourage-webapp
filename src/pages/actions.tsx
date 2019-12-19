import Head from 'next/head'
import React from 'react'
import { MapContainer } from 'src/containers/MapContainer'
import { StatelessPage } from 'src/utils/types'

interface Props {}

const Actions: StatelessPage<Props> = () => {
  return (
    <>
      <Head>
        <title>Actions</title>
      </Head>
      <MapContainer />
    </>
  )
}

// Actions.getInitialProps = async (ctx) => {
//    Wait until React Queries support SSR. Coming soon
//    see https://github.com/tannerlinsley/react-query/issues/14
// }

export default Actions

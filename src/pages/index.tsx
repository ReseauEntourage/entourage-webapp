import Head from 'next/head'
import React, { useEffect } from 'react'
import { StatelessPage } from 'src/utils/types'

interface Props {}

const Home: StatelessPage<Props> = () => {
  useEffect(() => {
    // temp hard redirection
    window.location.href = '/actions'
  }, [])

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
    </>
  )
}

// Home.getInitialProps = async (ctx) => {
//    Wait until React Queries support SSR. Coming soon
//    see https://github.com/tannerlinsley/react-query/issues/14
// }

export default Home

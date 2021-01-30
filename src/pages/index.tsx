import Head from 'next/head'
import React, { useEffect } from 'react'
import { texts } from '../i18n'
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
        <title>{texts.nav.pageTitles.main}</title>
      </Head>
    </>
  )
}

// Home.getInitialProps = async (ctx) => {
//    Wait until React Queries support SSR. Coming soon
//    see https://github.com/tannerlinsley/react-query/issues/14
// }

export default Home

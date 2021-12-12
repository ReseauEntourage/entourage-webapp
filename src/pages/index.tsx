import React from 'react'
import { MetaData } from 'src/containers/MetaData'
import { env } from 'src/core/env'
import { StatelessPage } from 'src/utils/types'

interface Props {}

const Home: StatelessPage<Props> = () => {
  return (
    <MetaData url={env.SERVER_URL} />
  )
}

// Home.getInitialProps = async (ctx) => {
//    Wait until React Queries support SSR. Coming soon
//    see https://github.com/tannerlinsley/react-query/issues/14
// }

export default Home

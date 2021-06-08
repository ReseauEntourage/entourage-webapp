import React from 'react'
import { MetaData } from 'src/containers/MetaData'
import { env } from 'src/core/env'
import { StatelessPage } from 'src/utils/types'

interface Props {}

const Home: StatelessPage<Props> = () => {
  return (
    <>
      <MetaData url={env.SERVER_URL} />
    </>
  )
}

export default Home

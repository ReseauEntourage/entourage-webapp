import React from 'react'
import Head from 'next/head'
import { StatelessPage } from 'src/types'
import { Map, DefaultMarker } from 'src/components/Map'
import { api } from 'src/api'
import { actions, useReadResource } from 'src/store'

interface Props {
  requestKey: string;
}

const Home: StatelessPage<Props> = (props: Props) => {
  const { requestKey } = props
  const [feeds] = useReadResource('feeds', requestKey)

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Map>
        {feeds.map((feed) => {
          const { location, id } = feed
          return (
            <DefaultMarker
              key={id}
              lat={location.latitude}
              lng={location.longitude}
              type="default"
            />
          )
        })}
      </Map>
    </>
  )
}

Home.getInitialProps = async (ctx) => {
  const Paris = {
    lat: 48.8564918,
    lng: 2.3348084,
    zoom: 12.85,
  }

  const res = await api.ssr(ctx).request({
    routeName: 'GET feeds',
    params: {
      timeRange: 36000,
      latitude: Paris.lat,
      longitude: Paris.lng,
    },
  })

  const { requestKey } = ctx.store.dispatch(actions.fetchResources('feeds', res))

  return {
    requestKey,
  }
}

export default Home

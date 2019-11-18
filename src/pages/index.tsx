import React from 'react'
import Head from 'next/head'
import { StatelessPage } from 'src/types'
import { Map, DefaultMarker } from 'src/components/Map'
import { api, RequestResponse } from 'src/api'

interface Props {
  feeds: RequestResponse<'GET feeds'>['feeds'];
}

const Home: StatelessPage<Props> = ({ feeds }: Props) => {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Map>
        {feeds.map((feed) => {
          const { location, id } = feed.data
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
  try {
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

    const { feeds } = res.data

    return {
      feeds,
    }
  } catch (e) {
    return {
      feeds: [],
    }
  }
}

export default Home

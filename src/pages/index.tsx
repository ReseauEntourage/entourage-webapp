import React, { useEffect, useCallback, useState } from 'react'
import Head from 'next/head'
import { StatelessPage } from 'src/types'
import {
  Map, EventMarker, POIMarker, useMapContext, MapContextValue,
} from 'src/components/Map'
import { api } from 'src/api'
import { actions, useReadResource, useStore } from 'src/store'
import { usePrevious } from 'src/hooks'

function useMapUpdated(currentMapContext: MapContextValue) {
  const prevMapContext = usePrevious(currentMapContext)

  const currentValue = currentMapContext.value
  const prevValue = prevMapContext && prevMapContext.value

  if (!prevValue) {
    return false
  }

  const zoomChanged = prevValue.zoom !== currentValue.zoom
  const latChanged = prevValue.center.lat !== currentValue.center.lat
  const lngChanged = prevValue.center.lng !== currentValue.center.lng

  return zoomChanged || latChanged || lngChanged
}

interface Props {
  feedsRequestKey: string;
  POIsRequestKey: string;
}

const Home: StatelessPage<Props> = (props: Props) => {
  const { feedsRequestKey, POIsRequestKey } = props
  const [localFeedsRequestKey, setLocalFeedsRequestKey] = useState(feedsRequestKey)
  const [localPOIsRequestKey, setLocalPOIsRequestKey] = useState(POIsRequestKey)
  const mapContext = useMapContext()
  const mapUpdated = useMapUpdated(mapContext)
  const [feeds] = useReadResource('feeds', localFeedsRequestKey)
  const [POIs] = useReadResource('pois', localPOIsRequestKey)

  const store = useStore()

  const refetchFeeds = useCallback(async () => {
    const feedsResponse = await api.request({
      routeName: 'GET feeds',
      params: {
        timeRange: 36000,
        latitude: mapContext.value.center.lat,
        longitude: mapContext.value.center.lng,
      },
    })

    const { requestKey } = store.dispatch(actions.fetchResources('feeds', feedsResponse))
    setLocalFeedsRequestKey(requestKey)
  }, [mapContext.value.center.lat, mapContext.value.center.lng, store])

  const refetchPOIs = useCallback(async () => {
    const POIsResponse = await api.request({
      routeName: 'GET pois',
      params: {
        distance: 5,
        latitude: mapContext.value.center.lat,
        longitude: mapContext.value.center.lng,
        categoryIds: '1,2,3,4,5,6,7',
      },
    })

    const { requestKey } = store.dispatch(actions.fetchResources('pois', POIsResponse))
    setLocalPOIsRequestKey(requestKey)
  }, [mapContext.value.center.lat, mapContext.value.center.lng, store])

  useEffect(() => {
    if (mapUpdated) {
      refetchFeeds()
      refetchPOIs()
    }
  })


  const feedsContent = feeds.map((feed) => {
    const { location, id } = feed
    return (
      <EventMarker
        key={id}
        lat={location.latitude}
        lng={location.longitude}
      />
    )
  })

  const POIsContent = POIs.map((poi) => (
    <POIMarker
      key={poi.id}
      lat={poi.latitude}
      lng={poi.longitude}
      category={poi.category}
    />
  ))

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Map>
        {POIsContent}
        {feedsContent}
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

  const feedsResponse = await api.ssr(ctx).request({
    routeName: 'GET feeds',
    params: {
      timeRange: 36000,
      latitude: Paris.lat,
      longitude: Paris.lng,
    },
  })

  const { requestKey: feedsRequestKey } = ctx.store.dispatch(actions.fetchResources('feeds', feedsResponse))

  const POIsResponse = await api.ssr(ctx).request({
    routeName: 'GET pois',
    params: {
      distance: 5,
      latitude: Paris.lat,
      longitude: Paris.lng,
      categoryIds: '1,2,3,4,5,6,7',
    },
  })

  const { requestKey: POIsRequestKey } = ctx.store.dispatch(actions.fetchResources('pois', POIsResponse))

  return {
    feedsRequestKey,
    POIsRequestKey,
  }
}

export default Home

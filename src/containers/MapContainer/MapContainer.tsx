import React from 'react'
import { useQuery } from 'react-query'
import { api } from 'src/api'
import {
  Map, EventMarker, POIMarker, useMapContext,
} from 'src/components/Map'

function useFeeds() {
  const mapContext = useMapContext()

  const feedsParams = {
    timeRange: 36000,
    latitude: mapContext.value.center.lat,
    longitude: mapContext.value.center.lng,
  }

  const { data } = useQuery(['feeds', feedsParams], (params) => api.request({
    routeName: 'GET feeds',
    params,
  }), { staleTime: 1000 * 60 })

  return data
}

function usePOIs() {
  const mapContext = useMapContext()

  const POIsParams = {
    distance: 5,
    latitude: mapContext.value.center.lat,
    longitude: mapContext.value.center.lng,
    categoryIds: '1,2,3,4,5,6,7',
  }

  const { data } = useQuery(['POIs', POIsParams], (params) => api.request({
    routeName: 'GET pois',
    params,
  }), { staleTime: 1000 * 60 })

  return data
}

export function MapContainer() {
  const feeds = useFeeds()
  const POIs = usePOIs()

  const feedsContent = feeds && feeds.data.feeds.map((feed) => {
    const { location, id } = feed.data
    return (
      <EventMarker
        key={id}
        lat={location.latitude}
        lng={location.longitude}
      />
    )
  })

  const POIsContent = POIs && POIs.data.pois.map((poi) => (
    <POIMarker
      key={poi.id}
      lat={poi.latitude}
      lng={poi.longitude}
      category={poi.category}
    />
  ))

  return (
    <Map>
      {POIsContent}
      {feedsContent}
    </Map>
  )
}

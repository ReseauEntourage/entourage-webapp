import GoogleMapReact, { ChangeEventValue } from 'google-map-react'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { OverlayLoader } from '../OverlayLoader'
import { constants } from 'src/constants'
import { selectFeedFilters, feedActions } from 'src/core/useCases/feed'
import { useLoadGoogleMapApi } from 'src/utils/misc'
import { AnyToFix } from 'src/utils/types'

interface Props {
  /**
   * It's possible to have multiple map children, like {data.map(obj => (<div />))} .
   * Need to find the correct type
   */
  children: AnyToFix;
}

export function Map(props: Props) {
  const { children } = props
  const filters = useSelector(selectFeedFilters)
  const dispatch = useDispatch()
  const googleMapIsLoaded = useLoadGoogleMapApi()

  function onChange(value: ChangeEventValue) {
    const filtersHasChanged = filters.center.lat !== value.center.lat
      || filters.center.lng !== value.center.lng
      || filters.zoom !== value.zoom

    if (filtersHasChanged) {
      dispatch(feedActions.setFilters({
        center: value.center,
        zoom: value.zoom,
      }))
    }
  }

  if (!googleMapIsLoaded) {
    return <OverlayLoader />
  }

  return (
    <GoogleMapReact
      center={filters.center}
      defaultCenter={constants.DEFAULT_LOCATION.CENTER}
      defaultZoom={constants.DEFAULT_LOCATION.ZOOM}
      onChange={(nextValue) => onChange(nextValue)}
      yesIWantToUseGoogleMapApiInternals={true}
    >
      {children}
    </GoogleMapReact>
  )
}

import GoogleMapReact, { ChangeEventValue } from 'google-map-react'
import React, { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { constants } from 'src/constants'
import { locationActions, selectLocation } from 'src/core/useCases/location'
import { useFirebase } from 'src/utils/hooks'
import { AnyToFix } from 'src/utils/types'

interface Props {
  /**
   * It's possible to have multiple map children, like {data.map(obj => (<div />))} .
   * Need to find the correct type
   */
  children: AnyToFix;
}

const coordinatesHasChanged = (
  oldCoordinates: google.maps.LatLngLiteral,
  newCoordinates: google.maps.LatLngLiteral,
) => {
  const latHasChanged = Math.abs(oldCoordinates.lat - newCoordinates.lat) > (1 / 1e3)
  const lngHasChanged = Math.abs(oldCoordinates.lng - newCoordinates.lng) > (1 / 1e3)

  return latHasChanged || lngHasChanged
}

export function Map(props: Props) {
  const { children } = props
  const position = useSelector(selectLocation)
  const dispatch = useDispatch()
  const { sendEvent } = useFirebase()
  const prevOnChangeValue = useRef(position.center)

  function onChange(value: ChangeEventValue) {
    // use coordinatesHasChanged so that tiny fluctuations of the map's center position are ignored
    const positionHasChanged = (coordinatesHasChanged(position.center, value.center)
    // use prevOnChangeValue to avoid loop updates of the value when the map moves because of a state update
      && coordinatesHasChanged(prevOnChangeValue.current, value.center))
      || position.zoom !== value.zoom

    if (positionHasChanged) {
      prevOnChangeValue.current = value.center

      sendEvent('Action__Map__PanZoom')

      dispatch(locationActions.setLocation({
        location: {
          center: value.center,
          zoom: value.zoom,
        },
        getDisplayAddressFromCoordinates: true,
      }))
    }
  }

  return (
    <GoogleMapReact
      center={position.center}
      defaultCenter={constants.DEFAULT_LOCATION.CENTER}
      defaultZoom={constants.DEFAULT_LOCATION.ZOOM}
      onChange={(nextValue) => onChange(nextValue)}
      options={{ fullscreenControl: false }}
      yesIWantToUseGoogleMapApiInternals={true}
    >
      {children}
    </GoogleMapReact>
  )
}

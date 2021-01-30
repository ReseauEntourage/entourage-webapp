import GoogleMapReact, { ChangeEventValue } from 'google-map-react'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { positionActions, selectPosition } from '../../core/useCases/position'
import { OverlayLoader } from '../OverlayLoader'
import { constants } from 'src/constants'
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
  const position = useSelector(selectPosition)
  const dispatch = useDispatch()
  const googleMapIsLoaded = useLoadGoogleMapApi()

  function onChange(value: ChangeEventValue) {
    const positionHasChanged = position.center.lat !== value.center.lat
      || position.center.lng !== value.center.lng
      || position.zoom !== value.zoom

    if (positionHasChanged) {
      dispatch(positionActions.setPosition({
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

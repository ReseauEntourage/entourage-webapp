import dynamic from 'next/dynamic'
import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GoogleMapLocationValue } from 'src/components/GoogleMapLocation'
import { selectFeedIsIdle } from 'src/core/useCases/feed'
import { locationActions, selectLocation } from 'src/core/useCases/location'
import { selectPOIsIsIdle } from 'src/core/useCases/pois'
import { getDetailPlacesService, assertIsNumber, assertIsString } from 'src/utils/misc'
import * as S from './SearchCity.styles'

const GoogleMapLocation = dynamic(() => import('src/components/GoogleMapLocation'), { ssr: false })

export function SearchCity() {
  const position = useSelector(selectLocation)
  const dispatch = useDispatch()
  const feedIsIdle = useSelector(selectFeedIsIdle)
  const poisIsIdle = useSelector(selectPOIsIsIdle)
  const defaultValue = position.displayAddress

  const onChange = useCallback(async (value: GoogleMapLocationValue) => {
    const placeDetail = await getDetailPlacesService(value.place.place_id, value.sessionToken)

    const lat = placeDetail.geometry?.location.lat()
    const lng = placeDetail.geometry?.location.lng()
    const address = placeDetail.formatted_address

    assertIsNumber(lat)
    assertIsNumber(lng)
    assertIsString(address)

    dispatch(
      locationActions.setLocation({
        location: {
          center: {
            lat,
            lng,
          },
          displayAddress: address,
        },
      }),
    )
  }, [dispatch])

  if (feedIsIdle && poisIsIdle) {
    return null
  }

  return (
    <S.Container>
      <GoogleMapLocation
        defaultValue={defaultValue}
        inputValue={position.displayAddress}
        onChange={onChange}
        textFieldProps={{}}
      />
    </S.Container>
  )
}

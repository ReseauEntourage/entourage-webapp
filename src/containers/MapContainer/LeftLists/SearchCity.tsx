import dynamic from 'next/dynamic'
import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GoogleMapLocationValue } from 'src/components/GoogleMapLocation'
import { selectFeedIsIdle } from 'src/core/useCases/feed'
import { locationActions, selectPosition } from 'src/core/useCases/location'
import { selectPOIsIsIdle } from 'src/core/useCases/pois'
import { getDetailPlacesService, assertIsNumber } from 'src/utils/misc'
import * as S from './SearchCity.styles'

const GoogleMapLocation = dynamic(() => import('src/components/GoogleMapLocation'), { ssr: false })

export function SearchCity() {
  const position = useSelector(selectPosition)
  const dispatch = useDispatch()
  const feedIsIdle = useSelector(selectFeedIsIdle)
  const poisIsIdle = useSelector(selectPOIsIsIdle)
  const defaultInputValue = position.cityName

  const onChange = useCallback(async (value: GoogleMapLocationValue) => {
    const placeDetail = await getDetailPlacesService(value.place.place_id, value.sessionToken)

    const lat = placeDetail.geometry?.location.lat()
    const lng = placeDetail.geometry?.location.lng()

    assertIsNumber(lat)
    assertIsNumber(lng)

    dispatch(
      locationActions.setPosition({
        ...position,
        center: {
          lat,
          lng,
        },
      }),
    )
  }, [dispatch, position])

  if (feedIsIdle && poisIsIdle) {
    return null
  }

  return (
    <S.Container>
      <GoogleMapLocation
        defaultValue={defaultInputValue}
        onChange={onChange}
        textFieldProps={{}}
      />
    </S.Container>
  )
}

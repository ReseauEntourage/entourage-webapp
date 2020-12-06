import dynamic from 'next/dynamic'
import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GoogleMapLocationValue } from 'src/components/GoogleMapLocation'
import { selectFeedFilters, feedActions, selectFeedIsIdle } from 'src/core/useCases/feed'
import { getDetailPlacesService, assertIsNumber } from 'src/utils/misc'
import * as S from './SearchCity.styles'

const GoogleMapLocation = dynamic(() => import('src/components/GoogleMapLocation'), { ssr: false })

export function SearchCity() {
  const filters = useSelector(selectFeedFilters)
  const dispatch = useDispatch()
  const feedIsIdle = useSelector(selectFeedIsIdle)
  const defaultInputValue = filters.cityName

  const onChange = useCallback(async (value: GoogleMapLocationValue) => {
    const placeDetail = await getDetailPlacesService(value.place.place_id, value.googleSessionToken)

    const lat = placeDetail.geometry?.location.lat()
    const lng = placeDetail.geometry?.location.lng()

    assertIsNumber(lat)
    assertIsNumber(lng)

    dispatch(
      feedActions.setFilters({
        ...filters,
        center: {
          lat,
          lng,
        },
      }),
    )
  }, [dispatch, filters])

  if (feedIsIdle) {
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

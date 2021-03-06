import dynamic from 'next/dynamic'
import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GoogleMapLocationValue } from 'src/components/GoogleMapLocation'
import { constants } from 'src/constants'
import { locationActions, selectLocation } from 'src/core/useCases/location'
import { useFirebase } from 'src/utils/hooks'
import { getDetailPlacesService, assertIsNumber, assertIsString } from 'src/utils/misc'
import { Filters } from './Filters'
import * as S from './SearchCity.styles'

const GoogleMapLocation = dynamic(() => import('src/components/GoogleMapLocation'), { ssr: false })

interface SearchCityProps {
  filters?: JSX.Element;
}

export function SearchCity(props: SearchCityProps) {
  const { filters } = props
  const position = useSelector(selectLocation)
  const dispatch = useDispatch()
  const { sendEvent } = useFirebase()

  const defaultValue = position.displayAddress

  const onChange = useCallback(async (value: GoogleMapLocationValue) => {
    sendEvent('Action__Map__Search')

    const placeDetail = await getDetailPlacesService(value.place.place_id, value.sessionToken)

    const lat = placeDetail.geometry?.location.lat()
    const lng = placeDetail.geometry?.location.lng()
    const address = placeDetail.formatted_address

    assertIsNumber(lat)
    assertIsNumber(lng)
    assertIsString(address)

    dispatch(
      locationActions.setMapPosition({
        center: {
          lat,
          lng,
        },
        zoom: constants.DEFAULT_LOCATION.ZOOM,
      }),
    )
    dispatch(
      locationActions.setLocation({
        location: {
          center: {
            lat,
            lng,
          },
          displayAddress: address,
          zoom: constants.DEFAULT_LOCATION.ZOOM,
        },
      }),
    )
  }, [dispatch, sendEvent])

  const onClickCurrentPosition = useCallback(() => {
    sendEvent('Action__Map__Geolocation')
    dispatch(locationActions.getGeolocation({
      updateLocationFilter: true,
    }))
  }, [dispatch, sendEvent])

  return (
    <S.Container>
      <S.SearchContainer>
        <GoogleMapLocation
          defaultValue={defaultValue}
          inputValue={position.displayAddress}
          onChange={onChange}
          onClickCurrentPosition={onClickCurrentPosition}
          textFieldProps={{ margin: 'none' }}
        />
      </S.SearchContainer>
      <S.FilterContainer>
        <Filters filters={filters} />
      </S.FilterContainer>
    </S.Container>
  )
}

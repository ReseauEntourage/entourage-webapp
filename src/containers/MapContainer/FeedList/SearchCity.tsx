import dynamic from 'next/dynamic'
import React, { useCallback } from 'react'
import { GoogleMapLocationValue } from 'src/components/GoogleMapLocation'
import { useMapContext } from 'src/components/Map'
import { constants } from 'src/constants'
import { getDetailPlacesService, assertIsNumber } from 'src/utils/misc'
import * as S from './SearchCity.styles'

const GoogleMapLocation = dynamic(() => import('src/components/GoogleMapLocation'), { ssr: false })

export function SearchCity() {
  const mapContext = useMapContext()
  const onChange = useCallback(async (value: GoogleMapLocationValue) => {
    const placeDetail = await getDetailPlacesService(value.place.place_id, value.googleSessionToken)

    const lat = placeDetail.geometry?.location.lat()
    const lng = placeDetail.geometry?.location.lng()

    assertIsNumber(lat)
    assertIsNumber(lng)

    mapContext.onChange((prevValue) => ({
      ...prevValue,
      center: {
        lat,
        lng,
      },
    }))
  }, [mapContext])

  return (
    <S.Container>
      <GoogleMapLocation
        defaultValue={mapContext.value.cityName || constants.DEFAULT_LOCATION.CITY_NAME}
        onChange={onChange}
        textFieldProps={{}}
      />
    </S.Container>
  )
}

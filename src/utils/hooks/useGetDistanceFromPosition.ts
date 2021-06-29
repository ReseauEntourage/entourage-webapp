import { getDistance } from 'geolib'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { selectGeolocation } from 'src/core/useCases/location'

export function useGetDistanceFromPosition() {
  const geolocation = useSelector(selectGeolocation)

  return useCallback((coordinates: { latitude: number; longitude: number;}) => {
    if (geolocation) {
      const { lat, lng } = geolocation

      const distanceInMeters = getDistance({ lat, lng }, coordinates)

      if (distanceInMeters > 1000) {
        return `à ${Math.round(distanceInMeters / 1000)} km`
      }
      return `à ${distanceInMeters.toString()} m`
    }

    return null
  }, [geolocation])
}

import { constants } from 'src/constants'
import { LocationErrorGeolocationRefused, IGeolocationService } from 'src/core/useCases/location'
import { getDetailPlacesFromCoordinatesService, isSSR } from 'src/utils/misc'

export class GeolocationService implements IGeolocationService {
  getGeolocation: IGeolocationService['getGeolocation'] = () => {
    const positionOptions = {
      timeout: constants.GEOLOCATION_TIMEOUT,
      maximumAge: constants.GEOLOCATION_TTL,
    }

    if (!isSSR && 'geolocation' in navigator) {
      return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition((position: Position) => {
          const coordinates = position.coords
          res({
            coordinates: {
              lat: coordinates.latitude,
              lng: coordinates.longitude,
            },
          })
        },
        () => {
          rej(new LocationErrorGeolocationRefused())
        },
        positionOptions)
      })
    }

    throw new LocationErrorGeolocationRefused()
  }

  getPlaceAddressFromCoordinates: IGeolocationService['getPlaceAddressFromCoordinates'] = (coordinates) => {
    return getDetailPlacesFromCoordinatesService(coordinates)
      .then((places: google.maps.GeocoderResult[]) => {
        if (places && Array.isArray(places) && places.length > 0) {
          const streetAddress = places.find((place) => {
            return place.types.includes('street_address')
          })

          const neighborhoodAddress = places.find((place) => {
            return place.types.includes('neighborhood')
          })

          const localityAddress = places.find((place) => {
            return place.types.includes('locality')
          })

          if (neighborhoodAddress) {
            return ({ placeAddress: neighborhoodAddress.formatted_address })
          }

          if (localityAddress) {
            return ({ placeAddress: localityAddress.formatted_address })
          }

          return ({ placeAddress: streetAddress ? streetAddress.formatted_address : null })
        }
        return ({ placeAddress: null })
      })
  }
}

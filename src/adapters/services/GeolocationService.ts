import { constants } from 'src/constants'
import { LocationErrorGeolocationRefused, IGeolocationService } from 'src/core/useCases/location'
import { getDetailPlacesFromCoordinatesService, isSSR } from 'src/utils/misc'

export class GeolocationService implements IGeolocationService {
  getGeolocation: IGeolocationService['getGeolocation'] = () => {
    const positionOptions = {
      timeout: constants.GEOLOCATION_TIMEOUT,
      maximumAge: constants.GEOLOCATION_TTL,
      enableHighAccuracy: false,
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

  getPlaceAddressFromCoordinates: IGeolocationService['getPlaceAddressFromCoordinates'] = (
    coordinates,
    getGooglePlaceId,
  ) => {
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
            return {
              placeAddress: neighborhoodAddress.formatted_address,
              googlePlaceId: getGooglePlaceId ? neighborhoodAddress.place_id : null,
            }
          }

          if (localityAddress) {
            return {
              placeAddress: localityAddress.formatted_address,
              googlePlaceId: getGooglePlaceId ? localityAddress.place_id : null,
            }
          }

          return {
            placeAddress: streetAddress ? streetAddress.formatted_address : null,
            googlePlaceId: streetAddress && getGooglePlaceId ? streetAddress.place_id : null,
          }
        }
        return {
          placeAddress: null,
          googlePlaceId: null,
        }
      })
  }
}

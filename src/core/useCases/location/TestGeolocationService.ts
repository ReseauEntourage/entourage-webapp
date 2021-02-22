import { jestFn } from '../../utils/jestFn'
import { IGeolocationService } from './IGeolocationService'

export class TestGeolocationService implements IGeolocationService {
  getGeolocation = jestFn<IGeolocationService['getGeolocation']>('getGeolocation')

  getPlaceAddressFromCoordinates =
  jestFn<IGeolocationService['getPlaceAddressFromCoordinates']>('getPlaceAddressFromCoordinates')
}

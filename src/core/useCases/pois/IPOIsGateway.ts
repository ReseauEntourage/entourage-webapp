import { LocationState } from '../location'
import { POI, POIDetails } from './pois.reducer'

export interface IPOIsGateway {
  retrievePOIs(data: {
    filters: { center: LocationState['position']['center']; zoom: LocationState['position']['zoom']; };
  }): Promise<{
    pois: POI[];
  }>;

  retrievePOI(data: { poiUuid: string; }): Promise<{
    poiDetails: POIDetails;
  }>;

}

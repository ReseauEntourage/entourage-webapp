import { LocationState } from '../location'
import { POI, POIDetails } from './pois.reducer'

export interface IPOIsGateway {
  retrievePOIs(data: { filters: Pick<LocationState, 'center' | 'zoom'>; }): Promise<{
    pois: POI[];
  }>;

  retrievePOI(data: { poiUuid: string; }): Promise<{
    poiDetails: POIDetails;
  }>;

}

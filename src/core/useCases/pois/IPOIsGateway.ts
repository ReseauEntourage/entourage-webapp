import { LocationState } from '../location'
import { POI, POIDetails } from './pois.reducer'

interface FeedPOIsFilter {
  location: Pick<LocationState, 'center' | 'zoom'>;
  categories: string;
}

export interface IPOIsGateway {
  retrievePOIs(data: { filters: FeedPOIsFilter; }): Promise<{
    pois: POI[];
  }>;

  retrievePOI(data: { poiUuid: string; }): Promise<{
    poiDetails: POIDetails;
  }>;

}

import { LocationState } from '../location'
import { POICategoriesIds, POIPartnersFilters } from 'src/core/api'
import { POI, POIDetails } from './pois.reducer'

interface POIsFilter {
  location: Pick<LocationState, 'center' | 'zoom'>;
  categories?: POICategoriesIds;
  partners?: POIPartnersFilters;
}

export interface IPOIsGateway {
  retrievePOIs(data: { filters: POIsFilter; }): Promise<{
    pois: POI[];
  }>;

  retrievePOI(data: { poiUuid: string; }): Promise<{
    poiDetails: POIDetails;
  }>;

}

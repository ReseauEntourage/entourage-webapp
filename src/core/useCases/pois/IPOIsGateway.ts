import { PositionState } from '../position'
import { POI, POIDetails } from './pois.reducer'

export interface IPOIsGateway {
  retrievePOIs(data: {
    filters: { center: PositionState['position']['center']; zoom: PositionState['position']['zoom']; };
  }): Promise<{
    pois: POI[];
  }>;

  retrievePOI(data: { poiUuid: string; }): Promise<{
    poiDetails: POIDetails;
  }>;

}

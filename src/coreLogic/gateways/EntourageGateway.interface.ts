import { Observable } from 'rxjs'
import { FeedItem } from 'src/coreLogic/models/FeedItem.model'
import { User } from 'src/coreLogic/models/User.model'

export interface EntourageGateway {
  authenticateUser(): Observable<User | null>;

  retrieveFeed(
    filters: {
      center: { lat: number; lng: number; };
      zoom: number;
    },
    nextPageToken: string | null,
  ): Observable<{
    items: FeedItem[];
    nextPageToken: string | null;
  }>;
}

import { Observable } from 'rxjs'

export interface EntourageGateway {
  authenticateUser(): Observable<null | {
    firstName: string;
    id: number;
    lastName: string;
    uuid: string;
  }>;
}

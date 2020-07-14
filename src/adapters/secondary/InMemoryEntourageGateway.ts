/* eslint-disable no-underscore-dangle */
import { of } from 'rxjs'
import { delay } from 'rxjs/operators'
import { EntourageGateway } from 'src/coreLogic/gateways/EntourageGateway.interface'
import { Feed } from 'src/coreLogic/models/Feed.model'
import { User } from 'src/coreLogic/models/User.model'
import { assertIsDefined } from 'src/utils/misc'

export class InMemoryEntourageGateway implements EntourageGateway {
  private _delayResponse = 0

  private response<T>(data: T) {
    const response = of(data)

    if (this._delayResponse) {
      return response.pipe(
        delay(this._delayResponse),
      )
    }

    return response
  }

  private reponseNonNullable<T>(data: T) {
    assertIsDefined(data)
    return this.response(data)
  }

  set delayResponse(delayResponse: number) {
    this._delayResponse = delayResponse
  }

  // Users
  private _user: User | null = null

  set user(user: User | null) {
    this._user = user
  }

  authenticateUser() {
    return this.response(this._user)
  }

  // Feed
  private _feed?: Pick<Feed, 'items' | 'nextPageToken'>

  set feed(feed: Pick<Feed, 'items' | 'nextPageToken'>) {
    this._feed = feed
  }

  retrieveFeed() {
    return this.reponseNonNullable(this._feed)
  }
}

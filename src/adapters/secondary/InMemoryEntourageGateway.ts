/* eslint-disable no-underscore-dangle */
import { of } from 'rxjs'
import { delay } from 'rxjs/operators'
import { EntourageGateway } from '../../coreLogic/gateways/EntourageGateway.interface'
import { User } from '../../coreLogic/models/User.model'

export class InMemoryEntourageGateway implements EntourageGateway {
  private _delayAuthenticateUserResponse = 0

  private _user: User | null = null

  authenticateUser() {
    const response = of(this._user)

    if (this._delayAuthenticateUserResponse) {
      return response.pipe(
        delay(this._delayAuthenticateUserResponse),
      )
    }

    return response
  }

  set delayAuthenticateUserResponse(delayAuthenticateUserResponse: number) {
    this._delayAuthenticateUserResponse = delayAuthenticateUserResponse
  }

  set user(user: User | null) {
    this._user = user
  }
}

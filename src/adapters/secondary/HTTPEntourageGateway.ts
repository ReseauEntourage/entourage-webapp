import { from } from 'rxjs'
import { EntourageGateway } from '../../coreLogic/gateways/EntourageGateway.interface'
import { api } from 'src/core/api'

export class HTTPEntourageGateway implements EntourageGateway {
  authenticateUser() {
    return from(api.request({
      name: '/users/me GET',
    }).then((res) => {
      const { user } = res.data

      if (!user.id) return null

      return {
        id: user.id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        uuid: user.uuid,
      }
    }))
  }
}

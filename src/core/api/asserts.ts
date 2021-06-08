import { LoggedUser } from 'src/core/api'
import { AnyCantFix } from 'src/utils/types'

export function assertsUserIsLogged(user: AnyCantFix): asserts user is LoggedUser {
  if (!user.id) {
    throw new Error('User is not logged')
  }
}

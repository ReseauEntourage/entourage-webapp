import { constants } from 'src/constants'
import { IAuthUserSensitizationStorage } from 'src/core/useCases/authUser'
import { assertCondition, isSSR } from 'src/utils/misc'

export class LocalAuthUserSensitizationStorage implements IAuthUserSensitizationStorage {
  private static getAndParseUserIds(): string[] | null {
    if (!isSSR) {
      const storageValue = localStorage.getItem(constants.SENSITIZATION_POPUP_KEY)
      if (storageValue) {
        const userIds = JSON.parse(storageValue)
        assertCondition(Array.isArray(userIds))
        return userIds
      }
    }
    return null
  }

  getHasSeenPopup(userId: number): boolean {
    const userIds = LocalAuthUserSensitizationStorage.getAndParseUserIds()
    if (userIds) {
      return userIds.includes(userId.toString())
    }
    return false
  }

  setHasSeenPopup(userId: number): void {
    const userIds = LocalAuthUserSensitizationStorage.getAndParseUserIds() ?? []
    if (!userIds.includes(userId.toString())) {
      userIds.push(userId.toString())
      localStorage.setItem(constants.SENSITIZATION_POPUP_KEY, JSON.stringify(userIds))
    }
  }
}

import { api } from 'src/core/api'
import { IAuthUserGateway, PhoneLookUpResponse, AuthUserErrorUnauthorized } from 'src/core/useCases/authUser'
import { assertIsDefined } from 'src/utils/misc'

export class HTTPAuthUserGateway implements IAuthUserGateway {
  phoneLookUp(data: { phone: string; }) {
    return api
      .request({
        name: '/users/lookup POST',
        data: {
          phone: data.phone,
        },
      })
      .then((res) => {
        const { status, secretType } = res.data
        if (status === 'not_found') {
          return PhoneLookUpResponse.PHONE_NOT_FOUND
        } if (status === 'found') {
          if (secretType === 'code') {
            return PhoneLookUpResponse.SMS_CODE_NEEDED
          }

          return PhoneLookUpResponse.PASSWORD_NEEDED
        }

        throw new Error('/users/lookup return invalid data')
      })
  }

  createAccount(data: { phone: string; }) {
    return api
      .request({
        name: '/users POST',
        data: {
          user: {
            phone: data.phone,
          },
        },
      })
      .then(() => null)
  }

  resetPassword(data: { phone: string; }) {
    return api
      .request({
        name: '/users/me/code PATCH',
        data: {
          code: { action: 'regenerate' },
          user: { phone: data.phone },
        },
      })
      .then(() => null)
  }

  private login(data: { phone: string; secret: string; }) {
    return api
      .request({
        name: '/login POST',
        data: {
          user: {
            phone: data.phone,
            secret: data.secret,
          },
        },
      })
      .then((res) => {
        const { user } = res.data

        assertIsDefined(user.id, 'user id')

        return {
          id: user.id,
          email: user.email ?? undefined,
          hasPassword: user.hasPassword,
          partner: user.partner ? { name: user.partner.name } : undefined,
          avatarUrl: user.avatarUrl ?? undefined,
          firstName: user.firstName ?? undefined,
          lastName: user.lastName ?? undefined,
          about: user.about ?? undefined,
          address: user.address ? { displayAddress: user.address.displayAddress } : undefined,
          token: user.token,
        }
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          // temp fix until remove notifServerError
          error.stopPropagation()

          throw new AuthUserErrorUnauthorized()
        }

        throw error
      })
  }

  loginWithPassword = (data: { phone: string; password: string; }) => {
    return this.login({
      phone: data.phone,
      secret: data.password,
    })
  }

  loginWithSMSCode = (data: { phone: string; SMSCode: string; }) => {
    return this.login({
      phone: data.phone,
      secret: data.SMSCode,
    })
  }

  definePassword(data: { password: string; passwordConfirmation: string; }) {
    return api
      .request({
        name: '/users/me PATCH',
        data: {
          user: {
            password: data.password,
          },
        },
      })
      .then(() => null)
  }
}

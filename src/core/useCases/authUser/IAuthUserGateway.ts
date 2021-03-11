import { AuthUserErrorUnkownPasswordError } from './authUser.errors'
import { AuthUserState } from './authUser.reducer'

export const PhoneLookUpResponse = {
  PASSWORD_NEEDED: 'PASSWORD_NEEDED',
  SMS_CODE_NEEDED: 'SMS_CODE_NEEDED',
  PHONE_NOT_FOUND: 'PHONE_NOT_FOUND',
} as const

type PhoneLookUpResponse = keyof typeof PhoneLookUpResponse

export interface IAuthUserGateway {
  phoneLookUp(data: { phone: string; }): Promise<PhoneLookUpResponse>;
  createAccount(data: { phone: string; }): Promise<null>;
  resetPassword(data: { phone: string; }): Promise<null>;
  loginWithSMSCode(data: { phone: string; SMSCode: string; }): Promise<NonNullable<AuthUserState['user']>>;
  loginWithPassword(data: { phone: string; password: string; }): Promise<NonNullable<AuthUserState['user']>>;
  updateMe(data: {
    about?: string;
    avatarKey?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  }): Promise<NonNullable<AuthUserState['user']>>;
  updateMeAddress(data: {
    googlePlaceId: string;
    googleSessionToken: google.maps.places.AutocompleteSessionToken;
  }): Promise<null>;
  definePassword(data: {
    password: string; passwordConfirmation: string;
  }): Promise<null | AuthUserErrorUnkownPasswordError>;
}

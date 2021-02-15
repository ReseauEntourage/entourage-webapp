import { UserStats } from 'src/core/api'
import { AuthUserAction, AuthUserActionType } from './authUser.actions'
import {
  PhoneValidationsError,
  PasswordValidationsError,
  SMSCodeValidationsError,
  PasswordConfirmationValidationsError,
} from './authUser.validations'

export const LoginSteps = {
  PHONE: 'PHONE',
  PASSWORD: 'PASSWORD',
  SMS_CODE: 'SMS_CODE',
  CREATE_PASSWORD: 'CREATE_PASSWORD',
  CREATE_ACCOUNT: 'CREATE_ACCOUNT',
} as const

export type LoginSteps = keyof typeof LoginSteps

export interface AuthUserState {
  isLogging: boolean;
  step: LoginSteps | null;
  user: null | {
    id: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    about?: string;
    hasPassword: boolean;
    avatarUrl?: string;
    address?: {
      displayAddress: string;
      latitude: number;
      longitude: number;
    };
    partner?: {
      name: string;
    };
    token: string;
    stats: UserStats;
    firstSignIn: boolean;
  };
  showSensitizationPopup: boolean;
  errors: {
    phone?: PhoneValidationsError;
    password?: PasswordValidationsError;
    passwordUnknowServerError?: string;
    passwordConfirmation?: PasswordConfirmationValidationsError;
    passwordConfirmationUnknowServerError?: string;
    code?: SMSCodeValidationsError;
  };
}

export const defaultAuthUserState: AuthUserState = {
  isLogging: false,
  step: 'PHONE',
  user: null,
  errors: {},
  showSensitizationPopup: false,
}

export function authUserReducer(state: AuthUserState = defaultAuthUserState, action: AuthUserAction): AuthUserState {
  switch (action.type) {
    case AuthUserActionType.PHONE_LOOK_UP: {
      return {
        ...state,
        isLogging: true,
      }
    }

    case AuthUserActionType.CREATE_ACCOUNT: {
      return {
        ...state,
        isLogging: true,
      }
    }

    case AuthUserActionType.CREATE_ACCOUNT_SUCCEEDED: {
      return {
        ...state,
        step: LoginSteps.SMS_CODE,
        isLogging: false,
      }
    }

    case AuthUserActionType.LOGIN_WITH_SMS_CODE_SUCCEEDED: {
      return {
        ...state,
        step: LoginSteps.CREATE_PASSWORD,
        user: action.payload.user,
      }
    }

    case AuthUserActionType.CREATE_PASSWORD_SUCCEEDED: {
      return {
        ...state,
        step: null,
      }
    }

    case AuthUserActionType.ASK_CREATE_ACCOUNT: {
      return {
        ...state,
        step: LoginSteps.CREATE_ACCOUNT,
        isLogging: false,
      }
    }

    case AuthUserActionType.ASK_SMS_CODE: {
      return {
        ...state,
        step: LoginSteps.SMS_CODE,
        isLogging: false,
      }
    }

    case AuthUserActionType.ASK_PASSWORD: {
      return {
        ...state,
        step: LoginSteps.PASSWORD,
        isLogging: false,
      }
    }

    case AuthUserActionType.RESET_PASSWORD_SUCCEEDED: {
      return {
        ...state,
        step: LoginSteps.SMS_CODE,
      }
    }

    case AuthUserActionType.LOGIN_WITH_PASSWORD_SUCCEEDED: {
      return {
        ...state,
        user: action.payload.user,
      }
    }

    case AuthUserActionType.SET_ERRORS: {
      return {
        ...state,
        errors: action.payload,
      }
    }

    case AuthUserActionType.RESET_FORM: {
      return {
        ...state,
        step: LoginSteps.PHONE,
        errors: {},
        isLogging: false,
      }
    }

    case AuthUserActionType.SET_USER: {
      return {
        ...state,
        user: action.payload.user,
        step: action.payload.user ? null : LoginSteps.PHONE,
      }
    }

    case AuthUserActionType.SHOW_SENSITIZATION_POPUP: {
      return {
        ...state,
        showSensitizationPopup: action.payload,
        step: null,
      }
    }

    case AuthUserActionType.HIDE_SENSITIZATION_POPUP: {
      return {
        ...state,
        showSensitizationPopup: false,
      }
    }

    default:
      return state
  }
}

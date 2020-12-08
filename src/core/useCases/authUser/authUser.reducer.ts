import { Action, ActionType } from './authUser.actions'
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
    };
    partner?: {
      name: string;
    };
    token: string;
  };
  errors: {
    phone?: PhoneValidationsError;
    password?: PasswordValidationsError;
    passwordUnknowServerError?: string;
    passwordConfirmation?: PasswordConfirmationValidationsError;
    passwordConfirmationUnknowServerError?: string;
    code?: SMSCodeValidationsError;
  };
}

export const authuserDefaultState: AuthUserState = {
  isLogging: false,
  step: 'PHONE',
  user: null,
  errors: {},
}

export function authUserReducer(state: AuthUserState = authuserDefaultState, action: Action): AuthUserState {
  switch (action.type) {
    case ActionType.PHONE_LOOK_UP: {
      return {
        ...state,
        isLogging: true,
      }
    }

    case ActionType.CREATE_ACCOUNT_SUCCEEDED: {
      return {
        ...state,
        step: LoginSteps.SMS_CODE,
        isLogging: false,
      }
    }

    case ActionType.LOGIN_WITH_SMS_CODE_SUCCEEDED: {
      return {
        ...state,
        step: LoginSteps.CREATE_PASSWORD,
        user: action.payload.user,
      }
    }

    case ActionType.CREATE_PASSWORD_SUCCEEDED: {
      return {
        ...state,
        step: null,
      }
    }

    case ActionType.ASK_SMS_CODE: {
      return {
        ...state,
        step: LoginSteps.SMS_CODE,
        isLogging: false,
      }
    }

    case ActionType.ASK_PASSWORD: {
      return {
        ...state,
        step: LoginSteps.PASSWORD,
        isLogging: false,
      }
    }

    case ActionType.RESET_PASSWORD_SUCCEEDED: {
      return {
        ...state,
        step: LoginSteps.SMS_CODE,
      }
    }

    case ActionType.LOGIN_WITH_PASSWORD_SUCCEEDED: {
      return {
        ...state,
        user: action.payload.user,
        step: null,
      }
    }

    case ActionType.SET_ERRORS: {
      return {
        ...state,
        errors: action.payload,
      }
    }

    case ActionType.RESET_FORM: {
      return {
        ...state,
        step: LoginSteps.PHONE,
        errors: {},
        isLogging: false,
      }
    }

    case ActionType.SET_USER: {
      return {
        ...state,
        user: action.payload,
      }
    }

    default:
      return state
  }
}

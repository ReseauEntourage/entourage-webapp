import { toCamelCase } from 'src/utils/misc'
import {
  FirebaseEvent,
  FirebaseEventFunction,
  FirebaseEvents,
  FirebaseProps,
  ActionFromMapObject,
  ActionsFromMapObject,
} from 'src/utils/types'

type GeneratedFirebaseActionType = Record<FirebaseEvent, string>

export const FirebaseActionType: GeneratedFirebaseActionType = FirebaseEvents.reduce((acc, curr) => {
  return {
    ...acc,
    [curr as FirebaseEvent]: `FIREBASE/${curr}`,
  }
}, {} as GeneratedFirebaseActionType)

export type FirebaseActionType = keyof typeof FirebaseActionType

type GeneratedFirebaseActions = Record<FirebaseEventFunction, (params?: FirebaseProps) => {
  type: string;
  payload?: FirebaseProps;
}>

// ------------------------------------------------------------------------

const firebaseActions: GeneratedFirebaseActions = FirebaseEvents.reduce((acc, curr) => {
  return {
    ...acc,
    [toCamelCase(`send_${curr}`) as FirebaseEventFunction]: (props?: Record<string, string>) => {
      return { type: FirebaseActionType[curr as FirebaseEvent], payload: props }
    },
  }
}, {} as GeneratedFirebaseActions)

// --------------------------------------------------------------------------------

export const publicActions = {
  ...firebaseActions,
}

const privateActions = {
}

export const actions = {
  ...publicActions,
  ...privateActions,
}

export type FirebaseActions = ActionsFromMapObject<typeof actions>
export type FirebaseAction = ActionFromMapObject<typeof actions>

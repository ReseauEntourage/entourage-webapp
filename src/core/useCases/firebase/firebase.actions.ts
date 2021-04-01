import {
  FirebaseEvent,
  FirebaseProps,
  ActionFromMapObject,
  ActionsFromMapObject,
} from 'src/utils/types'

export const FirebaseActionType = {
  SEND_EVENT: 'FIREBASE/SEND_EVENT',
} as const

export type GeneratedFirebaseActionType = Record<FirebaseEvent, string>

// ------------------------------------------------------------------------

function sendFirebaseEvent(payload: {
  event: FirebaseEvent;
  props?: FirebaseProps;
}) {
  return {
    type: FirebaseActionType.SEND_EVENT,
    payload,
  }
}
// --------------------------------------------------------------------------------

export const publicActions = {
  sendFirebaseEvent,
}

const privateActions = {
}

export const actions = {
  ...publicActions,
  ...privateActions,
}

export type FirebaseActions = ActionsFromMapObject<typeof actions>
export type FirebaseAction = ActionFromMapObject<typeof actions>

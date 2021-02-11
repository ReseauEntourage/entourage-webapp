import { ActionFromMapObject, ActionsFromMapObject } from 'src/utils/types'
import { POIsState } from './pois.reducer'

export const POIsActionType = {
  INIT_POIS: 'POIS/INIT_POIS',
  CANCEL_POIS: 'POIS/CANCEL_POIS',
  RETRIEVE_POIS: 'POIS/RETRIEVE_POIS',
  RETRIEVE_POIS_STARTED: 'POIS/RETRIEVE_POIS_STARTED',
  RETRIEVE_POIS_SUCCEEDED: 'POIS/RETRIEVE_POIS_SUCCEEDED',
  RETRIEVE_POI_DETAILS_ENDED: 'POIS/RETRIEVE_POI_DETAILS_ENDED',
  RETRIEVE_POI_DETAILS_SUCCEEDED: 'POIS/RETRIEVE_POI_DETAILS_SUCCEEDED',
  SET_CURRENT_POI_UUID: 'POIS/SET_CURRENT_POI_UUID',
} as const

export type POIsActionType = keyof typeof POIsActionType;

// ------------------------------------------------------------------------

function init() {
  return {
    type: POIsActionType.INIT_POIS,
  }
}

function cancel() {
  return {
    type: POIsActionType.CANCEL_POIS,
  }
}

function retrievePOIs() {
  return {
    type: POIsActionType.RETRIEVE_POIS,
  }
}

function retrievePOIsStarted() {
  return {
    type: POIsActionType.RETRIEVE_POIS_STARTED,
  }
}

function retrievePOIDetailsEnded() {
  return {
    type: POIsActionType.RETRIEVE_POI_DETAILS_ENDED,
  }
}

function retrievePOIsSuccess(
  payload: {
    pois: POIsState['pois'][string][];
  },
) {
  return {
    type: POIsActionType.RETRIEVE_POIS_SUCCEEDED,
    payload,
  }
}

function retrievePOIDetailsSuccess(
  payload: {
    poiDetails: POIsState['detailedPOIs'][string];
  },
) {
  return {
    type: POIsActionType.RETRIEVE_POI_DETAILS_SUCCEEDED,
    payload,
  }
}

function setCurrentPOIUuid(payload: string | null) {
  return {
    type: POIsActionType.SET_CURRENT_POI_UUID,
    payload,
  }
}

// --------------------------------------------------------------------------------

export const publicActions = {
  init,
  cancel,
  retrievePOIs,
  setCurrentPOIUuid,
}

const privateActions = {
  retrievePOIsStarted,
  retrievePOIsSuccess,
  retrievePOIDetailsEnded,
  retrievePOIDetailsSuccess,
}

export const actions = {
  ...publicActions,
  ...privateActions,
}

export type POIsActions = ActionsFromMapObject<typeof actions>
export type POIsAction = ActionFromMapObject<typeof actions>

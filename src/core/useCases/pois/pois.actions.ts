import {
  ActionFromMapObject,
  ActionsFromMapObject,
  FilterPOICategory, FilterPOIPartner,
} from 'src/utils/types'
import { POIsState } from './pois.reducer'

export const POIsActionType = {
  INIT_POIS: 'POIS/INIT_POIS',
  CANCEL_POIS: 'POIS/CANCEL_POIS',
  RETRIEVE_POIS: 'POIS/RETRIEVE_POIS',
  RETRIEVE_POIS_STARTED: 'POIS/RETRIEVE_POIS_STARTED',
  RETRIEVE_POIS_SUCCEEDED: 'POIS/RETRIEVE_POIS_SUCCEEDED',
  RETRIEVE_POI_DETAILS_STARTED: 'POIS/RETRIEVE_POI_DETAILS_STARTED',
  RETRIEVE_POI_DETAILS_SUCCEEDED: 'POIS/RETRIEVE_POI_DETAILS_SUCCEEDED',
  SET_CURRENT_POI_UUID: 'POIS/SET_CURRENT_POI_UUID',
  REMOVE_CURRENT_POI_UUID: 'POIS/REMOVE_CURRENT_POI_UUID',
  TOGGLE_POIS_FILTER: 'POIS/TOGGLE_POIS_FILTER',
  RESET_POIS_FILTERS: 'POIS/RESET_POIS_FILTERS',
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

function retrievePOIDetailsStarted() {
  return {
    type: POIsActionType.RETRIEVE_POI_DETAILS_STARTED,
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

function removeCurrentPOIUuid() {
  return {
    type: POIsActionType.REMOVE_CURRENT_POI_UUID,
  }
}

function togglePOIsFilter(payload: { category: FilterPOICategory; partner?: FilterPOIPartner; }) {
  return {
    type: POIsActionType.TOGGLE_POIS_FILTER,
    payload,
  }
}

function resetPOIsFilters() {
  return {
    type: POIsActionType.RESET_POIS_FILTERS,
  }
}

// --------------------------------------------------------------------------------

export const publicActions = {
  init,
  cancel,
  retrievePOIs,
  setCurrentPOIUuid: setCurrentConversationUuid,
  removeCurrentPOIUuid,
  togglePOIsFilter,
  resetPOIsFilters,
}

const privateActions = {
  retrievePOIsStarted,
  retrievePOIsSuccess,
  retrievePOIDetailsStarted,
  retrievePOIDetailsSuccess,
}

export const actions = {
  ...publicActions,
  ...privateActions,
}

export type POIsActions = ActionsFromMapObject<typeof actions>
export type POIsAction = ActionFromMapObject<typeof actions>

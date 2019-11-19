import { ResourcesState } from './index'

type ActionType =
  | 'UPDATE_PENDING'
  | 'DELETE_PENDING'
  | 'UPDATE_SUCCEEDED'
  | 'DELETE_SUCCEEDED'
  | 'UPDATE_FAILED'
  | 'DELETE_FAILED'
  | 'INSERT_REQUEST_RESOURCE';


export interface Action {
  key: '@@REACT_RESOURCES_HOOK';
  type: ActionType;
  resourceType: keyof ResourcesState;
  requestKey: string;
  payload: object[];
}

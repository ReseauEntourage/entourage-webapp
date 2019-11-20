import { Store as ReduxStore } from 'redux'
import { Schema as SchemaRelationStore } from 'react-resources-store'
import { ResourcesState } from './resources'

interface StoreState extends ResourcesState {}

export interface Store extends ReduxStore<StoreState, Action> {}

type Action = ActionResource


// ----------------------------------------

type ActionType =
  | 'UPDATE_PENDING'
  | 'DELETE_PENDING'
  | 'UPDATE_SUCCEEDED'
  | 'DELETE_SUCCEEDED'
  | 'UPDATE_FAILED'
  | 'DELETE_FAILED'
  | 'INSERT_REQUEST_RESOURCE';

export interface ActionResource {
  key: '@@REACT_RESOURCES_HOOK';
  type: ActionType;
  resourceType: keyof StoreState;
  requestKey: string;
  payload: object | object[];
}

// ----------------------------------------

export type SchemaRelation = SchemaRelationStore['']

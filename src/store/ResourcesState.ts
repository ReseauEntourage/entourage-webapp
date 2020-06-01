export type ActionTypes =
  | 'READ_RESOURCES_PENDING'
  | 'READ_RESOURCES_SUCCEEDED'
  | 'READ_RESOURCES_FAILED'
  | 'CREATE_RESOURCES_PENDING'
  | 'CREATE_RESOURCES_SUCCEEDED'
  | 'CREATE_RESOURCES_FAILED'
  | 'UPDATE_RESOURCES_PENDING'
  | 'UPDATE_RESOURCES_SUCCEEDED'
  | 'UPDATE_RESOURCES_FAILED'
  | 'DELETE_RESOURCES_PENDING'
  | 'DELETE_RESOURCES_SUCCEEDED'
  | 'DELETE_RESOURCES_FAILED'
  | 'UPDATE_RESOURCES'
  | 'DELETE_RESOURCES'

export type RequestStatus = 'IDLE' | 'PENDING' | 'SUCCEEDED' | 'FAILED'

export interface ReduxResourceRequest {
  ids?: string[] | number[];
  requestKey: string;
  requestName: string;
  resourceType: string;
  status: RequestStatus;
}

export interface ReduxResourceMeta {
  createStatus: RequestStatus;
  deleteStatus: RequestStatus;
  readStatus: RequestStatus;
  updateStatus: RequestStatus;
}

export interface ResourcesState<T> {
  lists: {
    [listName: string]: string[];
  };
  meta: {
    [resourceId: string]: ReduxResourceMeta;
  };
  requests: {
    [requestKey: string]: ReduxResourceRequest;
  };
  resourceType: string;
  resources: {
    [resourceId: string]: T;
  };
}

export interface ReduxResourceAction<ResourceType = string, RequestName = string, Resource = unknown> {
  requestKey: string;
  requestName: RequestName;
  requestProperties?: unknown;
  resourceType: ResourceType;
  resources?: Resource[];
  type: ActionTypes;
}

export const getInitialStateResources = <T extends string>(resourceType: T): ResourcesState<T> => {
  return {
    resources: {},
    resourceType,
    meta: {},
    lists: {},
    requests: {},
  }
}

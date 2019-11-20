import { AxiosResponse } from 'axios'
import { getRequestHash } from 'react-resources-store'
import { Parameters } from 'src/types'
import { ResourceType, ResourceConfig, resourcesConfig } from './resources'
import { ActionResource } from './types'

function fetchResources<T extends ResourceType>(
  resourceType: T,
  response: AxiosResponse<Parameters<ResourceConfig<T>['fetchResolver']>[0]>,
): ActionResource {
  const { config } = response
  const { fetchResolver } = resourcesConfig[resourceType]

  return {
    key: '@@REACT_RESOURCES_HOOK',
    type: 'UPDATE_SUCCEEDED',
    resourceType,
    requestKey: getRequestHash(config.url || '', config.method || '', config.params),
    payload: fetchResolver(response.data),
  }
}


export const actions = {
  fetchResources,
}

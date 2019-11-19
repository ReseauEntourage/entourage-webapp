import { useRequest } from 'react-resources-store'
import { ResourceType, Resource } from './resources'

function readResolver(resourceType: string, requestKey: string) {
  return () => ({
    method: 'GET',
    requestKey,
    resourceType,
    resourceId: '',
    request: () => {},
  })
}

export function useReadResource<T extends ResourceType>(resourceType: T, requestKey: string) {
  const resolverArgs = readResolver(resourceType, requestKey)

  return useRequest<Resource<T>[]>(resolverArgs, { fetchPolicy: 'cache-only' })
}

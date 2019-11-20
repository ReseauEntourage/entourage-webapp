import { useRequest } from 'react-resources-store'
import { ResourceType, Resource } from './resources'

function createReadResolver(resourceType: string, requestKey: string) {
  return () => ({
    method: 'GET',
    requestKey,
    resourceType,
    resourceId: '',
    request: () => {},
  })
}

export function useReadResource<T extends ResourceType>(resourceType: T, requestKey: string) {
  const resolver = createReadResolver(resourceType, requestKey)

  return useRequest<Resource<T>[]>(resolver, { fetchPolicy: 'cache-only' })
}

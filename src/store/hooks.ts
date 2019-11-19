import { useRequest } from 'react-resources-store'
import { ResourceType, Resource } from './resources'

export function useReadResource<T extends ResourceType>(resourceType: T, requestKey: string) {
  return useRequest<Resource<T>[]>({
    resourceType,
    requestKey,
  }, { fetchPolicy: 'cache-only' })
}
